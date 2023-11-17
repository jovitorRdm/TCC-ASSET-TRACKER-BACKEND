
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { CreateProductDTO, GenericStatus, MeasurementUnit, UpdateProductDTO } from "../dtos";
import { excludeFields } from '../../helpers/utils';
import { FindAllArgs } from "../../interfaces";
import { FiscalProduct, Product } from "../domains";


export class ProductRepository {

    async create({
        name,
        description, 
        measurementUnit, 
        consumptionPerPerson,
        quantity,
        value,
    }:CreateProductDTO){

        const existingProduct = await prismaClient.product.findUnique(
            {
                where: { name }
            }
        );

        if (existingProduct) {
            throw new Error(ErrorMessages.MSGE02);
        }

        const product = new Product(
            name, 
            description, 
            consumptionPerPerson,
            measurementUnit,
            quantity = 0,
            value = 0,           
        )

        product.validate();

        const createProduct = await prismaClient.product.create({
            data: {
                name: product.name,
                description: product.description,
                consumptionPerPerson: product.consumptionPerPerson,
                measurementUnit: product.measurementUnit,
                quantity: product.quantity,
                value: product.value,
            },
            include: {
                FiscalProduct: true
            }
        });

        return excludeFields(createProduct, ['createdAt', 'updatedAt']);
    }

    async update(id: string, data: UpdateProductDTO){
        try{
            const productToUpdate = await prismaClient.product.findUnique({
                where: { id }
            })
            
            const product = new Product(
                productToUpdate.name,
                productToUpdate.description,
                productToUpdate.consumptionPerPerson,
                productToUpdate.measurementUnit as MeasurementUnit,
                productToUpdate.quantity,
                productToUpdate.value
            )
    
            if(data.name !== undefined) product.name = data.name;
            if(data.description !== undefined) product.description = data.description;
            if(data.consumptionPerPerson !== undefined) product.consumptionPerPerson = data.consumptionPerPerson;
            if(data.measurementUnit !== undefined) product.measurementUnit = data.measurementUnit;
            if(data.quantity !== undefined) product.quantity = data.quantity;
            if(data.value !== undefined) product.value = data.value;
            if(data.status !== undefined) product.status = data.status;
    
            product.validate()

            if (product.name !== product.name) {
                const existingProduct = await prismaClient.product.findUnique({
                  where: { name: product.name }
                });
        
                if (existingProduct) {
                  throw new AppError(ErrorMessages.MSGE02);
                }
              }
    
            const updatedProduct = await prismaClient.product.update({
                where: { id },
                data: {
                    name: product.name,
                    description: product.description,
                    consumptionPerPerson: product.consumptionPerPerson,
                    measurementUnit: product.measurementUnit,
                    quantity: product.quantity,
                    value: product.value,
                    status: product.status
                },
                
            });
    
            const dataToReturn = {
                ...excludeFields(
                {
                    ...updatedProduct,
                },
                [
                    'createdAt',
                    'updatedAt',
                ]),
            }
    
            return dataToReturn;   
        }
        catch(e){
            if(e instanceof AppError) throw e;

            throw new AppError(ErrorMessages.MSGE02, 404);
        }
    }

    async findAll(args?: FindAllArgs){
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
                    description: {
                      contains: args?.searchTerm,
                    },
                  },
                ]
              : undefined,
            status:{
              equals: args?.filterByStatus,
            }
        }
        const totalItems = await prismaClient.product.count({
            where,
        })

        const data = await prismaClient.product.findMany({
            where,
            orderBy: { createdAt: 'asc' },
            skip: args?.skip,
            take: args?.take,
        })

        const dataToReturn = {
            data,
            totalItems
        }

        return dataToReturn;
    }

    async findById(id: string){
        const product = await prismaClient.product.findUnique({
            where: { id }
        })

        if(!product){
            throw new Error(ErrorMessages.MSGE05);
        }

        const dataToReturn = {
            ...excludeFields(
            {
                ...product,
            },
            [
                'createdAt',
                'updatedAt',
            ]),
        }

        return dataToReturn;
    }

}