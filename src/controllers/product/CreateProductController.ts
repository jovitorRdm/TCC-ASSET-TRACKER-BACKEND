import { Request, Response } from "express";
import { CreateProductDTO } from "../../models/dtos";
import { ProductService } from "../../services/ProductService";


export class CreateProductController {

    async handle(req: Request, res: Response) {
        const data = req.body as CreateProductDTO;
        const productService = new ProductService();
        const product = await productService.create(data);
        return res.status(201).json(product);
    }   
}