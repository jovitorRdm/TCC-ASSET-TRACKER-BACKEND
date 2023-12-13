import { PaginatedResponse } from "../../helpers/utils/PaginatedResponse";
import { Request, Response } from "express";
import { BudgetDTO } from "../../models/dtos/budget";
import { BudgetService } from "../../services/budget";

export class ListBudgetController {
  async handle(req: Request, res: Response) {
    const paginatedResponse = new PaginatedResponse<BudgetDTO>(
      new BudgetService()
    );

    const response = await paginatedResponse.get(req);
    return res.json(response);
  }
}
