import prismaClient from '../../prisma';

interface GameSessionItemInput {
  content: string;
  correct: boolean;
  attempts?: number;
  timeSpent?: number;
}

interface CreateSessionInput {
  childId: string;
  gameType: string;
  score: number;
  maxScore: number;
  timeSpent: number;
  completed: boolean;
  items?: GameSessionItemInput[];
}

class GameSessionService {
  async create(data: CreateSessionInput) {
    const { items, ...sessionData } = data;

    const child = await prismaClient.child.findUnique({ where: { id: data.childId } });

    if (!child) throw new Error('Child not found');

    return prismaClient.gameSession.create({
      data: {
        ...sessionData,
        items: items?.length
          ? { create: items }
          : undefined,
      },
      include: { items: true },
    });
  }

  async listByChild(childId: string) {
    return prismaClient.gameSession.findMany({
      where: { childId },
      include: { items: true },
      orderBy: { playedAt: 'desc' },
    });
  }

  async summaryByChild(childId: string) {
    const sessions = await prismaClient.gameSession.findMany({
      where: { childId },
      include: { items: true },
      orderBy: { playedAt: 'desc' },
    });

    const byGame: Record<string, { sessions: number; avgScore: number; lastPlayed: Date }> = {};

    for (const session of sessions) {
      if (!byGame[session.gameType]) {
        byGame[session.gameType] = { sessions: 0, avgScore: 0, lastPlayed: session.playedAt };
      }

      const g = byGame[session.gameType];
      const pct = session.maxScore > 0 ? (session.score / session.maxScore) * 100 : 0;
      g.avgScore = (g.avgScore * g.sessions + pct) / (g.sessions + 1);
      g.sessions += 1;

      if (session.playedAt > g.lastPlayed) g.lastPlayed = session.playedAt;
    }

    return {
      totalSessions: sessions.length,
      byGame,
      recentSessions: sessions.slice(0, 10),
    };
  }
}

export { GameSessionService };
