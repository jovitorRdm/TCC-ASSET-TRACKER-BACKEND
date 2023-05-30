import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { FindAllArgs, FindAllReturn, IRepository } from "../../interfaces/IRepository";
import { Address } from "../domains/Address";
import { AddressDTO, AssignmentDTO, CreateEmployeeDTO, GenericStatus, UpdateAssignmentDTO, UpdateEmployeeDTO } from "../dtos";
import { prismaClient } from "../../infra/prisma";
import { Employee } from "../domains/Employee";
import { generatePassword } from "../../helpers/utils/generatePassword";
import { Assignment } from "../domains";
import { excludeFields } from '../../helpers/utils/excludeFields';



export class EmployeeRepository {
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
                id: employee.assignmentId,
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
        throw new AppError(ErrorMessages.MSGE02, 404);
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
        address.setAll(data.address as AddressDTO);
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
      if (data.password !== undefined) employee.password = data.password;
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

      let hashPassword: string = '';

      if (employee.password !== employeeToUpdate.password) {
        hashPassword = await bcrypt.hash(employee.password, 8);
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
          password: hashPassword,
          address: {
            update: {
              ...address.toJSON(),
            },
          },
        },
        include: {
          address: true,
        },
      })      

    const dataToReturn = {
      ...excludeFields(updatedEmployee, [
        'createdAt',
        'updatedAt',
        'password',
        'addressid',
      ]),
      address: excludeFields(updatedEmployee.address, [
        'createdAt',
        'updatedAt',
      ]),
    }  
    return dataToReturn;
  }
     
}