import { Request, Response } from "express";
import { CustomerService } from "../../services";
import { CreateCustomerDTO } from "../../models/dtos";

export class CreateCustomerController {
    async handle(req: Request, res: Response) {

        const data = req.body as CreateCustomerDTO;
        const customerService = new CustomerService();
        const assignment = await customerService.create(data);
        return res.status(201).json(assignment);
    }
}