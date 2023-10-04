import { z } from "zod";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { AddressDTO, CreateAddressDTO, GenericStatus } from "../dtos";
import { Person } from "./Person";
export class Employee extends Person {
  constructor(
    private _assignmentId: string,
     _document: string,
     _name: string,
     _birthdate: string,
     _phoneNumber: string,
     _email: string,
     _password: string,
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
      _id,
      _password,
    );
  }

  get assignmentId() {
      return this._assignmentId;
  }

  set assignmentId(assignmentId: string) {
      this._assignmentId = assignmentId;
  }

  validate() {
    super.validate(true);
    const employeeSchema = z
      .object({
        id: z.string().uuid('id inválido'),
        password: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(8, ErrorMessages.MSGE08),
      })
      .partial({ id: true });

    try {
      employeeSchema.parse(this);
    } catch (err) {
      throw new AppError(err.issues[0].message);
    }
  }
}
