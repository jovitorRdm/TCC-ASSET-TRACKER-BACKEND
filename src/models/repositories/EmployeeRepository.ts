import bcrypt from 'bcrypt';
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { FindAllArgs, IRepository } from "../../interfaces/IRepository";
import { prismaClient } from "../../infra/prisma";
import { generatePassword, excludeFields } from "../../helpers/utils";
import { firstAccessEmailTemplate, newPasswordEmailTemplate, MailProvider } from '../../providers/mail';
import { CreatedEmployeeDTO, GenericStatus, UpdateEmployeeDTO } from '../dtos';
import { Employee, Address } from '../domains';


export class EmployeeRepository implements IRepository{
    async create({
        document,
        name,
        address: addressData,
        birthdate,
        phoneNumber,
        email,
        assignmentId, 
      }: CreatedEmployeeDTO) {
        const existingPerson = await prismaClient.person.findFirst({
          where: { OR: [{ document }, { email }] },
        });
    
        if (existingPerson) {
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
          assignmentId,
          document,
          name,
          birthdate,
          phoneNumber,
          email,
          generatePassword(),
          address.toJSON(),
        )

        const hashPassword = await bcrypt.hash(
          employee.password,
          8
        );

        const passwordMatch = await bcrypt.compare(
          employee.password, hashPassword
        )

        if (!passwordMatch){
          throw new AppError(ErrorMessages.MSGE13);
        }

        const createdEmployee = await prismaClient.employee.create({
          data: {
            person: {
              create: {
                name,
                document,
                birthdate,
                phoneNumber,
                email,
                password: hashPassword,
                address: {
                  create: address.toJSON(),
                },
              },
            },
            assignment: {
              connect: {
                id: assignmentId,
              },
            },
          },
          include: {
            person: {
              include: {
                address: true,
              },
            },
            assignment: true,
          },
        });

        
          const mailProvider = new MailProvider();
    
          await mailProvider.sendMail(
            employee.email,
            'Novos dados de acesso ao Asset Tracker',
            firstAccessEmailTemplate(
              employee.name,
              employee.email,
              employee.password
            )
          );
        

        const dataToReturn = {
          ...excludeFields(
          {
            ...createdEmployee.person, 
            id: createdEmployee.id, 
            assignment: createdEmployee.assignment
          },
          [
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
          person: {
            include: {
              address: true,
            }
          }
        },
      });

      if (!employeeToUpdate) {
        throw new AppError(ErrorMessages.MSGE05, 404);
      }

      const address = new Address(
        employeeToUpdate.person.address.street,
        employeeToUpdate.person.address.number,
        employeeToUpdate.person.address.neighborhood,
        employeeToUpdate.person.address.city,
        employeeToUpdate.person.address.state,
        employeeToUpdate.person.address.cep,
        employeeToUpdate.person.address.id
      );

      if(data.address){
        address.setAll(data.address);
        address.validate();
      }

      const employee = new Employee(
        employeeToUpdate.assignmentId,
        employeeToUpdate.person.document,
        employeeToUpdate.person.name,
        employeeToUpdate.person.birthdate.toISOString(),
        employeeToUpdate.person.phoneNumber,
        employeeToUpdate.person.email,
        employeeToUpdate.person.password,
        address.toJSON(),
        employeeToUpdate.person.status as GenericStatus,
        employeeToUpdate.id
      );

      if (data.document !== undefined) employee.document = data.document;
      if (data.name !== undefined) employee.name = data.name;
      if (data.birthdate !== undefined) employee.birthdate = data.birthdate;
      if (data.phoneNumber !== undefined) employee.phoneNumber = data.phoneNumber;
      if (data.email !== undefined) employee.email = data.email;
      if (data.assignmentId !== undefined) employee.assignmentId = data.assignmentId;
      if (data.status !== undefined) employee.status = data.status;

      employee.validate();

      if (employee.document !== employeeToUpdate.person.document) {
        const existingEmployee = await prismaClient.person.findFirst({
          where: { document: employee.document },
        });
  
        if (existingEmployee) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }
  
      if (employee.email !== employeeToUpdate.person.email) {
        const existingEmployee = await prismaClient.person.findFirst({
          where: { email: employee.email },
        });
  
        if (existingEmployee) {
          throw new AppError(ErrorMessages.MSGE02);
        }
      }
      
      const updatedEmployee = await prismaClient.employee.update({
        where: { id },
        data: {
          person: {
            update: {
              status: employee.status,
              name: employee.name,
              document: employee.document,
              birthdate: employee.birthdate,
              phoneNumber: employee.phoneNumber,
              email: employee.email,
              password: employee.password,
            }
          },
          assignment: employee.assignmentId !== employeeToUpdate.assignmentId ? {
            connect:{
              id:employee.assignmentId
            }
          }:undefined,  
        },
        include: {
          person: {
            include: {
              address: true,
            }
          },
          assignment:true,
        },
      });    
      
      if (data.password) {
        const mailProvider = new MailProvider();
  
        await mailProvider.sendMail(
          employee.email,
          'Novos dados de acesso ao Asset Tracker',
          newPasswordEmailTemplate(
            employee.name,
            employee.email,
            employee.password
          )
        );
      }

    const dataToReturn = {
      ...excludeFields({...updatedEmployee.person, id: updatedEmployee.id, assignment: updatedEmployee.assignment}, [
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
              person: {
                name: {
                contains: args?.searchTerm,
                }
              },
            },
            {
              person: {
              document: {
                contains: args?.searchTerm,
              },
            },
            },
            {
              person: {
              email: {
                contains: args?.searchTerm,
              },
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
        person: {
          include: {
            address: true,
          }
        },
        assignment: true,
      },
    });

    const dataToUse = data.map(
      (employee) => ({
      ...excludeFields(
        {
          ...employee.person, 
          id: employee.id, 
          assignment: employee.assignment
        },
         [
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
        include: {
          assignment: true,
        }
      });

      return { ...employee};
    } catch {
      throw new AppError(ErrorMessages.MSGE02);
    }
  }
}