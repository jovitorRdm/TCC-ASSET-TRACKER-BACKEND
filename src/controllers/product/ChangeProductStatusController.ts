import { Request, Response } from "express";
import { ProductService } from "../../services/ProductService";


export class ChangeProductStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const productService = new ProductService();

        const product = await productService.changeStatus(id, status);

        return res.json(product);
    }
 
}