import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware.js";
import { JWT_SECRET } from "@workspace/backend-common/config";
import { prisma } from "@workspace/db/prisma"
import { createRoomSchema, signInschema, signUpSchema } from "@workspace/zod-validator/zod";
import bcrypt from "bcryptjs";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", async (req: Request, res: Response) => {

    const result = signUpSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            msg: "Invalid input"
        })
    };

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: result.data?.email
            }
        });

        if (existingUser) {
            res.status(400).json({
                msg: "User already exists with this email"
            });
        };

        const hashedpassword = await bcrypt.hash(result.data?.password || "", 12)

        const user = await prisma.user.create({
            data: {
                email: result.data?.email || "",
                password: hashedpassword,
                name: result.data?.name || "",
                emailVerified: new Date()
            }
        });

        const userId = user.id;

        const token = jwt.sign({ userId }, JWT_SECRET)
        res.json({
            token
        })

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            msg: "Internal server error"
        });
    };
});

app.post("/signin", async (req, res) => {

    const result = signInschema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            msg: "Invalid input"
        });
    };

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: result.data?.email
            }
        });

        const userId = existingUser?.id;

        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(result.data?.password || "", existingUser.password);

            if (!isPasswordValid) {
                res.status(400).json({
                    msg: "Invalid password"
                });
            } else {
                const token = jwt.sign({ userId }, JWT_SECRET);
                res.json({
                    token
                });
            };
        }
        else {
            res.status(400).json({
                msg: "User does not exist with this email"
            });
        }
    } catch (error) {
        console.error("Error signing in user:", error);
        res.status(500).json({
            msg: "Internal server error"
        });
    };
});

app.post("/room", authMiddleware, async (req: Request, res: Response) => {

    const user = await prisma.user.findUnique({
        where: { id: req.userId }
    });
    if (!user) {
        res.status(404).json({ msg: "User not found" });
        return;
    };

    const result = createRoomSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({ msg: "Invalid input" })
    };

    const room = await prisma.room.findFirst({
        where: {
            slug: result.data?.slug
        }
    });

    if (room) {
        res.status(400).json({ msg: "Room already exists with this slug" })
    };

    try {
        const newRoom = await prisma.room.create({
            data: {
                slug: result.data?.slug || "",
                userId: user.id
            }
        });
        res.status(200).json({ msg: "Room created successfully", newRoom })

    } catch (error) {
        console.error("Error creating room:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
})

app.listen(3000, () => {
    console.log('Server is listening on the port 3000');
}) 