import { Router } from "express";
import { ChangeCustomerStatusController, CreateCustomerController, ListCustomerController, UpdateCustomerController } from "../../../controllers/customer";

const customerRoutes = Router();
const createCustomerController = new CreateCustomerController();
const updateCustomerController = new UpdateCustomerController();
const listCustomerController = new ListCustomerController();
const changeCustomerStatusController = new ChangeCustomerStatusController();

customerRoutes.post('/', createCustomerController.handle);
customerRoutes.put('/:id', updateCustomerController.handle);
customerRoutes.get("/", listCustomerController.handle);
customerRoutes.patch("/:id", changeCustomerStatusController.handle);


export { customerRoutes }