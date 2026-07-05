import { Router } from 'express';

import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailuserController } from './controllers/user/DetailUserController';
import { ChildController } from './controllers/child/child.controller';
import { PasswordResetController } from './controllers/auth/PasswordResetController';
import { WordController } from './controllers/word/WordController';
import { EducatorController } from './controllers/educator/EducatorController';
import { GameSessionController } from './controllers/game/GameSessionController';
import { DashboardController } from './controllers/dashboard/DashboardController';

import { isAuthenticated } from './middlewares/isAuthenticated';
import { hasRole } from './middlewares/hasRole';

const router = Router();

// ─── AUTH ──────────────────────────────────────────────────────────────────────
router.post('/users', new CreateUserController().handle);
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailuserController().handle);

// ─── PASSWORD RESET ────────────────────────────────────────────────────────────
const passwordReset = new PasswordResetController();
router.post('/password-reset/request', passwordReset.handleRequest.bind(passwordReset));
router.post('/password-reset/confirm', passwordReset.handleConfirm.bind(passwordReset));

// ─── PARENT — crianças ─────────────────────────────────────────────────────────
const childController = new ChildController();
router.post('/children', isAuthenticated, childController.handleCreate.bind(childController));
router.get('/my-children', isAuthenticated, childController.handleListByParent.bind(childController));
router.put('/children/:id', isAuthenticated, childController.handleUpdate.bind(childController));
router.delete('/children/:id', isAuthenticated, childController.handleDelete.bind(childController));

// ─── PARENT — sessões dos filhos ───────────────────────────────────────────────
const gameSession = new GameSessionController();
router.post('/game-sessions', isAuthenticated, gameSession.handleCreate.bind(gameSession));
router.get('/children/:childId/sessions', isAuthenticated, gameSession.handleListByChild.bind(gameSession));
router.get('/children/:childId/sessions/summary', isAuthenticated, gameSession.handleSummaryByChild.bind(gameSession));

// ─── WORDS (mobile — público para palavras ativas) ────────────────────────────
const wordController = new WordController();
router.get('/words', wordController.handleList.bind(wordController));

// ─── ADMIN + EDUCATOR — dashboard e crianças ──────────────────────────────────
const dashboard = new DashboardController();
router.get(
  '/educator/dashboard',
  isAuthenticated,
  hasRole('EDUCATOR', 'ADMIN'),
  dashboard.handleMetrics.bind(dashboard),
);
router.get(
  '/educator/children',
  isAuthenticated,
  hasRole('EDUCATOR', 'ADMIN'),
  dashboard.handleChildrenList.bind(dashboard),
);
router.get(
  '/educator/parents',
  isAuthenticated,
  hasRole('EDUCATOR', 'ADMIN'),
  dashboard.handleParentsList.bind(dashboard),
);
router.get(
  '/educator/parents/:parentId',
  isAuthenticated,
  hasRole('EDUCATOR', 'ADMIN'),
  dashboard.handleParentDetail.bind(dashboard),
);
router.get(
  '/educator/children/:childId',
  isAuthenticated,
  hasRole('EDUCATOR', 'ADMIN'),
  dashboard.handleChildDetail.bind(dashboard),
);

// ─── ADMIN — gerenciamento de palavras ────────────────────────────────────────
router.post('/admin/words', isAuthenticated, hasRole('ADMIN'), wordController.handleCreate.bind(wordController));
router.put('/admin/words/:id', isAuthenticated, hasRole('ADMIN'), wordController.handleUpdate.bind(wordController));
router.delete('/admin/words/:id', isAuthenticated, hasRole('ADMIN'), wordController.handleDelete.bind(wordController));

// ─── ADMIN — gerenciamento de educadores ──────────────────────────────────────
const educatorController = new EducatorController();
router.post('/admin/educators', isAuthenticated, hasRole('ADMIN'), educatorController.handleCreate.bind(educatorController));
router.get('/admin/educators', isAuthenticated, hasRole('ADMIN'), educatorController.handleList.bind(educatorController));
router.delete('/admin/educators/:id', isAuthenticated, hasRole('ADMIN'), educatorController.handleDelete.bind(educatorController));

// ─── LEGACY (mantida para compatibilidade com app antigo) ─────────────────────
router.get('/children/with-parent', isAuthenticated, hasRole('ADMIN'), (req, res) =>
  childController.handleListAllWithParent(req, res),
);

export { router };
