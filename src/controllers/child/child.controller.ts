import { Request, Response } from 'express';
import { ChildService } from '../../services/child/child.service';

const childService = new ChildService();

export class ChildController {
  async handleCreate(req: Request, res: Response) {
    try {
      const parentId = req.user_id;
      const data = req.body;

      if (!data.name) return res.status(400).json({ error: 'Name is required' });

      const child = await childService.create({ ...data, parentId });
      return res.status(201).json(child);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Unexpected error' });
    }
  }

  async handleUpdate(req: Request, res: Response) {
    try {
      const parentId = req.user_id;
      const { id } = req.params;
      const data = req.body;

      const child = await childService.update(id, parentId, data);
      return res.status(200).json(child);
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      return res.status(status).json({ error: error.message || 'Unexpected error' });
    }
  }

  async handleDelete(req: Request, res: Response) {
    try {
      const parentId = req.user_id;
      const { id } = req.params;

      const result = await childService.delete(id, parentId);
      return res.status(200).json(result);
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      return res.status(status).json({ error: error.message || 'Unexpected error' });
    }
  }

  async handleListAllWithParent(req: Request, res: Response) {
    try {
      const children = await childService.findAllWithParent();
      return res.status(200).json(children);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Unexpected error' });
    }
  }

  async handleListByParent(req: Request, res: Response) {
    try {
      const parentId = req.user_id;
      if (!parentId) return res.status(401).json({ error: 'Unauthorized' });

      const children = await childService.findByParent(parentId);
      return res.status(200).json(children);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Unexpected error' });
    }
  }
}
