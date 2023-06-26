import { Request, Response } from "express";
import { PaginatedResponse } from "../../helpers/utils";
import { ProductDTO } from "../../models/dtos";
import { ProductService } from "../../services";


export class ListProductController {
    async handle(req: Request, res: Response) {
        const paginatedResponse = new PaginatedResponse<ProductDTO>(
            new ProductService()
        );

        const response = await paginatedResponse.get(req);
        return res.json(response);
    }
}