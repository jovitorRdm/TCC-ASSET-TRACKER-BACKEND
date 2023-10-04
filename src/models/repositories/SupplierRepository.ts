import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { Address, Supplier } from "../domains";
import { FindAllArgs, IRepository } from "../../interfaces";
import { excludeFields } from '../../helpers/utils';
import { CreatedSupplierDTO, UpdateSupplierDTO, GenericStatus} from "../dtos";

export class SupplierRepository implements IRepository{
    async create({
        document,
        name,
        address: addressData,
        birthdate,
        phoneNumber,
        email,
    }:CreatedSupplierDTO){
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
            addressData.cep,
        )

        address.validate();
    
        const createdSupplier = await prismaClient.supplier.create({
            data: {
                person: {
                    create: {
                        name,
                        document,
                        birthdate,
                        phoneNumber,
                        email,
                        address:{
                            create: address.toJSON()
                        }  
                    }
                },
            },
            include: {
                person: {
                    include: {
                        address: true,
                    }
                }}, 
                
            });
       
    
            const dataToReturn = {
                ...excludeFields(
                {
                  ...createdSupplier.person, 
                  id: createdSupplier.id
                },
                [
                  'createdAt',
                  'updatedAt',
                  'addressid'
                ]),
            }
            return dataToReturn;
    }

    async update(id: string, data: UpdateSupplierDTO){
        const supplierUpdated = await prismaClient.supplier.findUnique({
            where: { id },
            include: {
                person: {
                    include: {
                        address: true,
                    }
                }},
        });

        if(!supplierUpdated){
            throw new AppError(ErrorMessages.MSGE05, 404);
        }

        const address = new Address(
            supplierUpdated.person.address.street,
            supplierUpdated.person.address.number,
            supplierUpdated.person.address.neighborhood,
            supplierUpdated.person.address.city,
            supplierUpdated.person.address.state,
            supplierUpdated.person.address.cep,
            supplierUpdated.person.address.id
        )

        if(data.address){
            address.setAll(data.address);
            address.validate();
        }

        const supplier = new Supplier(
            supplierUpdated.person.document,
            supplierUpdated.person.name,
            supplierUpdated.person.birthdate.toISOString(),
            supplierUpdated.person.phoneNumber,
            supplierUpdated.person.email,
            address.toJSON(),
            supplierUpdated.person.status as GenericStatus,
            supplierUpdated.id
        )
        
        if(data.document !== undefined) supplier.document = data.document;
        if(data.name !== undefined) supplier.name = data.name;
        if(data.birthdate !== undefined) supplier.birthdate = data.birthdate;
        if(data.phoneNumber !== undefined) supplier.phoneNumber = data.phoneNumber;
        if(data.email !== undefined) supplier.email = data.email;
        if(data.status !== undefined) supplier.status = data.status;

        supplier.validate();

        if(supplier.document !== supplierUpdated.person.document){
            const existingSupplier = await prismaClient.person.findFirst({
                where: { document: supplier.document },
              });

            if (existingSupplier) {
                throw new AppError(ErrorMessages.MSGE02);
            }
        }

        if(supplier.email !== supplierUpdated.person.email){
            const existingSupplier = await prismaClient.person.findFirst({
                where: { email: supplier.email },
              });

            if (existingSupplier) {
                throw new AppError(ErrorMessages.MSGE02);
            }
        }

        const updateSupplier = await prismaClient.supplier.update({
            where: { id },
            data: {
                person: {
                    update: {
                        status: supplier.status,
                        name: supplier.name,
                        document: supplier.document,
                        birthdate: supplier.birthdate,
                        phoneNumber: supplier.phoneNumber,
                        email: supplier.email,                        
                    },
                }
            },
            include: {
                person: {
                    include: {
                        address: true,
                    }
                }
            }
        });
        
        const dataToReturn = {
            ...excludeFields({...updateSupplier.person, id: updateSupplier.id}, [
              'createdAt',
              'updatedAt',
              'addressid'
            ]),
        }

        return dataToReturn;
    
    }
    
    async findAll(args?: FindAllArgs){
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
            }
        }
        const totalItems = await prismaClient.supplier.count({
            where,
        });

        const data = await prismaClient.supplier.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: args?.skip,
            take: args?.take,
            include: {
                person: {
                    include: {
                        address: true,
                    }
                }
            }
        });

        const dataToReturn = data.map(
            (supplier) => ({
                ...excludeFields(
                    {
                      ...supplier.person, 
                      id: supplier.id, 
                    },
                     [
                    'createdAt',
                    'updatedAt',
                  ]),
            })
        )

        return {
            data: dataToReturn,
            totalItems,
        };
    }

    async findById(id: string){
        try{
            const supplier = await prismaClient.supplier.findUniqueOrThrow({
                where: { id },
                
            });

            return { ...supplier};
        }
        catch{
            throw new AppError(ErrorMessages.MSGE02);
        }
    }
}