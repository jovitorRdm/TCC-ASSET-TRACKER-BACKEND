import { parseArrayOfData } from "../../helpers/utils";
import { excludeFields } from "../../helpers/utils/excludeFields";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { FindAllArgs, FindAllReturn, IRepository } from "../../interfaces";
import { EventType } from "../domains/EventType";
import { GenericStatus } from "../dtos";
import { CreateEventDTO, UpdateEventDTO } from "../dtos/events";

export class EventRepository implements IRepository {
  async create({ name, description }: CreateEventDTO) {
    const existingEvent = await prismaClient.eventType.findUnique({
      where: { name }
    }); // valida se o evento já existe

    if (existingEvent) {
      throw new AppError(ErrorMessages.MSGE02);
    } // caso exista o evento, retorna um erro

    const event = new EventType(name, description); // cria um novo objeto de tipo EventType

    event.validate(); // valida o objeto

    const createEvent = await prismaClient.eventType.create({
      data: {
        name: event.name,
        description: event.description,
      }
    }); // cria o evento no banco

    return excludeFields(createEvent, ['createdAt', 'updatedAt']);
    // retorna os dados do evento que foi criado no banco de dados 
  }
  async update(id: string, data: UpdateEventDTO) {
    try {
      const eventToUpdate = await prismaClient.eventType.findUniqueOrThrow({ where: { id } });

      const event = new EventType(
        eventToUpdate.name,
        eventToUpdate.description,
        eventToUpdate.id,
        eventToUpdate.status as GenericStatus
      );

      if (data.name !== undefined) event.name = data.name;
      if (data.description !== undefined) event.description = data.description;
      if (data.status !== undefined) event.status = data.status;

      event.validate();

      if (event.name !== eventToUpdate.name) {
        const existingEvent = await prismaClient.eventType.findUnique({
          where: { name: event.name }
        });

        if (existingEvent) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      const updatedEvent = await prismaClient.eventType.update({
        where: { id },
        data: {
          name: event.name,
          description: event.description,
          status: event.status,
        }
      });

      return excludeFields(updatedEvent, ['createdAt', 'updatedAt']);
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

    const totalItems = await prismaClient.eventType.count({ where });

    const data = await prismaClient.eventType.findMany({
      where,
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