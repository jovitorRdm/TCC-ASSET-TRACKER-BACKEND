import { z } from 'zod';
import { AppError, ErrorMessages } from '../../infra/http/errors';
import { AddressDTO } from '../dtos';

export class Address {
  constructor(
    private _street: string,
    private _number: string,
    private _neighborhood: string,
    private _city: string,
    private _state: string,
    private _cep: string,
    private _id?: string,
  ) {}

  get id() {
    return this._id!;
  }

  get street() {
    return this._street;
  }

  
  get number() {
      return this._number;
    }
    
    set number(number: string) {
        this._number = number;
    }
    
    get neighborhood() {
        return this._neighborhood;
    }
    
    set neighborhood(neighborhood: string) {
        this._neighborhood = neighborhood;
    }
    
    get city() {
        return this._city;
    }
    
    
    get state() {
        return this._state;
    }
    
    
    get cep() {
        return this._cep;
    }
    
  set city(city: string) {
    this._city = city;
  }
  set state(state: string) {
    this._state = state;
  }
  set street(street: string) {
    this._street = street;
  }
  set cep(cep: string) {
    this._cep = cep;
  }

  set id(id: string) {
    this._id = id;
  }

  toJSON() {
    return {
      id: this.id,
      street: this.street,
      number: this.number,
      neighborhood: this.neighborhood,
      city: this.city,
      state: this.state,
      cep: this.cep,
    };
  }

  setAll(data: AddressDTO) {
    this.id = data.id;
    this.street = data.street;
    this.number = data.number;
    this.neighborhood = data.neighborhood;
    this.city = data.city;
    this.state = data.state;
    this.cep = data.cep;
  }

  validate() {
    const addressSchema = z
      .object({
        id: z.string().uuid(),
       
      })
      .partial({ id: true });

    try {
      addressSchema.parse(this);
    } catch (err) {
      throw new AppError(err.issues[0].message);
    }
  }
}
