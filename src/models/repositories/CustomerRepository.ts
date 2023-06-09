import bcrypt from 'bcrypt';
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { FindAllArgs, IRepository } from "../../interfaces/IRepository";
import { Address } from "../domains/Address";
import { GenericStatus } from "../dtos";
import { prismaClient } from "../../infra/prisma";
import { generatePassword } from "../../helpers/utils/generatePassword";
import { excludeFields } from '../../helpers/utils/excludeFields';
import { CreateCustomerDTO, UpdateCustomerDTO } from '../dtos/customer';
import { Customer } from '../domains/Customer';

export class CustomerRepository implements IRepository{
    async create({
        address: addressData,
        birthdate,
        cpf,
        email,
        name,
        phoneNumber,
      }: CreateCustomerDTO) {

        const existingCustomer = await prismaClient.customer.findFirst({
            where: { OR: [{ cpf }, { email }] },
          });

        if (existingCustomer) {
          throw new AppError(ErrorMessages.MSGE02);
        }
    
        const address = new Address(
          addressData.street,
          addressData.number,
          addressData.neighborhood,
          addressData.city,
          addressData.state,
          addressData.cep
        );
        
        address.validate();

        const customer = new Customer(
          name, 
          cpf, 
          birthdate,
          phoneNumber,
          email,
          generatePassword(),
          address.toJSON()
        )

        const hashPassword = await bcrypt.hash(
          customer.password,
          8
        );

        const createdCustomer = await prismaClient.customer.create({
          data: {
            name: customer.name,
            cpf: customer.cpf,
            birthdate: customer.birthdate,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
            password: hashPassword,
            address: {
              create: {
                street: customer.address.street,
                number: customer.address.number,
                neighborhood: customer.address.neighborhood,
                city: customer.address.city,
                state: customer.address.state,
                cep: customer.address.cep,
              },
            },
          },
          include: {
            address: true,
          },
        });

        const dataToReturn = {
          ...excludeFields(createdCustomer, [
            'createdAt',
            'updatedAt',
            'password',
          ]),
      }
      return dataToReturn;
    }

    async update(id: string, data: UpdateCustomerDTO){
      const customerToUpdate = await prismaClient.customer.findUnique({
        where: { id },
        include: {
          address: true,
        },
      });

      if (!customerToUpdate) {
        throw new AppError(ErrorMessages.MSGE05, 404);
      }

      const address = new Address(
        customerToUpdate.address.street,
        customerToUpdate.address.number,
        customerToUpdate.address.neighborhood,
        customerToUpdate.address.city,
        customerToUpdate.address.state,
        customerToUpdate.address.cep,
        customerToUpdate.address.id
      );

      if(data.address){
        address.setAll(data.address);
        address.validate();
      }

      const customer = new Customer(
        customerToUpdate.name,
        customerToUpdate.cpf,
        customerToUpdate.birthdate.toISOString(),
        customerToUpdate.phoneNumber,
        customerToUpdate.email,
        customerToUpdate.password,
        address.toJSON(),
        customerToUpdate.status as GenericStatus,
        customerToUpdate.id
      );

      if (data.name !== undefined) customer.name = data.name;
      if (data.cpf !== undefined) customer.cpf = data.cpf;
      if (data.birthdate !== undefined) customer.birthdate = data.birthdate;
      if (data.phoneNumber !== undefined) customer.phoneNumber = data.phoneNumber;
      if (data.email !== undefined) customer.email = data.email;
      if (data.status !== undefined) customer.status = data.status;

      customer.validate();

      if (customer.cpf !== customerToUpdate.cpf) {
        const existingCustomer = await prismaClient.customer.findFirst({
          where: { cpf: customer.cpf },
        });
  
        if (existingCustomer) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }
  
      if (customer.email !== customerToUpdate.email) {
        const existingCustomer = await prismaClient.customer.findFirst({
          where: { email: customer.email },
        });
  
        if (existingCustomer) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      
      
      const updatedCustomer = await prismaClient.customer.update({
        where: { id },
        data: {
          status: customer.status,
          name: customer.name,
          cpf: customer.cpf,
          birthdate: customer.birthdate,
          phoneNumber: customer.phoneNumber,
          email: customer.email,
          password: customer.password,
          address: {
            update: {
              ...address.toJSON(),
            },
          },  
        },
        include: {
          address: true,
        },
      });      

    const dataToReturn = {
      ...excludeFields(updatedCustomer, [
        'createdAt',
        'updatedAt',
        'password',
        'addressid',
      ]),
    }  
    return dataToReturn;
  }

  async findAll(args?: FindAllArgs) {
    const where = {
      NOT: args?.itemsToExclude
        ? { id: { in: args?.itemsToExclude } }
        : undefined,
      OR: args?.searchTerm
        ? [
            {
              name: {
                contains: args?.searchTerm,
              },
            },
            {
              cpf: {
                contains: args?.searchTerm,
              },
            },
            {
              email: {
                contains: args?.searchTerm,
              },
            },
          ]
        : undefined,
      status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prismaClient.customer.count({
      where,
    });
      const data = await prismaClient.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: args?.skip,
      take: args?.take,
      include: {
        address: true,
      },
    });

    const dataToUse = data.map((customer) => ({
      ...excludeFields(customer, [
        'createdAt',
        'updatedAt',
        'password',
      ]),
    }));

    return {
      data: dataToUse,
      totalItems,
    };
  }

  async findById(id: string) {
    try {
      const customer = await prismaClient.customer.findUniqueOrThrow({
        where: { id },
      });

      return { ...customer};
    } catch {
      throw new AppError(ErrorMessages.MSGE02);
    }
  }
     
}