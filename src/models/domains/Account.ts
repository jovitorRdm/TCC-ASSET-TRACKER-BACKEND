import { z } from 'zod';
import { AppError, ErrorMessages } from '../../infra/http/errors';
import { GenericStatus } from "../dtos";

export class Account {
    constructor(  
        private _email: string,
        private _password: string,
        private _status?: GenericStatus,
        private _id?: string,
    ){}

// ----------------GET-----------------

    get id() {
        return this._id!;
    }

    get email() {
        return this._email;
    }

    get password() {
        return this._password;
    }

    get status() {
        return this._status!;
    }

// ---------------SET--------------------

    set id(id: string) {
        this._id = id;
    }

    set email(email: string) {
        this._email = email;
    }

    set password(password: string) {
        this._password = password;
    }

    set status(status: GenericStatus) {
        this._status = status;
    }

    toJson() {
        return {
            id: this.id,
            email: this.email,
            password: this.password,
            status: this.status
        }
    }

    validate() {
        const AssignmentSchema = z
            .object({
                id: z.string().uuid('ID inválido'),
                status: z.enum([GenericStatus.active, GenericStatus.inactive], {
                    errorMap: () =>
                        new AppError(`'${this._status}' não é um status válido`),
                }),
                // name: z
                //     .string({ required_error: ErrorMessages.requiredFields })
                //     .min(3, 'Nome deve conter pelo menos 3 caracteres')
                //     .max(120, 'Nome não deve ser maior que 120 caracteres'),
                // description: z
                //     .string({ required_error: ErrorMessages.requiredFields })
                //     .min(3, 'a descrição deve conter pelo menos 3 caracteres')
                //     .max(500, 'a descrição não deve ser maior que 500 caracteres'),
                // paymentValue: z
                //     .number({ required_error: ErrorMessages.requiredFields })
                //     .gt(0, 'Valor deve ser maior que 0'),
            })
            .partial({ id: true, status: true });

        try {
            AssignmentSchema.parse(this);
        } catch (err) {
            throw new AppError(err.issues[0].message);
        }
    }

}