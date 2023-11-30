import { ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { CreateBudgetDTO, UpdateBudgetDTO } from "../dtos/budget";
import { excludeFields } from "../../helpers/utils";
import { Budget } from "../domains/Budget";
import { EventDTO } from "../dtos/event";

export class BudgetRepository {
  async create({
    customerId,
    totalAmount,
    pickupDate,
    budgetDetails,
    event,
  }: CreateBudgetDTO) {
    const existingBudget = await prismaClient.budget.findFirst({
      where: {
        customerId: customerId,
      },
    });

    if (existingBudget) {
      throw new Error(ErrorMessages.MSGE02);
    }

    const budget = new Budget(
      customerId,
      totalAmount,
      pickupDate,
      budgetDetails,
      event
    );

    const createBudget = await prismaClient.budget.create({
      data: {
        Customer: {
          connect: {
            id: customerId,
          },
        },
        totalAmount: budget.totalAmount,
        pickupDate: budget.pickupDate,
        BudgetDetails: budgetDetails
          ? {
              createMany: {
                data: budgetDetails.map((detail) => ({
                  productId: detail.productId,
                  serviceId: detail.serviceId,
                  name: detail.name,
                  quantity: detail.quantity,
                  unitPrice: detail.unitPrice,
                  totalPrice: detail.totalPrice,
                  discount: detail.discount,
                })),
              },
            }
          : undefined,
        Event: event
          ? {
              create: {
                eventType: {
                  connect: {
                    id: event.eventTypeId,
                  },
                },
                name: event.name,
                description: event.description,
                EventService: event.EventServices
                  ? {
                      createMany: {
                        data: event.EventServices.map((service) => ({
                          serviceId: service.serviceId,
                          name: service.name,
                          quantity: service.quantity,
                          unitPrice: service.unitPrice,
                          totalPrice: service.totalPrice,
                          discount: service.discount,
                        })),
                      },
                    }
                  : undefined,
                EventProduct: event.EventProducts
                  ? {
                      createMany: {
                        data: event.EventProducts.map((product) => ({
                          productId: product.productId,
                          name: product.name,
                          quantity: product.quantity,
                          unitPrice: product.unitPrice,
                          totalPrice: product.totalPrice,
                          discount: product.discount,
                        })),
                      },
                    }
                  : undefined,
              },
            }
          : undefined,
      },
    });

    return excludeFields(createBudget, ["createdAt", "updatedAt"]);
  }
  async update(id: string, data: UpdateBudgetDTO) {
    const budgetToUpdate = await prismaClient.budget.findUniqueOrThrow({
      where: { id },
      include: {
        Customer: true,
        BudgetDetails: true,
        Event: true,
      },
    });

    if (!budgetToUpdate) {
      throw new Error(ErrorMessages.MSGE05);
    }

    const budget = new Budget(
      budgetToUpdate.customerId,
      budgetToUpdate.totalAmount,
      budgetToUpdate.pickupDate,
      budgetToUpdate.BudgetDetails,
      budgetToUpdate.Event
    );

    // return excludeFields(updatedBudget, ["createdAt", "updatedAt"]);
  }
}
