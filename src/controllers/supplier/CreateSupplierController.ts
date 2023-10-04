import { Request, Response } from "express";
import { CreatedSupplierDTO } from "../../models/dtos/supplier";
import { SupplierService } from "../../services/SupplierService";


export class CreateSupplierController {

    async handle(req: Request, res: Response){

        const data = req.body as CreatedSupplierDTO;
        const supplierService = new SupplierService();
        const supplier = await supplierService.create(data);
        return res.status(201).json(supplier);
    }
}