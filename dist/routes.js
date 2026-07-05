"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const CreateUserController_1 = require("./controllers/user/CreateUserController");
const AuthUserController_1 = require("./controllers/user/AuthUserController");
const DetailUserController_1 = require("./controllers/user/DetailUserController");
const child_controller_1 = require("./controllers/child/child.controller");
const PasswordResetController_1 = require("./controllers/auth/PasswordResetController");
const WordController_1 = require("./controllers/word/WordController");
const EducatorController_1 = require("./controllers/educator/EducatorController");
const GameSessionController_1 = require("./controllers/game/GameSessionController");
const DashboardController_1 = require("./controllers/dashboard/DashboardController");
const isAuthenticated_1 = require("./middlewares/isAuthenticated");
const hasRole_1 = require("./middlewares/hasRole");
const router = (0, express_1.Router)();
exports.router = router;
// ─── AUTH ──────────────────────────────────────────────────────────────────────
router.post('/users', new CreateUserController_1.CreateUserController().handle);
router.post('/session', new AuthUserController_1.AuthUserController().handle);
router.get('/me', isAuthenticated_1.isAuthenticated, new DetailUserController_1.DetailuserController().handle);
// ─── PASSWORD RESET ────────────────────────────────────────────────────────────
const passwordReset = new PasswordResetController_1.PasswordResetController();
router.post('/password-reset/request', passwordReset.handleRequest.bind(passwordReset));
router.post('/password-reset/confirm', passwordReset.handleConfirm.bind(passwordReset));
// ─── PARENT — crianças ─────────────────────────────────────────────────────────
const childController = new child_controller_1.ChildController();
router.post('/children', isAuthenticated_1.isAuthenticated, childController.handleCreate.bind(childController));
router.get('/my-children', isAuthenticated_1.isAuthenticated, childController.handleListByParent.bind(childController));
router.put('/children/:id', isAuthenticated_1.isAuthenticated, childController.handleUpdate.bind(childController));
router.delete('/children/:id', isAuthenticated_1.isAuthenticated, childController.handleDelete.bind(childController));
// ─── PARENT — sessões dos filhos ───────────────────────────────────────────────
const gameSession = new GameSessionController_1.GameSessionController();
router.post('/game-sessions', isAuthenticated_1.isAuthenticated, gameSession.handleCreate.bind(gameSession));
router.get('/children/:childId/sessions', isAuthenticated_1.isAuthenticated, gameSession.handleListByChild.bind(gameSession));
router.get('/children/:childId/sessions/summary', isAuthenticated_1.isAuthenticated, gameSession.handleSummaryByChild.bind(gameSession));
// ─── WORDS (mobile — público para palavras ativas) ────────────────────────────
const wordController = new WordController_1.WordController();
router.get('/words', wordController.handleList.bind(wordController));
// ─── ADMIN + EDUCATOR — dashboard e crianças ──────────────────────────────────
const dashboard = new DashboardController_1.DashboardController();
router.get('/educator/dashboard', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('EDUCATOR', 'ADMIN'), dashboard.handleMetrics.bind(dashboard));
router.get('/educator/children', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('EDUCATOR', 'ADMIN'), dashboard.handleChildrenList.bind(dashboard));
router.get('/educator/parents', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('EDUCATOR', 'ADMIN'), dashboard.handleParentsList.bind(dashboard));
router.get('/educator/parents/:parentId', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('EDUCATOR', 'ADMIN'), dashboard.handleParentDetail.bind(dashboard));
router.get('/educator/children/:childId', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('EDUCATOR', 'ADMIN'), dashboard.handleChildDetail.bind(dashboard));
// ─── ADMIN — gerenciamento de palavras ────────────────────────────────────────
router.post('/admin/words', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('ADMIN'), wordController.handleCreate.bind(wordController));
router.put('/admin/words/:id', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('ADMIN'), wordController.handleUpdate.bind(wordController));
router.delete('/admin/words/:id', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('ADMIN'), wordController.handleDelete.bind(wordController));
// ─── ADMIN — gerenciamento de educadores ──────────────────────────────────────
const educatorController = new EducatorController_1.EducatorController();
router.post('/admin/educators', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('ADMIN'), educatorController.handleCreate.bind(educatorController));
router.get('/admin/educators', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('ADMIN'), educatorController.handleList.bind(educatorController));
router.delete('/admin/educators/:id', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('ADMIN'), educatorController.handleDelete.bind(educatorController));
// ─── LEGACY (mantida para compatibilidade com app antigo) ─────────────────────
router.get('/children/with-parent', isAuthenticated_1.isAuthenticated, (0, hasRole_1.hasRole)('ADMIN'), (req, res) => childController.handleListAllWithParent(req, res));
