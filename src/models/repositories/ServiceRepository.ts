import { parseArrayOfData, excludeFields } from "../../helpers/utils";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { FindAllArgs, IRepository } from "../../interfaces";
import { Service } from "../domains/Service";
import { CreateServiceDTO, GenericStatus, UpdateServiceDTO } from "../dtos";

export class ServiceRepository implements IRepository {
  async create({
    name,
    description,
    assignmentId,
    saleValue,
  }: CreateServiceDTO) {
    const existingService = await prismaClient.service.findUnique({
      where: { name },
    });

    if (existingService) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const service = new Service(name, description, assignmentId, saleValue);

    service.validate();

    const createService = await prismaClient.service.create({
      data: {
        name: service.name,
        description: service.description,
        Assignment: {
          connect: {
            id: service.assignmentId,
          },
        },
        saleValue: service.saleValue,
      },
      include: {
        Assignment: true,
      },
    });

    return excludeFields(createService, ["createdAt", "updatedAt"]);
  }
  async update(id: string, data: UpdateServiceDTO) {
    try {
      const serviceToUpdate = await prismaClient.service.findUniqueOrThrow({
        where: { id },
        include: { Assignment: true },
      });

      const service = new Service(
        serviceToUpdate.name,
        serviceToUpdate.description as string,
        serviceToUpdate.assignmentId,
        serviceToUpdate.saleValue
      );

      if (data.name !== undefined) service.name = data.name;
      if (data.description !== undefined)
        service.description = data.description;
      if (data.status !== undefined) service.status = data.status;
      if (data.assignmentId !== undefined)
        service.assignmentId = data.assignmentId;
      if (data.saleValue !== undefined) service.saleValue = data.saleValue;

      service.validate();

      const needsToUpdateAssignments =
        JSON.stringify(serviceToUpdate.assignmentId) !==
        JSON.stringify(service.assignmentId);

      if (needsToUpdateAssignments) {
        await prismaClient.service.update({
          where: { id },
          data: {
            Assignment: {
              connect: {
                id: service.assignmentId,
              },
            },
          },
          include: {
            Assignment: true,
          },
        });
      }

      if (service.name !== serviceToUpdate.name) {
        const existingService = await prismaClient.service.findUnique({
          where: { name: service.name },
        });

        if (existingService) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      const updatedService = await prismaClient.service.update({
        where: { id },
        data: {
          name: service.name,
          description: service.description,
          status: service.status,
          Assignment: {
            connect: {
              id: service.assignmentId,
            },
          },
        },
        include: {
          Assignment: true,
        },
      });

      return excludeFields(updatedService, ["createdAt", "updatedAt"]);
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

    const totalItems = await prismaClient.service.count({ where });

    const data = await prismaClient.service.findMany({
      where,
      include: {
        Assignment: true,
      },
      orderBy: { createdAt: "asc" },
      skip: args?.skip,
      take: args?.take,
    });

    return {
      data: parseArrayOfData(data, ["createdAt", "updatedAt"]),
      totalItems,
    };
  }
}
