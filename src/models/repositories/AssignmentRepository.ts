import { parseArrayOfData, excludeFields } from "../../helpers/utils";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { FindAllArgs, IRepository } from "../../interfaces";
import {
  AccountType,
  CreateAssignmentDTO,
  PaymentMethod,
  UpdateAssignmentDTO,
} from "../dtos";
import { Assignment } from "../domains";

export class AssignmentRepository implements IRepository {
  async create({
    name,
    description,
    paymentMethod,
    paymentValue,
    peopleServed,
    accountRequirement,
    accountType,
  }: CreateAssignmentDTO) {
    const existingAssignment = await prismaClient.assignment.findFirst({
      where: {
        name,
      },
    });

    if (existingAssignment) {
      throw new AppError(ErrorMessages.MSGE02);
    }

    const assignment = new Assignment(
      name,
      description,
      paymentMethod,
      paymentValue,
      accountRequirement,
      peopleServed,
      accountType
    );

    assignment.validate();

    const createAssignmentData: any = {
      name: assignment.name,
      description: assignment.description,
      paymentMethod: assignment.paymentMethod,
      paymentValue: assignment.paymentValue,
      accountRequirement: assignment?.accountRequirement,
      accountType: assignment.accountType,
      peopleServed: assignment.peopleServed,
    };

    const createAssignment = await prismaClient.assignment.create({
      data: createAssignmentData,
    });

    return excludeFields(createAssignment, ["createdAt", "updatedAt"]);
  }

  async update(id: string, data: UpdateAssignmentDTO) {
    try {
      const assignmentToUpdate =
        await prismaClient.assignment.findUniqueOrThrow({ where: { id } });

      const assignment = new Assignment(
        assignmentToUpdate.name,
        assignmentToUpdate.description,
        assignmentToUpdate.paymentMethod as PaymentMethod,
        assignmentToUpdate.paymentValue,
        assignmentToUpdate.accountRequirement,
        assignmentToUpdate.peopleServed,
        assignmentToUpdate.accountType === null
          ? undefined
          : (assignmentToUpdate?.accountType as AccountType)
      );

      if (data.name !== undefined) assignment.name = data.name;
      if (data.description !== undefined)
        assignment.description = data.description;
      if (data.status !== undefined) assignment.status = data.status;
      if (data.paymentMethod !== undefined)
        assignment.paymentMethod = data.paymentMethod;
      if (data.paymentValue !== undefined)
        assignment.paymentValue = data.paymentValue;
      if (data.accountRequirement !== undefined)
        assignment.accountRequirement = data.accountRequirement;
      if (data.accountType !== undefined)
        assignment.accountType = data.accountType;
      if (data.peopleServed !== undefined)
        assignment.peopleServed = data.peopleServed;

      assignment.validate();

      if (assignment.name !== assignmentToUpdate.name) {
        const existingAssignment = await prismaClient.assignment.findUnique({
          where: { name: assignment.name },
        });

        if (existingAssignment) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      const updatedAssignmentData: any = {
        name: assignment.name,
        description: assignment.description,
        status: assignment.status,
        paymentMethod: assignment.paymentMethod,
        paymentValue: assignment.paymentValue,
        accountRequirement: assignment.accountRequirement,
        accountType: assignment?.accountType,
        peopleServed: assignment.peopleServed,
      };

      const updatedAssignment = await prismaClient.assignment.update({
        where: { id },
        data: updatedAssignmentData,
      });

      return excludeFields(updatedAssignment, ["createdAt", "updatedAt"]);
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

    const totalItems = await prismaClient.assignment.count({ where });

    const data = await prismaClient.assignment.findMany({
      where,
      orderBy: { createdAt: "asc" },
      skip: args?.skip,
      take: args?.take,
    });

    return {
      data: parseArrayOfData(
        data.map((assignment) => ({
          ...assignment,
          accountType:
            assignment.accountType === null
              ? undefined && assignment.accountType == null
              : assignment.accountType,
        })),
        ["createdAt", "updatedAt"]
      ),
      totalItems,
    };
  }

  async checkAssociatedEmployees(assignmentId: string) {
    const count = await prismaClient.employee.count({
      where: {
        assignmentId: assignmentId,
      },
    });

    const count2 = await prismaClient.service.count({
      where: {
        assignmentId: {
          equals: assignmentId,
        },
      },
    });

    return count > 0 || count2 > 0;
  }
}
