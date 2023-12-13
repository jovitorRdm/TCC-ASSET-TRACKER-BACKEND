import { z } from "zod";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { AddressDTO, CreateAddressDTO, GenericStatus } from "../dtos";
import { Person } from "./Person";

export class Supplier extends Person {
  constructor(
    _document: string,
    _name: string,
    _birthdate: string,
    _phoneNumber: string,
    _email: string,
    _address: CreateAddressDTO | AddressDTO,
    _status?: GenericStatus,
    _id?: string
  ) {
    super(
      _document,
      _name,
      _birthdate,
      _phoneNumber,
      _email,
      _address,
      _status,
      _id
    );
  }

  validate() {
    super.validate(true);
    const supplierSchema = z
      .object({
        id: z.string().uuid("id inválido"),
      })
      .partial({ id: true });

    try {
      supplierSchema.parse(this);
    } catch (err) {
      throw new AppError(err.issues[0].message);
    }
  }
}
