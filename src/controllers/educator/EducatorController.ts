import { Request, Response } from 'express';
import { EducatorService } from '../../services/educator/EducatorService';

const service = new EducatorService();

const VALID_STATUSES = ['ACTIVE', 'BLOCKED', 'INACTIVE'];

export class EducatorController {
  async handleCreate(req: Request, res: Response) {
    const { name, email, password, cpf, photo } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const educator = await service.create({ name, email, password, cpf, photo });
    return res.status(201).json(educator);
  }

  async handleList(req: Request, res: Response) {
    const educators = await service.list();
    return res.json(educators);
  }

  async handleUpdate(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, cpf, photo } = req.body;

    const educator = await service.update(id, { name, email, cpf, photo });
    return res.json(educator);
  }

  async handleUpdateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const educator = await service.updateStatus(id, status);
    return res.json(educator);
  }

  async handleDelete(req: Request, res: Response) {
    const { id } = req.params;
    const result = await service.delete(id);
    return res.json(result);
  }
}
