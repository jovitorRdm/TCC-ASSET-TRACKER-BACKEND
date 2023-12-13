import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { CreateBudgetDTO, TypeBudget, UpdateBudgetDTO } from "../dtos/budget";
import { excludeFields, parseArrayOfData } from "../../helpers/utils";
import { Budget } from "../domains/Budget";
import {
  BudgetServicesDTO,
  UpdateBudgetServicesDTO,
} from "../dtos/budgetServices";
import { FindAllArgs } from "../../interfaces";
import { Product } from "../domains";

export class BudgetRepository {
  async create({
    typeBudget,
    customerId,
    numberPeople,
    pickupDate,
    returnDate,
    totalAmount,
    totalCharged,
    discount,
    eventTypeId,
    budgetProducts,
    budgetServices,
  }: CreateBudgetDTO) {
    const existingBudget = await prismaClient.budget.findFirst({
      where: {
        Customer: {
          id: customerId,
        },
      },
    });

    if (existingBudget) {
      throw new Error(ErrorMessages.MSGE02);
    }

    const budget = new Budget(
      typeBudget,
      customerId,
      numberPeople,
      pickupDate,
      returnDate,
      totalAmount,
      totalCharged,
      eventTypeId,
      budgetServices,
      budgetProducts,
      discount
    );

    const createBudget = await prismaClient.budget.create({
      data: {
        typeBudget: budget.typeBudget,
        Customer: {
          connect: {
            id: budget.customerId,
          },
        },
        numberPeople: budget.numberPeople,
        pickupDate: budget.pickupDate,
        returnDate: budget.returnDate,
        totalAmount: budget.totalAmount,
        totalCharged: budget.totalCharged,
        discount: budget.discount,
        eventType: {
          connect: {
            id: budget.eventTypeId,
          },
        },
        budgetProduct: {
          createMany: {
            data: budget.budgetProducts.map((detail) => ({
              productId: detail.productId,
              quantity: detail.quantity,
              unitPrice: detail.unitPrice,
            })),
          },
        },
        budgetService: {
          createMany: {
            data: budget.budgetServices.map((detail) => ({
              serviceId: detail.serviceId,
              unitPrice: detail.unitPrice,
              quantity: detail.quantity,
            })),
          },
        },
      },
      include: {
        Customer: true,
        eventType: true,
        budgetProduct: true,
        budgetService: true,
      },
    });

    return excludeFields(createBudget, ["createdAt", "updatedAt"]);
  }
  async update(id: string, data: UpdateBudgetDTO) {
    try {
      const budgetToUpdate = await prismaClient.budget.findUniqueOrThrow({
        where: { id },
        include: {
          eventType: true,
          Customer: true,
          budgetProduct: true,
          budgetService: true,
        },
      });

      if (!budgetToUpdate) {
        throw new Error(ErrorMessages.MSGE05);
      }

      const budget = new Budget(
        budgetToUpdate.typeBudget as TypeBudget,
        budgetToUpdate.customerId,
        budgetToUpdate.numberPeople,
        budgetToUpdate.pickupDate,
        budgetToUpdate.returnDate,
        budgetToUpdate.totalAmount,
        budgetToUpdate.totalCharged,
        budgetToUpdate.eventTypeId,
        budgetToUpdate.budgetService,
        budgetToUpdate.budgetProduct,
        budgetToUpdate.discount
      );

      if (data.typeBudget !== undefined) budget.typeBudget = data.typeBudget;
      if (data.numberPeople !== undefined)
        budget.numberPeople = data.numberPeople;
      if (data.pickupDate !== undefined) budget.pickupDate = data.pickupDate;
      if (data.returnDate !== undefined) budget.returnDate = data.returnDate;
      if (data.totalAmount !== undefined) budget.totalAmount = data.totalAmount;
      if (data.totalCharged !== undefined)
        budget.totalCharged = data.totalCharged;
      if (data.eventTypeId !== undefined) budget.eventTypeId = data.eventTypeId;
      if (data.budgetServices !== undefined)
        budget.budgetServices = data.budgetServices;
      if (data.budgetProducts !== undefined)
        budget.budgetProducts = data.budgetProducts;
      if (data.discount !== undefined) budget.discount = data.discount;

      // budget.validate();

      const budgetProductsDeleted = budgetToUpdate.budgetProduct.filter(
        (product) =>
          !budget.budgetProducts.some(
            (detail) => detail.productId === product.productId
          )
      );

      const budgetServicesDeleted = budgetToUpdate.budgetService.filter(
        (service) =>
          !budget.budgetServices.some(
            (detail) => detail.serviceId === service.serviceId
          )
      );

      if (budgetProductsDeleted.length > 0) {
        await prismaClient.budgetProducts.deleteMany({
          where: {
            id: {
              in: budgetProductsDeleted.map((detail) => detail.id),
            },
          },
        });
      }

      if (budgetServicesDeleted.length > 0) {
        await prismaClient.budgetServices.deleteMany({
          where: {
            id: {
              in: budgetServicesDeleted.map((detail) => detail.id),
            },
          },
        });
      }

      const budgetProductsToCreate = budget.budgetProducts.filter(
        (product) => !product.productId
      );

      const budgetServicesToCreate = budget.budgetServices.filter(
        (service) => !service.serviceId
      );

      const budgetProductsToUpdate = budget.budgetProducts.filter((product) => {
        const productToUpdate = budgetToUpdate.budgetProduct.find(
          (detail) => detail.productId === product.productId
        );

        return JSON.stringify(product) !== JSON.stringify(productToUpdate);
      });

      const budgetServicesToUpdate = budget.budgetServices.filter((service) => {
        const serviceToUpdate = budgetToUpdate.budgetService.find(
          (detail) => detail.serviceId === service.serviceId
        );

        return JSON.stringify(service) !== JSON.stringify(serviceToUpdate);
      });

      const updatedBudget = await prismaClient.budget.update({
        where: { id },
        data: {
          typeBudget: budget.typeBudget,
          Customer: {
            connect: {
              id: budget.customerId,
            },
          },
          numberPeople: budget.numberPeople,
          pickupDate: budget.pickupDate,
          returnDate: budget.returnDate,
          totalAmount: budget.totalAmount,
          totalCharged: budget.totalCharged,
          discount: budget.discount,
          eventType: {
            connect: {
              id: budget.eventTypeId,
            },
          },
          budgetProduct: {
            createMany: {
              data: budgetProductsToCreate.map((detailProduct) => ({
                productId: detailProduct.productId,
                unitPrice: detailProduct.unitPrice,
                quantity: detailProduct.quantity,
              })),
            },
            updateMany: budgetProductsToUpdate.map((detailProductToUpdate) => ({
              where: {
                productId: detailProductToUpdate.productId,
              },
              data: {
                unitPrice: detailProductToUpdate.unitPrice,
                quantity: detailProductToUpdate.quantity,
              },
            })),
          },
          budgetService: {
            createMany: {
              data: budgetServicesToCreate.map((detailService) => ({
                serviceId: detailService.serviceId,
                unitPrice: detailService.unitPrice,
                quantity: detailService.quantity,
              })),
            },
            updateMany: budgetServicesToUpdate.map((detailServiceToUpdate) => ({
              where: {
                serviceId: detailServiceToUpdate.serviceId,
              },
              data: {
                unitPrice: detailServiceToUpdate.unitPrice,
                quantity: detailServiceToUpdate.quantity,
              },
            })),
          },
        },
        include: {
          Customer: true,
          eventType: true,
          budgetProduct: true,
          budgetService: true,
        },
      });

      return excludeFields(updatedBudget, ["createdAt", "updatedAt"]);
    } catch (e) {
      if (e instanceof AppError) throw e;

      throw new AppError(ErrorMessages.MSGE03, 404);
    }
  }

  async findAll(args?: FindAllArgs) {
    const where = {
      OR: args?.searchTerm
        ? [
            {
              Customer: {
                person: {
                  name: {
                    contains: args?.searchTerm,
                  },
                },
              },
            },
          ]
        : undefined,
      status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prismaClient.budget.count({
      where,
    });

    const data = await prismaClient.budget.findMany({
      where,
      include: {
        Customer: {
          include: {
            person: true,
          },
        },
        eventType: true,
        budgetProduct: {
          include: {
            Product: true,
          },
        },
        budgetService: {
          include: {
            Service: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      skip: args?.skip,
      take: args?.take,
    });

    return {
      data: parseArrayOfData(
        data.map((budget) => ({
          ...budget,
          customerId: budget.Customer.id,
          budgetProducts: budget.budgetProduct.map((detailProduct) => ({
            productId: detailProduct.productId,
            unitPrice: detailProduct.unitPrice,
            quantity: detailProduct.quantity,
          })),
          budgetServices: budget.budgetService.map((detailService) => ({
            serviceId: detailService.serviceId,
            unitPrice: detailService.unitPrice,
            quantity: detailService.quantity,
          })),
        })),
        ["createdAt", "updatedAt"]
      ),
      totalItems,
    };
  }

  async findById(id: string) {
    const budget = await prismaClient.budget.findUnique({
      where: { id },
    });

    if (!budget) {
      throw new Error(ErrorMessages.MSGE05);
    }

    const dataToReturn = {
      ...excludeFields(
        {
          ...budget,
        },
        ["createdAt", "updatedAt"]
      ),
    };

    return dataToReturn;
  }
}
