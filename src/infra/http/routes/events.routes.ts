import { Router } from 'express';
import { ChangeEventStatusController, CreateEventsController, ListEventController, UpdateEventController } from '../../../controllers/events';

const eventRoutes = Router();

const CreateEventController = new CreateEventsController();
const listEventController = new ListEventController();
const updateEventController = new UpdateEventController();
const changeEventStatusController = new ChangeEventStatusController();

eventRoutes.post('/', CreateEventController.handle);
eventRoutes.get('/', listEventController.handle);
eventRoutes.put('/:id', updateEventController.handle);
eventRoutes.patch('/:id', changeEventStatusController.handle);

export { eventRoutes }
