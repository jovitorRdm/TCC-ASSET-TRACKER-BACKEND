import { excludeFields } from "../../helpers/utils";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { prismaClient } from "../../infra/prisma";
import { Account } from "../domains/Account";
import {CreateAccountDTO} from "../dtos";

export class AccountRepository {

    async create({ email, password }:CreateAccountDTO ) {
        const AccountEvent = await prismaClient.account.findFirst({
            where: {
              email
            }
          })

          if (AccountEvent) {
            throw new AppError(ErrorMessages.alreadyExists);
            
        }

        const account = new Account(email, password);

        account.validate();

        const createAccountData: any = {
            email: account.email,
            password: account.password, 
        };

        const createAccount = await prismaClient.account.create({
            data: createAccountData,
        })

        return excludeFields(createAccount, ['createdAt', 'updatedAt'])
    }


   

}