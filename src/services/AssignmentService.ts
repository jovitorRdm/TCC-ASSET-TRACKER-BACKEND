import { FindAllArgs, IService } from "../interfaces";
import { GenericStatus } from "../models/dtos";
import { CreateAssignmentDTO, UpdateAssignmentDTO} from "../models/dtos/assignment";
import { AssignmentRepository } from "../models/repositories/AssignmentRepository";

export class AssignmentService implements IService {
    private assignmentRepository = new AssignmentRepository();

    async create(data: CreateAssignmentDTO) {
        const assignment = await this.assignmentRepository.create(data);

        return assignment;
    }

    async update(id: string, data: UpdateAssignmentDTO) {
        const updatedAssignment = await this.assignmentRepository.update(id, data);

        return updatedAssignment;
    }

    async changeStatus(id: string, status: GenericStatus) {
        const updatedAssignment = await this.assignmentRepository.update(id, { status });

        return updatedAssignment;
    }

    async list(args: FindAllArgs = {}) {
        const result = await this.assignmentRepository.findAll(args);

        return result;
    }

}