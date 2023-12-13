import { FindAllArgs, IService } from "../interfaces";
import { GenericStatus } from "../models/dtos";
import {
  BudgetDTO,
  CreateBudgetDTO,
  UpdateBudgetDTO,
} from "../models/dtos/budget";
import { BudgetRepository } from "../models/repositories/BudgetRepository";

export class BudgetService {
  private budgetRepository = new BudgetRepository();

  async create(data: CreateBudgetDTO) {
    const service = await this.budgetRepository.create(data);
    return service;
  }

  async update(id: string, data: UpdateBudgetDTO) {
    const updatedFiscalProduct = await this.budgetRepository.update(id, data);

    return updatedFiscalProduct;
  }

  async changeStatus(id: string, status: GenericStatus) {
    const updatedFiscalProduct = await this.budgetRepository.update(id, {
      status,
    });

    return updatedFiscalProduct;
  }

  async list(args: FindAllArgs = {}) {
    const result = await this.budgetRepository.findAll(args);

    return result;
  }
}
