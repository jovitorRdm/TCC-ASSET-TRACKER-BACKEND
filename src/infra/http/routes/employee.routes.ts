import { Router } from "express";
import { CreateEmployeeController } from "../../../controllers/employee/CreateEmployeeController";


const employeeRoutes = Router();

const createEmployeeController = new CreateEmployeeController();
const updateEventController = new CreateEmployeeController();

employeeRoutes.post('/', createEmployeeController.handle);
employeeRoutes.put('/:id', updateEventController.handle);

export { employeeRoutes }