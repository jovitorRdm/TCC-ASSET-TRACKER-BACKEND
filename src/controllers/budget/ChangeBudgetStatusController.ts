import { Request, Response } from "express";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { BudgetService } from "../../services/budget";

export class ChangeBudgetStatusController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const { status } = req.body;

    const budgetService = new BudgetService();

    const budget = await budgetService.changeStatus(id, status);

    return res.json(budget);
  }
}
