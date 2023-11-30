import { FindAllArgs, IService } from "../interfaces";
import { GenericStatus } from "../models/dtos";
import { CreateBudgetDTO } from "../models/dtos/budget";
import { BudgetRepository } from "../models/repositories/BudgetRepository";

export class BudgetService {
  private budgetRepository = new BudgetRepository();

  async create(data: CreateBudgetDTO) {
    const budget = await this.budgetRepository.create(data);

    return budget;
  }
}
