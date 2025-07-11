import { Request, Response } from 'express';
import { ChildService } from '../../services/child/child.service';

const childService = new ChildService();

export class ChildController {
  async handleCreate(req: Request, res: Response) {
    try {
      const parentId = req.user_id;
      const data = req.body;

      if (!data.name) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const child = await childService.create({ ...data, parentId });
      return res.status(201).json(child);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Unexpected error' });
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
      if (!parentId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const children = await childService.findByParent(parentId);
      return res.status(200).json(children);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Unexpected error' });
    }
  }
}
