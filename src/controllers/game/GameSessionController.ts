import { Request, Response } from 'express';
import { GameSessionService } from '../../services/game/GameSessionService';

const service = new GameSessionService();

export class GameSessionController {
  async handleCreate(req: Request, res: Response) {
    const { childId, gameType, score, maxScore, timeSpent, completed, items } = req.body;

    if (!childId || !gameType) {
      return res.status(400).json({ error: 'childId and gameType are required' });
    }

    const session = await service.create({
      childId,
      gameType,
      score: score ?? 0,
      maxScore: maxScore ?? 0,
      timeSpent: timeSpent ?? 0,
      completed: completed ?? false,
      items,
    });

    return res.status(201).json(session);
  }

  async handleListByChild(req: Request, res: Response) {
    const { childId } = req.params;
    const sessions = await service.listByChild(childId);
    return res.json(sessions);
  }

  async handleSummaryByChild(req: Request, res: Response) {
    const { childId } = req.params;
    const summary = await service.summaryByChild(childId);
    return res.json(summary);
  }
}
