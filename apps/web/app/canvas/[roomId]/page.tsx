"use client";

import { Draw } from "@/components/draw";
import { Circle, Diamond, Minus, MoveRight, Pencil, Slash, Square, Triangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils";
import { useWebsocket } from "@/hooks/websocket";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [chooseShapes, setChooseShapes] = useState("");
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const { socket, connected } = useWebsocket();
    const params = useParams();
    const roomId = params.roomId as string;

    useEffect(() => {
        if (!socket || !connected) return;

        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: "join_room", roomCode: roomId }));
            toast.success("Websocket connected successfully ")
        }
    }, [socket, connected])

    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
        if (canvasRef.current) {
            Draw(canvasRef.current, chooseShapes)
        }
    }, [canvasRef, chooseShapes]);

    return (
        <div className="flex justify-center relative">
            <div className="absolute flex justify-center items-center gap-3 h-12 mt-5 rounded-md w-96 bg-[#232329]">
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("square")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "square" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Square className="w-5 h-5 text-white" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Square
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("circle")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "circle" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Circle className="w-5 h-5" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Circle
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("triangle")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "triangle" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Triangle className="w-5 h-5 text-white" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Triangle
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("arrow")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "arrow" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <MoveRight className="w-5 h-5" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        arrow
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("rhomus")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "rhomus" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Diamond className="w-5 h-5 text-white" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Rhomus
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("line")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "line" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Minus className="w-5 h-5" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        line
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild onClick={() => setChooseShapes("pencil")}>
                        <div className={cn(
                            "p-2 rounded-md flex items-center justify-center",
                            chooseShapes == "pencil" ? "bg-[#403E6A]" : "hover:bg-[#4a486296]"
                        )}>
                            <Pencil className="w-5 h-5" />
                        </div>

                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Pencil
                    </TooltipContent>
                </Tooltip>
            </div>
            <canvas width={dimensions.width} height={dimensions.height} ref={canvasRef}></canvas>
        </div>
    )
}