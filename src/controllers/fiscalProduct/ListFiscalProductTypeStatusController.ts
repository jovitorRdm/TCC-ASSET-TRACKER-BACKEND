import { Request, Response } from "express";
import { PaginatedResponse } from "../../helpers/utils";
import { FiscalProductDTO } from "../../models/dtos/fiscalProduct";
import { FiscalProductService } from "../../services/fiscalProductService";


export class ListFiscalProductController {
    async handle(req: Request, res: Response) {
        const paginatedResponse = new PaginatedResponse<FiscalProductDTO>(
            new FiscalProductService()
        );

        const response = await paginatedResponse.get(req);
        return res.json(response);
    }
}