import { Address } from "../domains";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { parseArrayOfData, excludeFields } from "../../helpers/utils";
import { FindAllArgs, IRepository } from "../../interfaces";
import {
  CreateEventSalonsDTO,
  UpdateEventSalonsDTO,
} from "../dtos/eventSalons";
import { EventSalons } from "../domains/EventSalons";

export class EventSalonsRepository implements IRepository {
  async create({
    name,
    description,
    address: addressData,
    capacity,
    value,
  }: CreateEventSalonsDTO) {
    const existingEvent = await prismaClient.eventSalons.findUnique({
      where: { id: name },
    });

    if (existingEvent) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const event = new EventSalons(
      name,
      value,
      capacity,
      description,
      addressData
    );

    event.validate();

    const address = new Address(
      addressData.street,
      addressData.number,
      addressData.neighborhood,
      addressData.city,
      addressData.state,
      addressData.cep
    );
    const createEventSalons = await prismaClient.eventSalons.create({
      data: {
        name: event.name,
        description: event.description,
        value: event.value,
        capacity: event.capacity,
        address: {
          create: address.toJSON(),
        },
      },
      include: {
        address: true,
      },
    });

    return excludeFields(createEventSalons, ["createdAt", "updatedAt"]);
  }
  async update(id: string, data: UpdateEventSalonsDTO) {
    try {
      const eventSalonsToUpdate =
        await prismaClient.eventSalons.findUniqueOrThrow({
          where: { id },
        });

      const address = new Address(
        data.address.street,
        data.address.number,
        data.address.neighborhood,
        data.address.city,
        data.address.state,
        data.address.cep,
        data.address.id
      );

      const eventSalons = new EventSalons(
        eventSalonsToUpdate.name,
        eventSalonsToUpdate.value,
        eventSalonsToUpdate.capacity,
        eventSalonsToUpdate.description,
        address
      );

      if (data.name !== undefined) eventSalons.name = data.name;
      if (data.description !== undefined)
        eventSalons.description = data.description;
      if (data.status !== undefined) eventSalons.status = data.status;

      if (data.address) {
        address.setAll(data.address);
        address.validate();
      }

      eventSalons.validate();

      if (eventSalons.name !== eventSalonsToUpdate.name) {
        const existingEvent = await prismaClient.eventSalons.findUnique({
          where: { id: eventSalons.id },
        });

        if (existingEvent) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      const updatedEvent = await prismaClient.eventSalons.update({
        where: { id },
        data: {
          name: eventSalons.name,
          description: eventSalons.description,
          status: eventSalons.status,
          address: {
            update: address.toJSON(),
          },
          capacity: eventSalons.capacity,
          value: eventSalons.value,
        },
        include: {
          address: true,
        },
      });

      return excludeFields(updatedEvent, ["createdAt", "updatedAt"]);
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

    const totalItems = await prismaClient.eventSalons.count({ where });

    const data = await prismaClient.eventSalons.findMany({
      where,
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
