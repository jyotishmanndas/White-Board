import { prisma } from "@workspace/db/prisma";
import { createRoomSchema } from "@workspace/zod-validator/zod";
import { Request, Response } from "express";

export const createRoom = async (req: Request, res: Response) => {
    try {
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

        const room = await prisma.room.findUnique({
            where: { slug: result.data.slug }
        });

        if (room) {
            return res.status(400).json({ msg: "Room already exists with this slug" })
        };
        const newRoom = await prisma.room.create({
            data: {
                slug: result.data.slug,
                userId: user.id,
                members: {
                    create: [
                        { userId: user.id }
                    ]
                }
            }
        });
        return res.status(200).json({
            msg: "Room created successfully", newRoom: {
                id: newRoom.id,
                slug: newRoom.slug,
                createdAt: newRoom.createdAt
            }
        })
    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};

export const joinRoom = async (req: Request, res: Response) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.userId }
        });
        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        };

        const result = createRoomSchema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ msg: "Invalid room data" })
        };

        const room = await prisma.room.findUnique({
            where: {
                slug: result.data.slug
            },
            include: { members: true }
        });
        if (!room) {
            return res.status(400).json({ msg: "Room not found" })
        };

        const isAlreadyMember = room.members.find(member => member.userId === user.id);

        if (!isAlreadyMember) {
            await prisma.roomMember.create({
                data: {
                    roomId: room.id,
                    userId: user.id
                }
            })
        }
        return res.status(200).json({
            msg: "Joined room successfully", room: {
                id: room.id,
                slug: room.slug
            }
        })
    } catch (error) {
        return res.status(500).json({ msg: "Interal server error" })
    }
}