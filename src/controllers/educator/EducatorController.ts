import { Request, Response } from 'express';
import { EducatorService } from '../../services/educator/EducatorService';

const service = new EducatorService();

export class EducatorController {
  async handleCreate(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const educator = await service.create({ name, email, password });
    return res.status(201).json(educator);
  }

  async handleList(req: Request, res: Response) {
    const educators = await service.list();
    return res.json(educators);
  }

  async handleDelete(req: Request, res: Response) {
    const { id } = req.params;
    const result = await service.delete(id);
    return res.json(result);
  }
}
