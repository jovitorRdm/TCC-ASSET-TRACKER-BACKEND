import { Router } from "express";
import { 
    ChangeEmployeeStatusController, 
    CreateEmployeeController, 
    ListEmployeeController, 
    UpdateEmployeeController 
} from "../../../controllers/employee";

const employeeRoutes = Router();
const createEmployeeController = new CreateEmployeeController();
const updateEmployeeController = new UpdateEmployeeController();
const listEmployeeController = new ListEmployeeController();
const changeEmployeeStatusController = new ChangeEmployeeStatusController();

employeeRoutes.post('/', createEmployeeController.handle);
employeeRoutes.put('/:id', updateEmployeeController.handle);
employeeRoutes.get("/", listEmployeeController.handle);
employeeRoutes.patch("/:id", changeEmployeeStatusController.handle);


export { employeeRoutes }