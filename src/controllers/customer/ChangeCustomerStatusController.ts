import { Request, Response } from "express";
import { CustomerService } from "../../services";

export class ChangeCustomerStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const customerService = new CustomerService();

        const customer = await customerService.changeStatus(id, status);

        return res.json(customer);
    }
}