"use client";

import { Draw } from "@/components/draw";
import { Circle, Diamond, Minus, MoveRight, Pencil, Slash, Square, Triangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils";
import { useWebsocket } from "@/hooks/websocket";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chooseShapes, setChooseShapes] = useState("");
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const { socket, connected } = useWebsocket();
    const params = useParams();
    const roomId = params.roomId as string;
    const router = useRouter();

    useEffect(() => {
        if (!socket || !connected) return;

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "join_room", roomCode: roomId }));
            // toast.success("Websocket connected")
        }
    }, [socket, connected])

    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
        if (canvasRef.current) {
            Draw(canvasRef.current, chooseShapes, socket, roomId)
        };
    }, [canvasRef, chooseShapes]);

    return (
        <div className="flex justify-center relative">
            <div className="absolute flex justify-center items-center gap-3 h-12 mt-5 rounded-md w-96 bg-[#232329]">
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("Square")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "Square" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Square className="w-5 h-5 text-white" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Square
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("Circle")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "Circle" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Circle className="w-5 h-5" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Circle
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("Triangle")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "Triangle" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Triangle className="w-5 h-5 text-white" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Triangle
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("Arrow")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "Arrow" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <MoveRight className="w-5 h-5" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        arrow
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("Rhomus")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "Rhomus" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Diamond className="w-5 h-5 text-white" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Rhomus
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("Line")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "Line" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Minus className="w-5 h-5" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Line
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("Pencil")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "Pencil" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Pencil className="w-5 h-5" />
                        </div>

                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Pencil
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="absolute top-50 left-10">
                <Button className="cursor-pointer" onClick={() => {
                    const canvas = canvasRef.current;
                    if (!canvas) return;

                    const ctx = canvas.getContext("2d");
                    if (!ctx) return;

                    localStorage.removeItem("shapes");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    ctx.fillStyle = "black";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }}> Clear canva</Button>
            </div>
            <canvas className="cursor-crosshair" width={dimensions.width} height={dimensions.height} ref={canvasRef}></canvas>
        </div>
    )
}