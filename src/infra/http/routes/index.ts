import { Router } from 'express';
import { handleSuccessMessage } from '../middlewares/handleSuccessMessage';
import { eventRoutes } from './events.routes';
import { assignmentRoutes } from './assignment.routes';
import { employeeRoutes } from './employee.routes';
import { customerRoutes } from './customer.routes';
import { ServiceRoutes } from './service.routes';
import { ProductRoutes } from './product.routes';
import { AuthRouter } from './auth.routes';
import { ensureAuthenticated } from '../middlewares';

const router = Router();

router.all('*', handleSuccessMessage);

router.use('/event',ensureAuthenticated, eventRoutes);
router.use('/assignment',ensureAuthenticated ,assignmentRoutes);
router.use('/employee',ensureAuthenticated, employeeRoutes);
router.use('/customer', ensureAuthenticated, customerRoutes);
router.use('/serviceItem', ensureAuthenticated, ServiceRoutes);
router.use('/product',ensureAuthenticated,ProductRoutes);
router.use("/login", AuthRouter);

export { router };
