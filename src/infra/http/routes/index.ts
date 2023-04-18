import { Router } from 'express';
import { handleSuccessMessage } from '../middlewares/handleSuccessMessage';
import { eventRoutes } from './events.routes';

const router = Router();

router.all('*', handleSuccessMessage);

router.use('/event', eventRoutes);

export { router };
