import { Request, Response } from 'express'
import { FiscalProductDTO } from '../../models/dtos/fiscalProduct';
import { FiscalProductService } from '../../services/fiscalProductService';



export class UpdateFiscalProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body as FiscalProductDTO;

        const fiscalProductService = new FiscalProductService();

        const product = await fiscalProductService.update(id, data);

        return res.json(product);
    }
}