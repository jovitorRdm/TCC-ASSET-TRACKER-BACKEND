import { BudgetProductsDTO } from "./budgetProducts";
import { BudgetServicesDTO } from "./budgetServices";
import { GenericStatus } from "./status";

export interface CreateBudgetDTO {
  typeBudget: TypeBudget;
  customerId: string;
  numberPeople: number;
  pickupDate: Date;
  returnDate: Date;
  totalAmount: number;
  totalCharged?: number;
  discount?: number;
  eventTypeId?: string;
  budgetServices?: BudgetServicesDTO[];
  budgetProducts?: BudgetProductsDTO[];
}

export interface BudgetDTO extends CreateBudgetDTO {
  id: string;
  status: GenericStatus;
}

export interface UpdateBudgetDTO {
  id?: string;
  status?: GenericStatus;
  typeBudget?: TypeBudget;
  customerId?: string;
  numberPeople?: number;
  pickupDate?: Date;
  returnDate?: Date;
  totalAmount?: number;
  totalCharged?: number;
  discount?: number;
  eventTypeId?: string;
  budgetServices?: BudgetServicesDTO[];
  budgetProducts?: BudgetProductsDTO[];
}

export enum TypeBudget {
  event = "event",
  rent = "rent",
}
