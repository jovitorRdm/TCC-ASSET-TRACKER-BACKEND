import bcrypt from "bcrypt";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { FindAllArgs, IRepository } from "../../interfaces/IRepository";
import { Address } from "../domains/Address";
import { GenericStatus } from "../dtos";
import { prismaClient } from "../../infra/prisma";
import { excludeFields } from "../../helpers/utils/excludeFields";
import { CreateCustomerDTO, UpdateCustomerDTO } from "../dtos/customer";
import { Customer } from "../domains/Customer";
import { CreatePersonDTO, UpdatePersonDTO } from "../dtos/person";
import { Person } from "../domains/Person";

export class CustomerRepository implements IRepository {
  async create({
    document,
    name,
    address: addressData,
    birthdate,
    phoneNumber,
    email,
  }: CreatePersonDTO) {
    const existingPerson = await prismaClient.person.findFirst({
      where: { OR: [{ document }, { email }] },
    });

    if (existingPerson) {
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

    const createdCustomer = await prismaClient.customer.create({
      data: {
        person: {
          create: {
            name,
            document,
            birthdate,
            phoneNumber,
            email,
            address: {
              create: address.toJSON(),
            },
          },
        },
      },
      include: {
        person: {
          include: {
            address: true,
          },
        },
      },
    });

    const dataToReturn = {
      ...excludeFields(
        {
          ...createdCustomer.person,
          id: createdCustomer.id,
        },
        ["createdAt", "updatedAt"]
      ),
    };
    return dataToReturn;
  }

  async update(id: string, data: UpdateCustomerDTO) {
    const customerToUpdate = await prismaClient.customer.findUnique({
      where: { id },
      include: {
        person: {
          include: {
            address: true,
          },
        },
      },
    });

    if (!customerToUpdate) {
      throw new AppError(ErrorMessages.MSGE05, 404);
    }

    const address = new Address(
      customerToUpdate.person.address.street,
      customerToUpdate.person.address.number,
      customerToUpdate.person.address.neighborhood,
      customerToUpdate.person.address.city,
      customerToUpdate.person.address.state,
      customerToUpdate.person.address.cep,
      customerToUpdate.person.address.id
    );

    if (data.address) {
      address.setAll(data.address);
      address.validate();
    }

    const customer = new Customer(
      customerToUpdate.person.document,
      customerToUpdate.person.name,
      customerToUpdate.person.birthdate.toISOString(),
      customerToUpdate.person.phoneNumber,
      customerToUpdate.person.email,
      address.toJSON(),
      customerToUpdate.status as GenericStatus,
      customerToUpdate.id
    );

    if (data.document !== undefined) customer.document = data.document;
    if (data.name !== undefined) customer.name = data.name;
    if (data.birthdate !== undefined) customer.birthdate = data.birthdate;
    if (data.phoneNumber !== undefined) customer.phoneNumber = data.phoneNumber;
    if (data.email !== undefined) customer.email = data.email;
    if (data.address !== undefined) customer.address = data.address;
    if (data.status !== undefined) customer.status = data.status;

    customer.validate();

    if (customer.document !== customerToUpdate.person.document) {
      const existingPerson = await prismaClient.person.findFirst({
        where: { document: customer.document },
      });

      if (existingPerson) {
        throw new AppError(ErrorMessages.MSGE02);
      }
    }

    if (customer.email !== customerToUpdate.person.email) {
      const existingCustomer = await prismaClient.person.findFirst({
        where: { email: customer.email },
      });

      if (existingCustomer) {
        throw new AppError(ErrorMessages.MSGE02);
      }
    }

    const updatedCustomer = await prismaClient.customer.update({
      where: { id },
      data: {
        person: {
          update: {
            document: customer.document,
            status: customer.status,
            name: customer.name,
            birthdate: customer.birthdate,
            phoneNumber: customer.phoneNumber,
            email: customer.email,
            address: {
              update: {
                ...address.toJSON(),
              },
            },
          },
        },
      },
      include: {
        person: {
          include: {
            address: true,
          },
        },
      },
    });

    const dataToReturn = {
      ...excludeFields({ ...updatedCustomer.person, id: updatedCustomer.id }, [
        "createdAt",
        "updatedAt",
        "addressid",
      ]),
    };
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
              person: {
                name: {
                  contains: args?.searchTerm,
                },
              },
            },
            {
              person: {
                document: {
                  contains: args?.searchTerm,
                },
              },
            },
            {
              person: {
                email: {
                  contains: args?.searchTerm,
                },
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
      orderBy: { createdAt: "desc" },
      skip: args?.skip,
      take: args?.take,
      include: {
        person: {
          include: {
            address: true,
          },
        },
      },
    });

    const dataToUse = data.map((customer) => ({
      ...excludeFields({ ...customer.person, id: customer.id }, [
        "createdAt",
        "updatedAt",
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

      return { ...customer };
    } catch {
      throw new AppError(ErrorMessages.MSGE02);
    }
  }
}
