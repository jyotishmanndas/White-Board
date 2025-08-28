import { JWT_SECRET } from "@workspace/backend-common/config";
import jwt from "jsonwebtoken";
import { prisma } from "@workspace/db/prisma";
import { signInschema, signUpSchema } from "@workspace/zod-validator/zod";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

export const userSignup = async (req: Request, res: Response) => {
    const result = signUpSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ msg: "Invalid input" })
    };
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: result.data.email }
        });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists with this email" });
        };

        const hashedpassword = await bcrypt.hash(result.data.password, 12)
        const user = await prisma.user.create({
            data: {
                email: result.data.email,
                password: hashedpassword,
                name: result.data.name,
                emailVerified: new Date()
            }
        });

        const userId = user.id;
        const token = jwt.sign({ userId }, JWT_SECRET);
        return res.json({ token })
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ msg: "Internal server error" });
    };
};

export const userSignIn = async (req: Request, res: Response) => {
    const result = signInschema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ msg: "Invalid input" });
    };

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: result.data.email }
        });

        const userId = existingUser.id;

        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(result.data.password, existingUser.password);

            if (!isPasswordValid) {
                res.status(400).json({ msg: "Invalid password" });
            } else {
                const token = jwt.sign({ userId }, JWT_SECRET);
                res.json({ token });
            };
        }
        else {
            res.status(400).json({ msg: "User does not exist with this email" });
        }
    } catch (error) {
        console.error("Error signing in user:", error);
        res.status(500).json({ msg: "Internal server error" });
    };
}