import { Request, Response } from "express";
import { CreateBudgetDTO } from "../../models/dtos/budget";
import { BudgetService } from "../../services/budget";

export class CreateBudgetController {
  async handle(req: Request, res: Response) {
    const data = req.body as CreateBudgetDTO;
    const budgetService = new BudgetService();
    const budget = await budgetService.create(data);
    return res.status(201).json(budget);
  }
}
