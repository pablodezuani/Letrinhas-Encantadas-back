import { Request, Response } from 'express';
import { DashboardService } from '../../services/dashboard/DashboardService';

const service = new DashboardService();

export class DashboardController {
  async handleMetrics(req: Request, res: Response) {
    const metrics = await service.getMetrics();
    return res.json(metrics);
  }

  async handleChildrenList(req: Request, res: Response) {
    const { search } = req.query;
    const children = await service.getChildrenList(search as string);
    return res.json(children);
  }

  async handleParentsList(req: Request, res: Response) {
    const { search } = req.query;
    const parents = await service.getParentsList(search as string);
    return res.json(parents);
  }

  async handleParentDetail(req: Request, res: Response) {
    try {
      const { parentId } = req.params;
      const detail = await service.getParentDetail(parentId);
      return res.json(detail);
    } catch (error: any) {
      const status = error.message.includes('not found') ? 404 : 500;
      return res.status(status).json({ error: error.message || 'Unexpected error' });
    }
  }

  async handleChildDetail(req: Request, res: Response) {
    const { childId } = req.params;
    const detail = await service.getChildDetail(childId);
    return res.json(detail);
  }
}
