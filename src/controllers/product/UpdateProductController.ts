import { Request, Response } from "express";
import { UpdateProductDTO } from "../../models/dtos";
import { ProductService } from "../../services";



export class UpdateProductController {

    async handle(req: Request, res: Response) {
        const  {id } = req.params;
        const data = req.body as UpdateProductDTO;
        const productService = new ProductService();
        const product = await productService.update(id, data);

        return res.json(product);
    }
}