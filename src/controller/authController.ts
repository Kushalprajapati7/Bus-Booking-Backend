import { IUser } from "../interface/IUser";
import { NextFunction, Request, Response } from "express";
import authService from "../service/authService";


class AuthController {

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: IUser = req.body;
            const newUser = await authService.register(userData);
            res.status(201).json(newUser);
        } catch (error) {
            next(error)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            const logUser = await authService.login(email, password);
            res.status(201).json(logUser);
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController();