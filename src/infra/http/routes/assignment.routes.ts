import { Router } from 'express';
import {ListAssignmentController, UpdateAssignmentController, ChangeAssignmentStatusController, CreateAssignmentController } from '../../../controllers/assignment';


const assignmentRoutes = Router();

const createAssignmentController = new CreateAssignmentController();
const listAssignmentEventController = new ListAssignmentController();
const updateAssignmentController = new UpdateAssignmentController();
const changeAssignmentStatusController = new ChangeAssignmentStatusController();

assignmentRoutes.post('/', createAssignmentController.handle);
assignmentRoutes.get('/', listAssignmentEventController.handle);
assignmentRoutes.put('/:id', updateAssignmentController.handle);
assignmentRoutes.patch('/:id', changeAssignmentStatusController.handle);

export { assignmentRoutes }
