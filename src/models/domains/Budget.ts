import { z } from "zod";
import { BudgetDetailDTO } from "../dtos/budgetDetail";
import { EventDTO } from "../dtos/event";

export class Budget {
  constructor(
    private _customerId: string,
    private _totalAmount: number,
    private _pickupDate: Date,
    private _budgetDetails?: BudgetDetailDTO[],
    private _event?: EventDTO
  ) {}

  get costumerId() {
    return this._customerId;
  }

  get totalAmount() {
    return this._totalAmount;
  }

  get pickupDate() {
    return this._pickupDate;
  }

  get budgetDetails() {
    return this._budgetDetails;
  }

  get event() {
    return this._event;
  }

  set costumerId(customerId: string) {
    this._customerId = customerId;
  }

  set totalAmount(totalAmount: number) {
    this._totalAmount = totalAmount;
  }

  set pickupDate(pickupDate: Date) {
    this._pickupDate = pickupDate;
  }

  set budgetDetails(budgetDetails: BudgetDetailDTO[]) {
    this._budgetDetails = budgetDetails;
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
