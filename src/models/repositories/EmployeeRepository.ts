import bcrypt from 'bcrypt';
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { FindAllArgs, IRepository } from "../../interfaces/IRepository";
import { Address } from "../domains/Address";
import { CreateEmployeeDTO, GenericStatus, UpdateEmployeeDTO } from "../dtos";
import { prismaClient } from "../../infra/prisma";
import { Employee } from "../domains/Employee";
import { generatePassword } from "../../helpers/utils/generatePassword";
import { excludeFields } from '../../helpers/utils/excludeFields';
import { Assignment } from '../domains';



export class EmployeeRepository implements IRepository{
    async create({
        address: addressData,
        birthdate,
        cpf,
        email,
        name,
        phoneNumber,
        assignmentId
      }: CreateEmployeeDTO) {
        const existingEmployee = await prismaClient.employee.findFirst({
          where: { OR: [{ cpf }, { email }] },
        });
    
        if (existingEmployee) {
          throw new AppError(ErrorMessages.MSGE02);
        }
    
        const address = new Address(
          addressData.street,
          addressData.number,
          addressData.neighborhood,
          addressData.city,
          addressData.state,
          addressData.cep
        );
        
        address.validate();

        const employee = new Employee(
          name, 
          cpf, 
          birthdate,
          phoneNumber,
          email,
          generatePassword(),
          address.toJSON(),
          assignmentId,
        )

        const hashPassword = await bcrypt.hash(
          employee.password,
          8
        );

        const createdEmployee = await prismaClient.employee.create({
          data: {
            name: employee.name,
            cpf: employee.cpf,
            birthdate: employee.birthdate,
            phoneNumber: employee.phoneNumber,
            email: employee.email,
            password: hashPassword,
            assignment: {
              connect: {
                id: assignmentId,
              },
            },
            address: {
              create: {
                street: employee.address.street,
                number: employee.address.number,
                neighborhood: employee.address.neighborhood,
                city: employee.address.city,
                state: employee.address.state,
                cep: employee.address.cep,
              },
            },
          },
          include: {
            address: true,
            assignment:true,
          },
        });

        const dataToReturn = {
          ...excludeFields(createdEmployee, [
            'createdAt',
            'updatedAt',
            'password',
            'addressid',
          ]),
      }
      return dataToReturn;
    }

    async update(id: string, data: UpdateEmployeeDTO){
      const employeeToUpdate = await prismaClient.employee.findUnique({
        where: { id },
        include: {
          address: true,
        },
      });

      if (!employeeToUpdate) {
        throw new AppError(ErrorMessages.MSGE05, 404);
      }

      const address = new Address(
        employeeToUpdate.address.street,
        employeeToUpdate.address.number,
        employeeToUpdate.address.neighborhood,
        employeeToUpdate.address.city,
        employeeToUpdate.address.state,
        employeeToUpdate.address.cep,
        employeeToUpdate.address.id
      );

      if(data.address){
        address.setAll(data.address);
        address.validate();
      }

      const employee = new Employee(
        employeeToUpdate.name,
        employeeToUpdate.cpf,
        employeeToUpdate.birthdate.toISOString(),
        employeeToUpdate.phoneNumber,
        employeeToUpdate.email,
        employeeToUpdate.password,
        address.toJSON(),
        employeeToUpdate.assignmentId,
        employeeToUpdate.status as GenericStatus,
        employeeToUpdate.id
      );

      if (data.name !== undefined) employee.name = data.name;
      if (data.cpf !== undefined) employee.cpf = data.cpf;
      if (data.birthdate !== undefined) employee.birthdate = data.birthdate;
      if (data.phoneNumber !== undefined) employee.phoneNumber = data.phoneNumber;
      if (data.email !== undefined) employee.email = data.email;
      if (data.status !== undefined) employee.status = data.status;
      if (data.assignmentId !== undefined) employee.assignmentId = data.assignmentId;

      employee.validate();

      if (employee.cpf !== employeeToUpdate.cpf) {
        const existingEmployee = await prismaClient.employee.findFirst({
          where: { cpf: employee.cpf },
        });
  
        if (existingEmployee) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }
  
      if (employee.email !== employeeToUpdate.email) {
        const existingEmployee = await prismaClient.employee.findFirst({
          where: { email: employee.email },
        });
  
        if (existingEmployee) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }

      
      
      const updatedEmployee = await prismaClient.employee.update({
        where: { id },
        data: {
          status: employee.status,
          name: employee.name,
          cpf: employee.cpf,
          birthdate: employee.birthdate,
          phoneNumber: employee.phoneNumber,
          email: employee.email,
          password: employee.password,
          assignment: employee.assignmentId !== employeeToUpdate.assignmentId ? {
            connect:{
              id:employee.assignmentId
            }
          }:undefined,
          address: {
            update: {
              ...address.toJSON(),
            },
          },  
        },
        include: {
          address: true,
          assignment:true,
        },
      });      

    const dataToReturn = {
      ...excludeFields(updatedEmployee, [
        'createdAt',
        'updatedAt',
        'password',
        'addressid',
      ]),
    }  
    return dataToReturn;
  }

  async findAll(args?: FindAllArgs) {
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
              cpf: {
                contains: args?.searchTerm,
              },
            },
            {
              email: {
                contains: args?.searchTerm,
              },
            },
          ]
        : undefined,
      status: {
        equals: args?.filterByStatus,
      },
    };

    const totalItems = await prismaClient.employee.count({
      where,
    });
      const data = await prismaClient.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: args?.skip,
      take: args?.take,
      include: {
        address: true,
        assignment: true,
      },
    });

    const dataToUse = data.map((employee) => ({
      ...excludeFields(employee, [
        'createdAt',
        'updatedAt',
        'password',
        'addressid',
      ]),
    }));

    return {
      data: dataToUse,
      totalItems,
    };
  }

  async findById(id: string) {
    try {
      const employee = await prismaClient.employee.findUniqueOrThrow({
        where: { id },
      });

      return { ...employee};
    } catch {
      throw new AppError(ErrorMessages.MSGE02);
    }
  }
     
}