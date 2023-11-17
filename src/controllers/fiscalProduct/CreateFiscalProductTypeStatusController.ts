import { Request, Response } from "express";
import { CreateFiscalProductDTO } from "../../models/dtos/fiscalProduct";
import { FiscalProductService } from "../../services/fiscalProductService";


export class CreateFiscalProductController {

    async handle(req: Request, res: Response) {
        const data = req.body as CreateFiscalProductDTO;
        const fiscalProductService = new FiscalProductService();
        const product = await fiscalProductService.create(data);
        return res.status(201).json(product);
    }   
}