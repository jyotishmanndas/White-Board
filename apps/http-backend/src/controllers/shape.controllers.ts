import { prisma } from "@workspace/db/prisma";
import { Request, Response } from "express";

export const createShape = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });
        if (!user) {
            return res.status(404).json({ msg: "user not found" })
        };

        const room = await prisma.room.findUnique({
            where: { slug: req.body.roomId }
        });
        if (!room) {
            return res.status(404).json({ msg: "Room not found" })
        };

        const newShape = await prisma.shape.create({
            data: {
                type: req.body.type,
                x: req.body.x,
                y: req.body.y,
                width: req.body.width,
                height: req.body.height,
                roomId: room.id,
                userId: user.id,
                pencilPoints: req.body.pencilPoints
            }
        });
        return res.status(200).json({ msg: "Shape created successfully", newShape })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "internal server error", error })
    }
};