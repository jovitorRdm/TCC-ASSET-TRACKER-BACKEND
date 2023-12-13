import { Request, Response } from "express";
import { BudgetDTO } from "../../models/dtos/budget";
import { BudgetService } from "../../services/budget";

export class UpdateBudgetController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as BudgetDTO;

    const budgetService = new BudgetService();

    const budget = await budgetService.update(id, data);

    return res.json(budget);
  }
}
