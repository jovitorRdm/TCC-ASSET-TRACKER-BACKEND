import {
  BudgetDetailDTO,
  CreateBudgetDetailDTO,
  UpdateBudgetDetailDTO,
} from "./budgetDetail";
import { EventDTO, CreateEventDTO, UpdateEventDTO } from "./event";

export interface CreateBudgetDTO {
  customerId: string;
  pickupDate: Date;
  totalAmount: number;
  event?: EventDTO;
  budgetDetails?: BudgetDetailDTO[];
}

export interface BudgetDTO extends CreateBudgetDTO {
  id: string;
}

export interface UpdateBudgetDTO {
  id: string;
  customerId?: string;
  pickupDate?: Date;
  totalAmount?: number;
  event?: EventDTO;
  budgetDetails?: BudgetDetailDTO[];
}
