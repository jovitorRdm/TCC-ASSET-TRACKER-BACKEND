import { Router } from 'express';
import { AuthenticateEmployeeController } from '../../../controllers/auth/AuthenticateUserController';

const AuthRouter = Router();

const authenticateEmployeeController = new AuthenticateEmployeeController();

AuthRouter.post('/', authenticateEmployeeController.handle);

export { AuthRouter };