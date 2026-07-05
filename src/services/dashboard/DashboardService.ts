import prismaClient from '../../prisma';

class DashboardService {
  async getMetrics() {
    const [totalChildren, totalParents, totalSessions, recentSessions] = await Promise.all([
      prismaClient.child.count(),
      prismaClient.user.count({ where: { role: 'PARENT' } }),
      prismaClient.gameSession.count(),
      prismaClient.gameSession.findMany({
        take: 20,
        orderBy: { playedAt: 'desc' },
        include: {
          child: { select: { id: true, name: true } },
        },
      }),
    ]);

    const sessionsByGame = await prismaClient.gameSession.groupBy({
      by: ['gameType'],
      _count: { id: true },
      _avg: { score: true, timeSpent: true },
    });

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const sessionsLast30Days = await prismaClient.gameSession.count({
      where: { playedAt: { gte: last30Days } },
    });

    return {
      totalChildren,
      totalParents,
      totalSessions,
      sessionsLast30Days,
      sessionsByGame,
      recentSessions,
    };
  }

  async getChildrenList(search?: string) {
    return prismaClient.child.findMany({
      where: search
        ? { name: { contains: search, mode: 'insensitive' } }
        : undefined,
      include: {
        parent: { select: { id: true, name: true, email: true } },
        _count: { select: { gameSessions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getParentsList(search?: string) {
    return prismaClient.user.findMany({
      where: {
        role: 'PARENT',
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        _count: { select: { children: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getParentDetail(parentId: string) {
    const parent = await prismaClient.user.findFirst({
      where: { id: parentId, role: 'PARENT' },
      select: { id: true, name: true, email: true, role: true, created_at: true },
    });

    if (!parent) throw new Error('Parent not found');

    const children = await prismaClient.child.findMany({
      where: { parentId },
      include: { _count: { select: { gameSessions: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return { parent, children };
  }

  async getChildDetail(childId: string) {
    const child = await prismaClient.child.findUnique({
      where: { id: childId },
      include: {
        parent: { select: { id: true, name: true, email: true } },
      },
    });

    if (!child) throw new Error('Child not found');

    const sessions = await prismaClient.gameSession.findMany({
      where: { childId },
      include: { items: true },
      orderBy: { playedAt: 'desc' },
    });

    const byGame: Record<string, { sessions: number; totalScore: number; totalMax: number }> = {};

    for (const s of sessions) {
      if (!byGame[s.gameType]) byGame[s.gameType] = { sessions: 0, totalScore: 0, totalMax: 0 };
      byGame[s.gameType].sessions += 1;
      byGame[s.gameType].totalScore += s.score;
      byGame[s.gameType].totalMax += s.maxScore;
    }

    const gameStats = Object.entries(byGame).map(([gameType, data]) => ({
      gameType,
      sessions: data.sessions,
      avgScorePct: data.totalMax > 0 ? Math.round((data.totalScore / data.totalMax) * 100) : 0,
    }));

    return { child, sessions, gameStats };
  }
}

export { DashboardService };
