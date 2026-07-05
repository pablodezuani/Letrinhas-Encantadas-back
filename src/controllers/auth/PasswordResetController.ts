import { Request, Response } from 'express';
import { PasswordResetService } from '../../services/auth/PasswordResetService';

const service = new PasswordResetService();

export class PasswordResetController {
  async handleRequest(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const result = await service.requestReset(email);
    return res.json(result);
  }

  async handleConfirm(req: Request, res: Response) {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'Token and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const result = await service.confirmReset(token, password);
    return res.json(result);
  }
}
