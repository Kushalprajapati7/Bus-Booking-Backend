import { NextFunction, Request, Response } from "express";
import userService from "../service/userService";

class UserController {
    addUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const newUser = await userService.addUser(req.body);
            res.status(201).json(newUser)
        } catch (error) {
            next(error)
        }
    }
    getAllUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const allUser = await userService.allUser()
            if (!allUser) {
                res.status(404).json({ error: "Users Not Found!" });
                return
            }
            res.status(200).json(allUser)
        } catch (error) {
            next(error)
        }
    }
    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            await userService.deleteUser(userId)
            res.status(200).json({message:"User Deleted"})
        } catch (error) {
            next(error)
        }
    }
    getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            const user = await userService.userById(userId)
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }
    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            const userData = req.body;
            const updatedUser = await userService.updateUser(userId, userData)
            res.json(updatedUser)
        } catch (error) {
            next(error)
        }
    }
}

export default new UserController();