import { Request, Response } from 'express'
import { ServiceDTO } from '../../models/dtos';
import { ServiceItemService } from '../../services/ServiceItemService';



export class UpdateServicesController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body as ServiceDTO;

        const ServiceItem = new ServiceItemService();

        const service = await ServiceItem.update(id, data);

        return res.json(service);
    }
}