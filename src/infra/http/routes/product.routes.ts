import { Router } from "express";
import { ChangeProductStatusController, CreateProductController, ListProductController, UpdateProductController } from "../../../controllers/product";

const ProductRoutes = Router();

const createProductController = new CreateProductController();
const changeProductStatusController = new ChangeProductStatusController();
const listProductController = new ListProductController();
const updateProductController = new UpdateProductController();

ProductRoutes.post('/', createProductController.handle);
ProductRoutes.get('/', listProductController.handle);
ProductRoutes.put('/:id', updateProductController.handle);
ProductRoutes.patch('/:id', changeProductStatusController.handle);

export { ProductRoutes };