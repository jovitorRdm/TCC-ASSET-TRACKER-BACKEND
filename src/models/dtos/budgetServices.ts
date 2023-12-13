export interface CreateBudgetServicesDTO {
  id?: string;
  serviceId?: string;
  unitPrice: number;
  quantity: number;
}

export interface BudgetServicesDTO extends CreateBudgetServicesDTO {
  id: string;
}

export interface UpdateBudgetServicesDTO {
  id?: string;
  serviceId?: string;
  unitPrice?: number;
  quantity?: number;
}
