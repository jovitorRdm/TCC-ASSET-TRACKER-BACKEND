import { z } from "zod";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { AddressDTO, AssignmentDTO, CreateAddressDTO, GenericStatus, UpdateAssignmentDTO } from "../dtos";


export class Employee {
  constructor(
    private _name: string,
    private _cpf: string,
    private _birthdate: string,
    private _phoneNumber: string,
    private _email: string,
    private _password: string,
    private _address: CreateAddressDTO | AddressDTO,
    private _assignmentId: string,
    private _status?: GenericStatus,
    private _id?: string
  ) {}

    get id() {
        return this._id!;
    }
    get name() {
        return this._name;
    }
    get cpf() {
        return this._cpf;
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

    get assignmentId() {
        return this._assignmentId;
    }

    set id(id: string) {
        this._id = id;
    }

    set name(name: string) {
        this._name = name;
    }

    set cpf(cpf: string) {
        this._cpf = cpf;
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

    set assignmentId(assignmentId: string) {
        this._assignmentId = assignmentId;
    }

    validate() {
        const employeeSchema = z
          .object({
            guid: z.string().uuid('id inválido'),
            status: z.enum([GenericStatus.active, GenericStatus.inactive], {
              errorMap: () => new AppError(ErrorMessages.MSGE06),
            }),
            name: z
              .string({ required_error: ErrorMessages.MSGE01 })
              .min(3, ErrorMessages.MSGE08)
              .max(120, ErrorMessages.MSGE09),
            cpf: z
              .string({ required_error: ErrorMessages.MSGE01 })
              .min(11, ErrorMessages.MSGE08)
              .max(11, ErrorMessages.MSGE09),
            //   .refine((cpf) => validateCPF(cpf), ErrorMessages.MSGE12),
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
          .partial({ guid: true, status: true });
    
        try {
          employeeSchema.parse(this);
        } catch (err) {
          throw new AppError(err.issues[0].message);
        }
}

}
