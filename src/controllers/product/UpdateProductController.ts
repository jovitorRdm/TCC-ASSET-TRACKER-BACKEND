import { Request, Response } from 'express'
import { ProductDTO } from '../../models/dtos';
import { ProductService } from '../../services';



export class UpdateProductController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const data = req.body as ProductDTO;

        const productService = new ProductService();

        const product = await productService.update(id, data);

        return res.json(product);
    }
}