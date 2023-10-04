import { Request, Response } from "express";
import { UpdateSupplierDTO } from "../../models/dtos/supplier";
import { SupplierService } from "../../services/SupplierService";


export class UpdateSupplierController {
    async handle(req: Request, res: Response){
        const { id } = req.params;
        const data = req.body as UpdateSupplierDTO;
        const supplierService = new SupplierService();
        const supplier = await supplierService.update(id, data);
        return res.json(supplier);
    }
}