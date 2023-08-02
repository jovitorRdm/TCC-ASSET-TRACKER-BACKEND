import { compare } from "bcrypt";
import { AppError, ErrorMessages } from "../infra/http/errors";
import { prismaClient } from "../infra/prisma";
import { sign } from "jsonwebtoken";

interface IRequest{
    email: string, 
    password: string,
}

export class AuthenticationEmployeeService {

    async execute({email, password}: IRequest){
        
        const user = await prismaClient.employee.findFirst({
            where: {
                email,
            },
            include: {
                assignment: {
                    select: {
                        accountType: true,
                    }
                }
            }
        })

        if(!user){
            throw new AppError(ErrorMessages.MSGE13);
        }

        const passwordMatch = await compare(password, user.password);

        if(!passwordMatch){
            throw new AppError(ErrorMessages.MSGE13);
        }

        const token = sign(
            {
                accountType: user.assignment.accountType,
            },
            `${process.env.JWT_SECRET}`,
            {subject: user.id, expiresIn: "30d"});

            return {
                token
            };
    }
}

export default AuthenticationEmployeeService;