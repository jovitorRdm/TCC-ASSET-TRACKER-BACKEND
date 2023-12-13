import { Router } from "express";
import {
  CreateBudgetController,
  UpdateBudgetController,
  ChangeBudgetStatusController,
  ListBudgetController,
} from "../../../controllers/budget";

const budgetRoutes = Router();

const createBudgetController = new CreateBudgetController();
const updateBudgetController = new UpdateBudgetController();
const changeBudgetStatusController = new ChangeBudgetStatusController();
const listBudgetController = new ListBudgetController();

budgetRoutes.post("/", createBudgetController.handle);
budgetRoutes.get("/", listBudgetController.handle);
budgetRoutes.put("/:id", updateBudgetController.handle);
budgetRoutes.patch("/:id", changeBudgetStatusController.handle);

export { budgetRoutes };
