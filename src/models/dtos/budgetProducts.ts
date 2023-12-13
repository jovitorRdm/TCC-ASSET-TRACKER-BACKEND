export interface CreateBudgetProductsDTO {
  id?: string;
  productId?: string;
  unitPrice: number;
  quantity: number;
}

export interface BudgetProductsDTO extends CreateBudgetProductsDTO {
  id: string;
}

export interface UpdateBudgetProductsDTO {
  id?: string;
  productId?: string;
  unitPrice?: number;
  quantity?: number;
}
