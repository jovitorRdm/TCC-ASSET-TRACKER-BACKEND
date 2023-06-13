import { Request, Response } from "express";
import { AppError, ErrorMessages } from "../../infra/http/errors";
import { ServiceItemService } from "../../services/ServiceItemService";

export class ChangeServiceStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const ServiceItem = new ServiceItemService();

        if (status === undefined) {
            throw new AppError(ErrorMessages.MSGE06);
        }

        const service = await ServiceItem.changeStatus(id, status);

        return res.json(service);
    }
}