import jwt from "jsonwebtoken";
import { prisma } from "@workspace/db/prisma";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { signInschema, signUpSchema } from "@workspace/zod-validator/zod";
import { JWT_SECRET } from "@workspace/backend-common/config";

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
        return res.status(200).json({ msg: "User created successfully", token })
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ msg: "Internal server error" });
    };
};

export const userSignIn = async (req: Request, res: Response) => {
    try {
        const result = signInschema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Invalid input" });
        };

        const existingUser = await prisma.user.findUnique({
            where: { email: result.data.email }
        });
        if (!existingUser) {
            return res.status(404).json({ msg: "User does not exist with this email" });
        };

        const isPasswordValid = await bcrypt.compare(result.data.password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid password" });
        };

        const userId = existingUser.id;

        const token = jwt.sign({ userId }, JWT_SECRET);
        return res.status(200).json({ msg: "Sign in successful", token });
    } catch (error) {
        console.error("Error signing in user:", error);
        return res.status(500).json({ msg: "Internal server error" });
    };
}