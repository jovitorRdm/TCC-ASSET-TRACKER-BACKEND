import { z } from "zod";
import { validateCPF } from "../../helpers/validators";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { AddressDTO, CreateAddressDTO, GenericStatus } from "../dtos";
import { CreatePersonDTO, UpdatePersonDTO, personDTO } from "../dtos/person";
import { validateCNPJ } from "../../helpers/validators/cnpj";


export class Person {
  constructor(
    private _document: string,
    private _name: string,
    private _birthdate: string,
    private _phoneNumber: string,
    private _email: string,
    private _address: CreateAddressDTO | AddressDTO,
    private _status?: GenericStatus,
    private _id?: string,
    private _password?: string,
  ) {}

  get id() {
      return this._id!;
  }
  get name() {
      return this._name;
  }
  get document() {
      return this._document;
  }
  get birthdate() {
      return this._birthdate;
  }
  get phoneNumber() {
      return this._phoneNumber;
  }
  get email() {
      return this._email;
  }
  get password() {
      return this._password;
  }

  get address() {
      return this._address;
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

  set document(document: string) {
      this._document = document;
  }

  set birthdate(birthdate: string) {
      this._birthdate = birthdate;
  }

  set phoneNumber(phoneNumber: string) {
      this._phoneNumber = phoneNumber;
  }

  set email(email: string) {
      this._email = email;
  }

  set password(password: string) {
      this._password = password;
  }

  set address(address: CreateAddressDTO | AddressDTO) {
      this._address = address;
  }

  set status(status: GenericStatus) {
      this._status = status;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      document: this.document,
      birthdate: this.birthdate,
      phoneNumber: this.phoneNumber,
      email: this.email,
      password: this.password,
      address: this.address,
      status: this.status,
    };
  }

  setAll(data: UpdatePersonDTO) {
    this.id = data.id;
    this.status = data.status;
    this.name = data.name;
    this.document = data.document;
    this.birthdate = data.birthdate;
    this.phoneNumber = data.phoneNumber;
    this.email = data.email;
    this.password = data.password;
    this.address = data.address;
  }

  validate(allowCNPJ: boolean = false) {
    const customerSchema = z
      .object({
        id: z.string().uuid('id inválido'),
        status: z.enum([GenericStatus.active, GenericStatus.inactive], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
        name: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(3, ErrorMessages.MSGE08)
          .max(120, ErrorMessages.MSGE09),
        document: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(11, ErrorMessages.MSGE08)
          .max(allowCNPJ ? 14 : 11, ErrorMessages.MSGE09)
          .refine((document) => allowCNPJ && document.length === 14 ? 
          validateCNPJ(document) : validateCPF(document), ErrorMessages.MSGE12),
        birthdate: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .datetime({ message: ErrorMessages.MSGE06 }),
        phoneNumber: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(11, ErrorMessages.MSGE08)
          .max(11, ErrorMessages.MSGE09),
        email: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .email(ErrorMessages.MSGE06),
        password: z
          .string({ required_error: ErrorMessages.MSGE01 })
          .min(8, ErrorMessages.MSGE08),
      })
      .partial({ id: true, status: true, password: true });

    try {
      customerSchema.parse(this);
    } catch (err) {
      throw new AppError(err.issues[0].message);
    }
  }
}
