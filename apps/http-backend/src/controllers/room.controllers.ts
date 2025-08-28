import { prisma } from "@workspace/db/prisma";
import { createRoomSchema } from "@workspace/zod-validator/zod";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
        where: { id: req.userId }
    });
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    };

    const result = createRoomSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ msg: "Invalid room data" })
    };

    const room = await prisma.room.findFirst({
        where: { slug: result.data.slug }
    });

    if (room) {
       return res.status(400).json({ msg: "Room already exists with this slug" })
    };

    try {
        const newRoom = await prisma.room.create({
            data: {
                slug: result.data.slug,
                userId: user.id
            }
        });
       return res.status(200).json({ msg: "Room created successfully", newRoom })
    } catch (error) {
        console.error("Error creating room:", error);
       return res.status(500).json({ msg: "Internal server error" });
    }
};