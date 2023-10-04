import { Request, Response } from "express";
import { SupplierService } from "../../services/SupplierService";

export class ChangeSupplierStatusController {
    async handle(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body; 
        const supplierService = new SupplierService();
        const supplier = await supplierService.changeStatus(id, status);
        return res.json(supplier);
    }
}