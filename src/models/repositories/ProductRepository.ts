import { excludeFields, parseArrayOfData } from "../../helpers/utils";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { FindAllArgs, IRepository } from "../../interfaces";
import { Product } from "../domains";
import { CreateProductDTO, UpdateProductDTO } from "../dtos";



export class ProductRepository{
    async create({name, description, assignments,productQuantity,productValue }: CreateProductDTO){
        const existingProduct = await prismaClient.product.findUnique({
            where: { name }
        });

        if (existingProduct) {
            throw new AppError(ErrorMessages.MSGE02);
        }

        const product = new Product(
            name,
            description,
            productValue,
            productQuantity,
            assignments, 
        )

        product.validate();

        const createProduct = await prismaClient.product.create({
        data: {
            name: product.name,
            description: product.description,
            productValue: product.productValue,
            productQuantity: product.productQuantity,
            assignments: {
                connect: product.assignments.map((id) => ({ id: id }))
            }
        },
        include: {
            assignments: true
        }
        })
        
        return excludeFields(createProduct, ['createdAt', 'updatedAt'])
    }

    async update(id: string, data: UpdateProductDTO){
        try {
            const productToUpdate = await prismaClient.product.findUniqueOrThrow({
                where: { id },
                include: { assignments: true }
            })

            const product = new Product(
                productToUpdate.name,
                productToUpdate.description as string,
                productToUpdate.productValue,
                productToUpdate.productQuantity,
                productToUpdate.assignments.map((assignment) => assignment.id),
            )

            if(data.name !== undefined) product.name = data.name;
            if(data.description !== undefined) product.description = data.description;
            if(data.productQuantity !== undefined) product.productQuantity = data.productQuantity;
            if(data.productValue !== undefined) product.productValue = data.productValue;
            if(data.status !== undefined) product.status = data.status;
            if(data.assignments !== undefined) product.assignments = data.assignments;
            
            product.validate();

            const needsToUpdateAssignments = JSON.stringify(productToUpdate.assignments) !== JSON.stringify(product.assignments);

            if(needsToUpdateAssignments){
                await prismaClient.product.update({
                    where: { id },
                    data: {
                        assignments: {
                            disconnect: productToUpdate.assignments.map((assignment) => ({ id: assignment.id }))
                        }
                    }
                })  
            }

            if(product.name !== productToUpdate.name) {
                const existingProduct = await prismaClient.product.findUnique({
                    where: { name: product.name }
                });

                if (existingProduct) {
                    throw new AppError(ErrorMessages.MSGE02);
                }
            }

            const updateProduct = await prismaClient.product.update({
                where: { id },
                data: {
                    name: product.name,
                    description: product.description,
                    productValue: product.productValue,
                    productQuantity: product.productQuantity,
                    assignments: {
                        connect: product.assignments.map((id) => ({ id: id }))
                    }
                },
                include: {
                    assignments: true
                }
            })

            return excludeFields(updateProduct, ['createdAt', 'updatedAt'])

        } catch (e) {
            if (e instanceof AppError) throw e;
            throw new AppError(ErrorMessages.MSGE05, 404);
        }
    }
        
    async findAll(args: FindAllArgs) {
        const where = {
          OR: args.searchTerm
            ? [
              {
                name: {
                  contains: args?.searchTerm,
                },
              },
              {
                description: {
                  contains: args?.searchTerm,
                },
              },
            ]
            : undefined,
          status: {
            equals: args?.filterByStatus,
          },
        };
    
        const totalItems = await prismaClient.product.count({ where });
    
        const data = await prismaClient.product.findMany({
          where,
          include: {
            assignments: true
          },
          orderBy: { createdAt: 'asc' },
          skip: args?.skip,
          take: args?.take,
        });
    
        return {
          data: parseArrayOfData(data, ['createdAt', 'updatedAt']),
          totalItems,
        };
      }
        
}


