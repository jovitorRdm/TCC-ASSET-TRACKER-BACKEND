import { Router } from 'express';
import { handleSuccessMessage } from '../middlewares/handleSuccessMessage';
import { eventRoutes } from './events.routes';
import { assignmentRoutes } from './assignment.routes';

const router = Router();

router.all('*', handleSuccessMessage);

router.use('/event', eventRoutes);
router.use('/assignment', assignmentRoutes);


export { router };
