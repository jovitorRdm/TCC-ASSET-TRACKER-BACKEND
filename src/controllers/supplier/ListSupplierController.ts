import { Request, Response } from "express";
import { PaginatedResponse } from "../../helpers/utils";
import { SupplierDTO } from "../../models/dtos/supplier";
import { SupplierService } from "../../services/SupplierService";

export class ListSupplierController {
    async handle(req: Request, res: Response){
        const paginatedResponse = new PaginatedResponse<SupplierDTO>(
            new SupplierService()
        );

        const response = await paginatedResponse.get(req);
        return res.json(response);
    }
}