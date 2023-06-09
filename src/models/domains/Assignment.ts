import { z } from 'zod';
import { AppError, ErrorMessages } from '../../infra/http/errors';
import { AccountType, GenericStatus, PaymentMethod } from '../dtos';
import {  } from '@prisma/client';

export class Assignment {
    constructor(
        private _name: string,
        private _description: string | null,
        private _paymentMethod: PaymentMethod,
        private _paymentValue: number,
        private _accountRequirement: boolean,
        private _accountType?: AccountType,
        private _id?: string,
        private _status?: GenericStatus,
    ) { }


// ----------------GET-----------------

    get id() {
        return this._id!;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description!;
    }

    get paymentMethod() {
        return this._paymentMethod!;
    }

    get paymentValue() {
        return this._paymentValue!;
    }

    get accountRequirement() {
        return this._accountRequirement!;
    }

    get accountType() {
        return this._accountType!;
    }

    get status() {
        return this._status!;
    }


// ---------------SET--------------------

    set id(id: string) {
        this._id = id;
    }

    set name(name: string) {
        this._name = name;
    }

    set description(description: string) {
        this._description = description;
    }

    set paymentMethod(paymentMethod: PaymentMethod) {
        this._paymentMethod = paymentMethod;
    }

    set paymentValue(paymentValue: number) {
        this._paymentValue = paymentValue;
    }

    set accountRequirement(accountRequirement: boolean) {
        this._accountRequirement = accountRequirement;
    }

    set accountType(accountType: AccountType) {
        this._accountType = accountType;
    }

    set status(status: GenericStatus) {
        this._status = status;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            paymentMethod: this.paymentMethod,
            paymentValue: this.paymentValue,
            accountType: this.accountType,
            accountRequired: this.accountRequirement,
            status: this.status,
        };
    }

    validate() {
        const AssignmentSchema = z
            .object({
                id: z.string().uuid('ID inválido'),
                status: z.enum([GenericStatus.active, GenericStatus.inactive], {
                    errorMap: () =>
                        new AppError(`'${this._status}' não é um status válido`),
                }),
                paymentMethod: z.enum([PaymentMethod.DAY, PaymentMethod.HOUR, PaymentMethod.PEOPLE_QUANTITY, PaymentMethod.EVENT ], {
                    errorMap: () =>
                        new AppError(`'${this._paymentMethod}' não é um tipo de pagamento válido`),
                }),
                accountType: z.enum([AccountType.EVENTADMINISTRATOR, AccountType.RECEPTIONIST], {
                    errorMap: () =>
                        new AppError(`'${this._accountType}' não é um tipo de conta válida`),
                }),
                name: z
                    .string({ required_error: ErrorMessages.MSGE08 })
                    .min(3, 'Nome deve conter pelo menos 3 caracteres')
                    .max(120, 'Nome não deve ser maior que 120 caracteres'),
                description: z
                    .string({ required_error: ErrorMessages.MSGE08 })
                    .min(3, 'a descrição deve conter pelo menos 3 caracteres')
                    .max(500, 'a descrição não deve ser maior que 500 caracteres'),
                paymentValue: z
                    .number({ required_error: ErrorMessages.MSGE08 })
                    .gt(0, 'Valor deve ser maior que 0'),
            })
            .partial({ id: true, status: true, accountType: !this._accountRequirement? true : undefined });

        try {
            AssignmentSchema.parse(this);
        } catch (err) {
            throw new AppError(err.issues[0].message);
        }
    }
}