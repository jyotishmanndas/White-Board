"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { createRoomSchema } from "@workspace/zod-validator/zod";
import axios from "axios";
import { Copy, CopyCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function CreateRoom() {
    const [action, setAction] = useState<"create" | "join">("join");
    const [showRoomId, setShowRoomId] = useState("");
    const [toogle, setToogle] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof createRoomSchema>>({
        resolver: zodResolver(createRoomSchema),
        defaultValues: {
            slug: ""
        },
    });

    const randomRoomId = () => {
        const values = "QWERTYUIOPASDFGHJKLZXCVBNM1234567890";
        let roomid = "";

        for (let i = 0; i < 6; i++) {
            const x = Math.floor(Math.random() * values.length);
            roomid += values[x]
        }
        setShowRoomId(roomid)
    };

    const copyRoomId = async () => {
        setToogle(true);
        await navigator.clipboard.writeText(showRoomId);
        toast.success("Room Id copied")

        setTimeout(() => {
            setToogle(false)
        }, 2000)
    }

    async function onSubmit(values: z.infer<typeof createRoomSchema>) {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("You must be logged in");
            return;
        };

        try {
            const url = action === "create" ? "http://localhost:3001/room/create" : "http://localhost:3001/room/joinroom";
            const res = await axios.post(url, values, { headers: { Authorization: token } });

            if (res.status === 200) {
                form.reset();
                const serverMessage = res.data.msg;
                toast.success(serverMessage);
                // toast.success(action === "create" ? "Room created successfully" : "Room joined successfully");
                router.push(`/canvas/${res.data.room.slug}`)
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const serverMessage = error.response?.data?.msg;
                switch (status) {
                    case 404:
                        toast.error(serverMessage || "Room not found");
                        break;
                    case 409:
                        toast.error(serverMessage || "Room already exists");
                        break;
                    case 400:
                        toast.error(serverMessage || "Invalid room data");
                        break;
                    case 403:
                        toast.error(serverMessage || "Access denied");
                        break;
                    default:
                        toast.error(serverMessage || "Something went wrong. Please try again");
                }
            } else {
                toast.error("Network error. Please check your connection.");
            }
        };
    };
    return (
        <div className="flex flex-col justify-center items-center min-h-[30vh]">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full max-w-md bg-white dark:bg-neutral-900 p-6 rounded-2xl shadow-md space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm font-medium">Room ID</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text" placeholder="e.g. RJN285" className="w-full"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-3">
                        <Button
                            type="submit" className="flex-1 cursor-pointer"
                            onClick={() => setAction("create")}
                        >
                            Create Room
                        </Button>
                        <Button type="submit" variant="outline" className="flex-1 cursor-pointer"
                            onClick={() => setAction("join")}
                        >
                            Join Room
                        </Button>
                    </div>

                    <div className="pt-4 border-t">
                        <Button type="button" className="w-full cursor-pointer"
                            onClick={randomRoomId}
                        >
                            Start a Fresh Room
                        </Button>
                    </div>
                </form>
            </Form>

            {showRoomId && (
                <div className="flex flex-col items-center justify-center mt-5 bg-accent py-3 px-5 rounded-lg">
                    <p className="text-center">Share this code with your friend</p>
                    <div className="flex items-center justify-center gap-5">
                        <span className="font-bold text-2xl">{showRoomId}</span>
                        <button className="cursor-pointer" onClick={copyRoomId}>
                            {toogle ? (
                                <CopyCheck className="w-5 h-5" />
                            ) : (
                                <Copy className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}