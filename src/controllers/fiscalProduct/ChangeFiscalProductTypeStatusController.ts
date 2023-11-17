import { Request, Response } from "express";
import { FiscalProductService } from "../../services/fiscalProductService";


export class ChangeFiscalProductStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const fiscalProductService = new FiscalProductService();

        const fiscalProductType = await fiscalProductService.changeStatus(id, status);

        return res.json(fiscalProductType);
    }
 
}