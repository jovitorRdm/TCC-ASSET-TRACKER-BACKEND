import { z } from 'zod';
import { AppError, ErrorMessages } from '../../infra/http/errors';
import { GenericStatus } from '../dtos';


export class EventType {
    constructor(
        private _name: string,
        private _description?: string | null,
        private _id?: string,
        private _status?: GenericStatus,
    ) { }

    get name() {
        return this._name;
    }

    get description() {
        return this._description!;
    }

    get id() {
        return this._id;
    }

    get status() {
        return this._status!;
    }

    set guid(id: string) {
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

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            id: this.id,
            status: this.status,
        };
    }

    validate() {
        const eventSchema = z
            .object({
                id: z.string().uuid('ID inválido'),
                status: z.enum([GenericStatus.active, GenericStatus.inactive], {
                    errorMap: () =>
                        new AppError(`'${this._status}' não é um status válido`),
                }),
                name: z
                    .string({ required_error: ErrorMessages.requiredFields })
                    .min(3, 'Nome deve conter pelo menos 3 caracteres')
                    .max(120, 'Nome não deve ser maior que 120 caracteres'),
                description: z
                    .string({ required_error: ErrorMessages.requiredFields })
                    .min(3, 'a descrição deve conter pelo menos 3 caracteres')
                    .max(500, 'a descrição não deve ser maior que 500 caracteres'),
            })
            .partial({ id: true, status: true });

        try {
            eventSchema.parse(this);
        } catch (err) {
            throw new AppError(err.issues[0].message);
        }
    }
}