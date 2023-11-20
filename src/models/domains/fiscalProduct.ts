import { AppError, ErrorMessages } from "../../infra/http/errors";
import { GenericStatus, ProductEntriesDTO } from "../dtos";
import { z } from "zod";

export class FiscalProduct {
  constructor(
    private _supplierId: string,
    private _invoiceNumber: string,
    private _issueDate: string,
    private _totalAmount: number,
    private _productEntries: ProductEntriesDTO[],
    private _status?: GenericStatus,
    private _id?: string
  ) {}

  get id() {
    return this._id!;
  }

  get status() {
    return this._status!;
  }

  get supplierId() {
    return this._supplierId;
  }

  get invoiceNumber() {
    return this._invoiceNumber;
  }

  get issueDate() {
    return this._issueDate;
  }

  get totalAmount() {
    return this._totalAmount;
  }

  get productEntries() {
    return this._productEntries;
  }

  // **************************************************//

  set id(id: string) {
    this._id = id;
  }

  set status(status: GenericStatus) {
    this._status = status;
  }

  set supplierId(supplierId: string) {
    this._supplierId = supplierId;
  }

  set invoiceNumber(invoiceNumber: string) {
    this._invoiceNumber = invoiceNumber;
  }

  set issueDate(issueDate: string) {
    this._issueDate = issueDate;
  }

  set totalAmount(totalAmount: number) {
    this._totalAmount = totalAmount;
  }

  set productEntries(productEntries: ProductEntriesDTO[]) {
    this._productEntries = productEntries;
  }

  toJSON() {
    return {
      id: this.id,
      status: this.status,
      supplierId: this.supplierId,
      invoiceNumber: this.invoiceNumber,
      issueDate: this.issueDate,
      totalAmount: this.totalAmount,
      productEntries: this.productEntries,
    };
  }
  validate() {
    const FiscalProductSchema = z
      .object({
        id: z.string().uuid(),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        supplierId: z.string(),
        invoiceNumber: z.string(),
        issueDate: z.string(),
        totalAmount: z.number(),
        productEntries: z.array(
          z
            .object({
              id: z.string().uuid("id inv LTD"),
              status: z.enum([GenericStatus.active, GenericStatus.inactive], {
                errorMap: () => new AppError(ErrorMessages.MSGE06),
              }),
            })
            .partial({ id: true, status: true })
        ),
      })
      .partial({ id: true, status: true });
    const result = FiscalProductSchema.safeParse(this);
    try {
      FiscalProductSchema.parse(this);
    } catch (err) {
      throw new AppError(err.issues[0].message);
    }
  }
}
