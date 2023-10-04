import { parseArrayOfData, excludeFields} from "../../helpers/utils";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { FindAllArgs, IRepository } from "../../interfaces";
import { Service } from "../domains/Service";
import { GenericStatus, UpdateServiceDTO } from "../dtos";

export class ServiceRepository implements IRepository {


  async create({ name, description, assignments }){
    const existingService = await prismaClient.service.findUnique({
      where: { name }
      
    });

    if (existingService) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const service = new Service(
      name, 
      description, 
      assignments
    );

    service.validate();

    const createService = await prismaClient.service.create({
      data: {
        name: service.name,
        description: service.description,
        assignments: {
          connect: service.assignments.map((id) => ({ id: id }))
        }
      }
      
    });

    return excludeFields(createService, ['createdAt', 'updatedAt'])
  }
  async update(id: string, data: UpdateServiceDTO) {
    try {
      const serviceToUpdate = await prismaClient.service.findUniqueOrThrow({ where: { id }, include: { assignments: true } });  

      const service = new Service(
        serviceToUpdate.name,
        serviceToUpdate.description as string,
        serviceToUpdate.assignments.map((assignment) => assignment.id), 
        serviceToUpdate.status as GenericStatus
      );

      if (data.name !== undefined) service.name = data.name;
      if (data.description !== undefined) service.description = data.description;
      if (data.status !== undefined) service.status = data.status;
      if (data.assignments !== undefined) service.assignments = data.assignments;

      service.validate();

      const needsToUpdateAssignments = JSON.stringify(serviceToUpdate.assignments) !== JSON.stringify(service.assignments);

      if(needsToUpdateAssignments) {
        await prismaClient.service.update({
          where: { id },
          data: {
            assignments: {
              disconnect: serviceToUpdate.assignments.map((assignment) => ({ id: assignment.id }))
            }
          }
        })
      }

      if (service.name !== serviceToUpdate.name) {
        const existingService = await prismaClient.service.findUnique({
          where: { name: service.name }
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
          assignments: needsToUpdateAssignments ? {
            connect: service.assignments.map((assignmentId) => ({ id: assignmentId })) 
          }: undefined
        },
        include: {
          assignments: true
        }
      });

      return excludeFields(updatedService, ['createdAt', 'updatedAt']);
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