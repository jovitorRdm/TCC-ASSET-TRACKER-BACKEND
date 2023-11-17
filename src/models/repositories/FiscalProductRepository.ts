import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { FiscalProduct } from "../domains";
import { CreateFiscalProductDTO, FiscalProductDTO, UpdateFiscalProductDTO } from "../dtos/fiscalProduct";
import { excludeFields, parseArrayOfData } from "../../helpers/utils";
import { FindAllArgs } from "../../interfaces";
import { Product as DomainProduct } from '../domains';
import { GenericStatus, ProductDTO } from "../dtos";

export class FiscalProductRepository {
    async create({
        invoiceNumber,
        issueDate,
        products,
        supplier
    }: CreateFiscalProductDTO) {

        const existingFiscalProduct = await prismaClient.fiscalProduct.findFirst({
            where: {
                invoiceNumber
            }
        })

        if (existingFiscalProduct) {
            throw new AppError(ErrorMessages.MSGE02);
        }

        const fiscalProduct = new FiscalProduct(
          supplier,
          invoiceNumber,
          issueDate,
          products,
        )

        fiscalProduct.validate();

        const createdFiscalProduct = await prismaClient.fiscalProduct.create({
            data: {
                invoiceNumber: fiscalProduct.invoiceNumber,
                issueDate: fiscalProduct.issueDate,
                Product: {
                    connect: fiscalProduct.products.map(product => ({ id: product.id }))
                },
                supplier: {
                    connect: { id: fiscalProduct.supplier }
                }
            },
            include: {
                supplier: true,
                Product: true
            }
        });
        

        for (const product of products) {

            if (typeof product === 'object' && product?.id && product?.quantity) {
                const existingProduct = await prismaClient.product.findUnique({
                    where: { id: product.id },
                });
        
                if (existingProduct) {
                    const newQuantity = existingProduct.quantity + product.quantity;
                    const newValue = existingProduct.value + product.value;
                    
                    await prismaClient.product.update({
                        where: { id: product.id },
                        data: {
                            quantity: newQuantity,
                            value: newValue,
                        },
                    });
                }
            }
        }


        return excludeFields(createdFiscalProduct, ['createdAt', 'updatedAt']);
    }

    async update(id: string, data: UpdateFiscalProductDTO) {
        try{
            const fiscalProductToUpdate = await prismaClient.fiscalProduct.findUniqueOrThrow({
                where: { id },
                include: {
                    supplier: true,
                    Product: true,
                } 
            }
            );
            
            const fiscalProduct = new FiscalProduct(
                fiscalProductToUpdate.supplierId,
                fiscalProductToUpdate.invoiceNumber,
                fiscalProductToUpdate.issueDate,
                fiscalProductToUpdate.Product as ProductDTO[],
            )

            if(data.supplier !== undefined) fiscalProduct.supplier = data.supplier;
            if(data.invoiceNumber !== undefined) fiscalProduct.invoiceNumber = data.invoiceNumber;
            if(data.issueDate !== undefined) fiscalProduct.issueDate = data.issueDate;
            if(data.products !== undefined) fiscalProduct.products = data.products;
            if(data.status !== undefined) fiscalProduct.status = data.status;

            fiscalProduct.validate();

            const needsToUpdateFiscalProduct = JSON.stringify(fiscalProduct) !== JSON.stringify(fiscalProductToUpdate);

            if(needsToUpdateFiscalProduct){
                await prismaClient.fiscalProduct.update({
                    where: {
                        id
                    },
                    data: {
                        supplier: {
                            connect: {
                                id: fiscalProduct.supplier
                            }
                        },
                        status: fiscalProduct.status,
                        issueDate: fiscalProduct.issueDate,
                        Product: {
                          disconnect: fiscalProductToUpdate.Product.map((product) => ({ id: product.id }))   
                        }, 
                    },       
                });
            }
            
            if(fiscalProduct.invoiceNumber !== fiscalProductToUpdate.invoiceNumber){
                const existingFiscalProduct = await prismaClient.fiscalProduct.findFirst({
                    where: {
                        invoiceNumber: fiscalProduct.invoiceNumber
                    }
                });

                if(existingFiscalProduct){
                    throw new AppError(ErrorMessages.MSGE02);
                }
            }

            const updatedFiscalProduct = await prismaClient.fiscalProduct.update({
                where: { id },
                data: {
                    invoiceNumber: fiscalProduct.invoiceNumber,
                    issueDate: fiscalProduct.issueDate,
                    Product: {
                        connect: fiscalProduct.products.map(product => ({ id: product.id }))
                    },
                    supplier: {
                        connect: {
                            id: fiscalProduct.supplier
                        }
                    },
                    status: fiscalProduct.status
                },
            });

            return excludeFields(updatedFiscalProduct, ['createdAt', 'updatedAt']);
        }
        catch(e){
        if(e instanceof AppError) throw e;

        throw new AppError(ErrorMessages.MSGE02, 404);
        }  
    }

    async findAll(args: FindAllArgs) {
        const where = {
            OR: args.searchTerm
              ? [
                {
                    invoiceNumber: {
                    contains: args?.searchTerm,
                  },
                }
              ]
              : undefined,
            status: {
              equals: args?.filterByStatus,
            },
          };

        const totalItems = await prismaClient.fiscalProduct.count({
            where,

        });

        const data = await prismaClient.fiscalProduct.findMany({
            where,
            include: {
                supplier: {
                    select: {
                        person: true,
                    }
                },
                Product: true
            },
            orderBy: { createdAt: 'asc' },
            skip: args?.skip,
            take: args?.take,
        });

        return {
            data: parseArrayOfData(data.map(
                (item) => (
                    {...item, supplier: item.supplier.person}
                     

            )), ['createdAt', 'updatedAt']),
            totalItems,
        };
    }

    async findById(id: string){
        const fiscalProduct = await prismaClient.fiscalProduct.findUnique({
            where: { id }
        })

        if(!fiscalProduct){
            throw new Error(ErrorMessages.MSGE05);
        }

        const dataToReturn = {
            ...excludeFields(
            {
                ...fiscalProduct,
            },
            [
                'createdAt',
                'updatedAt',
            ]),
        }

        return dataToReturn;
    }
}  