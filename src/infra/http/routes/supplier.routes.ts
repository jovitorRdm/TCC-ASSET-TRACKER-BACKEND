import { Router } from "express";
import { 
    ChangeSupplierStatusController, 
    CreateSupplierController, 
    ListSupplierController, 
    UpdateSupplierController 
} from "../../../controllers/supplier";

const supplierRoutes = Router();

const createSupplierController = new CreateSupplierController();
const updateSupplierController = new UpdateSupplierController();
const listSupplierController = new ListSupplierController();
const changeSupplierStatusController = new ChangeSupplierStatusController();

supplierRoutes.post('/', createSupplierController.handle);
supplierRoutes.put('/:id', updateSupplierController.handle);
supplierRoutes.get("/", listSupplierController.handle);
supplierRoutes.patch("/:id", changeSupplierStatusController.handle);

export { supplierRoutes };