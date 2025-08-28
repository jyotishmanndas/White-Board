import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "@workspace/backend-common/config";
import jwt from "jsonwebtoken";

// Extend Express Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
};

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization || "";
    if (!token) {
        return res.status(400).json({ msg: "No token provided" })
    };

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
    } catch (error) {
        return res.status(401).json({ msg: "Permission denied" })
    }
}