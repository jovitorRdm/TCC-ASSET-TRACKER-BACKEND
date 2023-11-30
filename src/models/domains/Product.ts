import { AppError, ErrorMessages } from "../../infra/http/errors";
import { GenericStatus, MeasurementUnit } from "../dtos";
import { z } from "zod";
import { ProductType } from "../dtos/productType";

export class Product {
  constructor(
    private _name: string,
    private _description: string,
    private _consumptionPerPerson: number,
    private _measurementUnit: MeasurementUnit,
    private _quantity: number,
    private _value: number,
    private _productType: ProductType,
    private _numberDay?: number,
    private _percentage?: number,
    private _SaleValue?: number,
    private _id?: string,
    private _status?: GenericStatus
  ) {}

  get name() {
    return this._name;
  }

  get description() {
    return this._description;
  }

  get consumptionPerPerson() {
    return this._consumptionPerPerson;
  }

  get measurementUnit() {
    return this._measurementUnit;
  }

  get quantity() {
    return this._quantity;
  }
  get value() {
    return this._value;
  }

  get productType() {
    return this._productType;
  }

  get numberDay() {
    return this._numberDay!;
  }

  get percentage() {
    return this._percentage!;
  }

  get saleValue() {
    return this._SaleValue;
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

  set name(name: string) {
    this._name = name;
  }

  set quantity(quantity: number) {
    this._quantity = quantity;
  }

  set value(value: number) {
    this._value = value;
  }

  set productType(productType: ProductType) {
    this._productType = productType;
  }

  set numberDay(numberDay: number) {
    this._numberDay = numberDay;
  }

  set percentage(percentage: number) {
    this._percentage = percentage;
  }

  set SaleValue(SaleValue: number) {
    this._SaleValue = SaleValue;
  }

  set consumptionPerPerson(consumptionPerPerson: number) {
    this._consumptionPerPerson = consumptionPerPerson;
  }

  set measurementUnit(measurementUnit: MeasurementUnit) {
    this._measurementUnit = measurementUnit;
  }

  set description(description: string) {
    this._description = description;
  }

  set status(status: GenericStatus) {
    this._status = status;
  }

  toJSON() {
    return {
      name: this.name,
      consumptionPerPerson: this.consumptionPerPerson,
      measurementUnit: this.measurementUnit,
      description: this.description,
      id: this.id,
      status: this.status,
    };
  }

  validate() {
    const productSchema = z
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

        measurementUnit: z.enum(
          [
            MeasurementUnit.UNIT,
            MeasurementUnit.PACKAGE,
            MeasurementUnit.KILOGRAM,
            MeasurementUnit.LITER,
            MeasurementUnit.METER,
          ],
          {
            errorMap: () => new AppError(ErrorMessages.MSGE06),
          }
        ),
        quantity: z.number(),
        value: z.number(),
        productType: z.enum([ProductType.Consumable, ProductType.Rental], {
          errorMap: () => new AppError(ErrorMessages.MSGE06),
        }),
      })

      .partial({ id: true, status: true });
    try {
      productSchema.parse(this);
    } catch (err) {
      throw new AppError(err.issues[0].message);
    }
  }
}
