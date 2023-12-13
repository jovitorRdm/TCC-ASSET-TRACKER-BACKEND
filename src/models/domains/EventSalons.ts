import { z } from "zod";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { AddressDTO, CreateAddressDTO, GenericStatus } from "../dtos";

export class EventSalons {
  constructor(
    private _name: string,
    private _value: number,
    private _capacity: number,
    private _description?: string | null,
    private _address?: CreateAddressDTO | AddressDTO,
    private _id?: string,
    private _status?: GenericStatus
  ) {}

  get name() {
    return this._name;
  }

  get description() {
    return this._description!;
  }

  get address() {
    return this._address;
  }

  get value() {
    return this._value;
  }

  get capacity() {
    return this._capacity;
  }

  get id() {
    return this._id!;
  }

  get status() {
    return this._status!;
  }

  set id(id: string) {
    this._id = id;
  }

  set status(status: GenericStatus) {
    this._status = status;
  }

  set name(name: string) {
    this._name = name;
  }

  set description(description: string) {
    this._description = description;
  }

  set value(value: number) {
    this._value = value;
  }

  set capacity(capacity: number) {
    this._capacity = capacity;
  }

  set address(address: CreateAddressDTO | AddressDTO) {
    this._address = address;
  }

  toJSON() {
    return {
      name: this.name,
      description: this.description,
      address: this.address,
      id: this.id,
      status: this.status,
    };
  }

  validate() {
    const eventSchema = z
      .object({
        id: z.string().uuid("ID inválido"),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        name: z
          .string({ required_error: ErrorMessages.MSGE07 })
          .min(3, "Nome deve conter pelo menos 3 caracteres")
          .max(120, "Nome não deve ser maior que 120 caracteres"),
        description: z
          .string({ required_error: ErrorMessages.MSGE08 })
          .min(3, "a descrição deve conter pelo menos 3 caracteres")
          .max(500, "a descrição não deve ser maior que 500 caracteres"),
      })
      .partial({ id: true, status: true });

    try {
      eventSchema.parse(this);
    } catch (err) {
      throw new AppError(err.issues[0].message);
    }
  }
}
