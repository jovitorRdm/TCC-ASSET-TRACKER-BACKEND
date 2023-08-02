import { Request, Response } from "express";
import AuthenticationEmployeeService from "../../services/AuthenticationService";


class AuthenticateEmployeeController {
    async handle(request: Request, response: Response)   {
        

        const { email, password } = request.body;

        const authenticateEmployee = new AuthenticationEmployeeService();

        const token = await authenticateEmployee.execute({
            email,
            password
        })

        return response.json(token);
    }
}

export {AuthenticateEmployeeController};