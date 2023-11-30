export interface CreateBudgetDetailDTO {
  budgetId: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discount?: number;
  productId?: string;
  serviceId?: string;
}

export interface BudgetDetailDTO extends CreateBudgetDetailDTO {
  id: string;
}

export interface UpdateBudgetDetailDTO {
  id?: string;
  name?: string;
  budgetId?: string;
  productId?: string;
  serviceId?: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  discount?: number;
}
