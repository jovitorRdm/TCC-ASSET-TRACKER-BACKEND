import { z } from "zod";
import { TypeBudget } from "../dtos/budget";
import { BudgetServicesDTO } from "../dtos/budgetServices";
import { BudgetProductsDTO } from "../dtos/budgetProducts";

export class Budget {
  constructor(
    private _typeBudget: TypeBudget,
    private _customerId: string,
    private _numberPeople: number,
    private _pickupDate: Date,
    private _returnDate: Date,
    private _totalAmount: number,
    private _totalCharged?: number,
    private _eventTypeId?: string,
    private _budgetServices?: BudgetServicesDTO[],
    private _budgetProducts?: BudgetProductsDTO[],
    private _discount?: number
  ) {}

  get typeBudget() {
    return this._typeBudget;
  }

  get customerId() {
    return this._customerId;
  }

  get numberPeople() {
    return this._numberPeople;
  }

  get pickupDate() {
    return this._pickupDate;
  }

  get returnDate() {
    return this._returnDate;
  }

  get totalAmount() {
    return this._totalAmount;
  }

  get eventTypeId() {
    return this._eventTypeId;
  }

  get budgetServices() {
    return this._budgetServices;
  }

  get budgetProducts() {
    return this._budgetProducts;
  }

  get discount() {
    return this._discount;
  }

  get totalCharged() {
    return this._totalCharged;
  }

  set typeBudget(typeBudget: TypeBudget) {
    this._typeBudget = typeBudget;
  }

  set costumerId(customerId: string) {
    this._customerId = customerId;
  }

  set numberPeople(numberPeople: number) {
    this._numberPeople = numberPeople;
  }

  set pickupDate(pickupDate: Date) {
    this._pickupDate = pickupDate;
  }

  set returnDate(returnDate: Date) {
    this._returnDate = returnDate;
  }

  set totalAmount(totalAmount: number) {
    this._totalAmount = totalAmount;
  }

  set eventTypeId(eventTypeId: string) {
    this._eventTypeId = eventTypeId;
  }

  set budgetServices(budgetServices: BudgetServicesDTO[]) {
    this._budgetServices = budgetServices;
  }

  set budgetProducts(budgetProducts: BudgetProductsDTO[]) {
    this._budgetProducts = budgetProducts;
  }

  set discount(discount: number) {
    this._discount = discount;
  }

  set totalCharged(totalCharged: number) {
    this._totalCharged = totalCharged;
  }

  // validate() {
  //   const schema = z
  //     .object({
  //       costumerId: z.string(),
  //       totalAmount: z.number(),
  //       pickupDate: z.date(),
  //       budgetDetails: z
  //         .array(
  //           z.object({
  //             id: z.string(),
  //             productId: z.string(),
  //             quantity: z.number(),
  //             price: z.number(),
  //           })
  //         )
  //         .optional(),
  //       event: z
  //         .object({
  //           id: z.string(),
  //           name: z.string(),
  //           description: z.string(),
  //           startDate: z.date(),
  //           endDate: z.date(),
  //         })
  //         .optional(),
  //     })
  //     .partial({ costumerId: true });
  // }
}
