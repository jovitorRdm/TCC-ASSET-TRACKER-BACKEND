import { Router } from "express";
import { CreateBudgetController } from "../../../controllers/budget/CreateBudgetController";

const budgetRoutes = Router();

const createBudgetController = new CreateBudgetController();

budgetRoutes.post("/", createBudgetController.handle);

export { budgetRoutes };
