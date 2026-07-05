import { Request, Response } from 'express';
import { WordService } from '../../services/word/WordService';

const service = new WordService();

export class WordController {
  async handleCreate(req: Request, res: Response) {
    const { text, category, difficulty, emoji, sound, data, imageUrl, audioUrl, gameTypes } = req.body;

    if (!text || !category) {
      return res.status(400).json({ error: 'Text and category are required' });
    }

    const word = await service.create({ text, category, difficulty, emoji, sound, data, imageUrl, audioUrl, gameTypes });
    return res.status(201).json(word);
  }

  async handleList(req: Request, res: Response) {
    const { gameType, category, difficulty, active, search } = req.query;

    const words = await service.list({
      gameType: gameType as string,
      category: category as string,
      difficulty: difficulty as string,
      active: active !== undefined ? active === 'true' : undefined,
      search: search as string,
    });

    return res.json(words);
  }

  async handleUpdate(req: Request, res: Response) {
    const { id } = req.params;
    const word = await service.update(id, req.body);
    return res.json(word);
  }

  async handleDelete(req: Request, res: Response) {
    const { id } = req.params;
    const result = await service.delete(id);
    return res.json(result);
  }
}
