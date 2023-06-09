import { PaginatedResponse } from "../../helpers/utils/PaginatedResponse";
import { Request, Response } from 'express'
import { CustomerService } from '../../services';
import { CustomerDTO } from "../../models/dtos";

export class ListCustomerController {
    async handle(req: Request, res: Response) {
        const paginatedResponse = new PaginatedResponse<CustomerDTO>(
            new CustomerService()
        );

        const response = await paginatedResponse.get(req);
        return res.json(response);
    }
}