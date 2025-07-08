import { Router } from 'express';

import { CreateUserController } from './controllers/user/CreateUserController';
import { AuthUserController } from './controllers/user/AuthUserController';
import { isAuthenticated } from './middlewares/isAuthenticated';
import { DetailuserController } from './controllers/user/DetailUserController';
import { ChildController } from './controllers/user/child.controller';

const router = Router();

// Controllers
const childController = new ChildController();

router.post('/users', new CreateUserController().handle);
router.post('/session', new AuthUserController().handle);
router.get('/me', isAuthenticated, new DetailuserController().handle);

// Rotas de crianças
router.post('/children', isAuthenticated, childController.handleCreate);

export { router };
