import { Request, Response } from 'express';
import { UpdateCustomerDTO } from '../../models/dtos';
import { CustomerService } from '../../services';

export class UpdateCustomerController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;
    const data = req.body as UpdateCustomerDTO;

    const customerService = new CustomerService();

    const customer = await customerService.update(id, data);

    return res.json(customer);
  }
}
