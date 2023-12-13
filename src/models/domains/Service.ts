import { z } from "zod";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { GenericStatus } from "../dtos";

export class Service {
  constructor(
    private _name: string,
    private _description: string,
    private _assignmentId: string,
    private _saleValue: number,
    private _status?: GenericStatus,
    private _id?: string
  ) {}

  get id() {
    return this._id!;
  }

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get assignmentId() {
    return this._assignmentId;
  }

  get saleValue() {
    return this._saleValue;
  }

  get status() {
    return this._status!;
  }

  set id(id: string) {
    this._id = id;
  }

  set name(name: string) {
    this._name = name;
  }

  set description(description: string) {
    this._description = description;
  }

  set assignmentId(assignmentId: string) {
    this._assignmentId = assignmentId;
  }

  set saleValue(saleValue: number) {
    this._saleValue = saleValue;
  }

  set status(status: GenericStatus) {
    this._status = status;
  }

  validate() {
    const serviceSchema = z
      .object({
        id: z.string().uuid("id inválido"),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        name: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(3, ErrorMessages.MSGE08)
          .max(120, ErrorMessages.MSGE09),
        description: z.string().max(500, ErrorMessages.MSGE09),
        assignmentId: z.string().uuid("assignmentId inválido"),
        saleValue: z.number(),
      })
      .partial({ id: true, status: true });

    try {
      serviceSchema.parse(this);
    } catch (err) {
      throw new AppError(err.issues[0].message);
    }
  }
}
