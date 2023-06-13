import { Request, Response } from "express";
import { CreateServiceDTO } from "../../models/dtos";
import { ServiceItemService } from "../../services/ServiceItemService";


export class CreateServicesController {
    async handle(req: Request, res: Response) {
        const data = req.body as CreateServiceDTO;
        const serviceItem = new ServiceItemService();
        const service = await serviceItem.create(data);
        return res.status(201).json(service);
    }
}