import { NextFunction, Request, Response } from "express";
import { AccountType } from "../../../models/dtos";
import { AppError, ErrorMessages } from "../errors";


export async function ensureEventAdministrator(
    req: Request,
    res: Response,
    next: NextFunction,
){
    const { accountType } = req.user;

    if(!accountType.includes(AccountType.EVENTADMINISTRATOR)){
        throw new AppError(ErrorMessages.MSGE14, 401);
    }

    next();
}