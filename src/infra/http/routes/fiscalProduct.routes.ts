

import { Router } from "express";
import { ChangeFiscalProductStatusController, CreateFiscalProductController, ListFiscalProductController, UpdateFiscalProductController } from "../../../controllers/fiscalProduct";

const FiscalProductRoutes = Router();

const createFiscalProductController = new CreateFiscalProductController();
const listFiscalProductController = new ListFiscalProductController();
const updateFiscalProductController = new UpdateFiscalProductController();
const changeFiscalProductStatusController = new ChangeFiscalProductStatusController();

FiscalProductRoutes.post('/', createFiscalProductController.handle);
FiscalProductRoutes.get('/', listFiscalProductController.handle);
FiscalProductRoutes.put('/:id', updateFiscalProductController.handle);
FiscalProductRoutes.patch('/:id', changeFiscalProductStatusController.handle);

export { FiscalProductRoutes };

