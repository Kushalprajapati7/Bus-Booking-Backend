import { NextFunction, Request, Response } from "express";
import { JwtUtills } from "../utils/jwtUtiils";
import CustomRequest from "../types/customRequest";

class AuthMiddleware {
    verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.header('Authorization')?.split(' ')[1];
        if (!token) {
            res.status(404).json({ error: "Token Not Found!" });
            return;
        }
        try {
            const decoded = JwtUtills.verifyToken(token) as { userId: string, role: string };
            (req as CustomRequest).userId = decoded.userId;
            (req as CustomRequest).role = decoded.role;

            next();
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthMiddleware();
