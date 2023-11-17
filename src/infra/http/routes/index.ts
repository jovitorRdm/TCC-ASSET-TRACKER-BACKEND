import { Router } from 'express';
import { handleSuccessMessage } from '../middlewares/handleSuccessMessage';
import { eventRoutes } from './events.routes';
import { assignmentRoutes } from './assignment.routes';
import { employeeRoutes } from './employee.routes';
import { customerRoutes } from './customer.routes';
import { ServiceRoutes } from './service.routes';
import { ProductRoutes } from './product.routes';
import { AuthRouter } from './auth.routes';
import { supplierRoutes } from './supplier.routes';
import { ensureAuthenticated } from '../middlewares';
import { FiscalProductRoutes } from './fiscalProduct.routes';

const router = Router();

router.all('*', handleSuccessMessage);

router.use('/event', eventRoutes);
router.use('/assignment' ,assignmentRoutes);
router.use('/employee', employeeRoutes);
router.use('/customer', customerRoutes);
router.use('/serviceItem', ServiceRoutes);
router.use('/product', ProductRoutes);
router.use('/supplier', supplierRoutes);
router.use("/login", AuthRouter);
router.use('/fiscalProduct', FiscalProductRoutes);

export { router };
