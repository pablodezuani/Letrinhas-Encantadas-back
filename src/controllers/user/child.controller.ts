import { Request, Response } from 'express';
import { ChildService } from '../../services/child/child.service';


const childService = new ChildService();

export class ChildController {
  async handleCreate(req: Request, res: Response) {
    try {
      const data = req.body;

      if (!data.name || !data.parentId) {
        return res.status(400).json({ error: 'Name and parentId are required' });
      }

      const child = await childService.create(data);

      return res.status(201).json(child);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Unexpected error' });
    }
  }
}
