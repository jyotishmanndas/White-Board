"use client";

import { Draw } from "@/components/draw";
import { Circle, MoveRight, Pencil, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight })
        if (canvasRef.current) {
            Draw(canvasRef.current)
        }
    }, [canvasRef]);

    return (
        <div className="flex justify-center relative">
            <div className="absolute flex justify-center items-center gap-6 h-12 mt-5 rounded-md w-72 bg-[#232329]">
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild>
                        <Square className="w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Square
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild>
                        <Circle className="w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Circle
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild>
                        <Pencil className="w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        Pencil
                    </TooltipContent>
                </Tooltip>
                <Tooltip delayDuration={30}>
                    <TooltipTrigger asChild>
                        <MoveRight className="w-5 h-5" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        arrow
                    </TooltipContent>
                </Tooltip>
            </div>
            <canvas width={dimensions.width} height={dimensions.height} ref={canvasRef}></canvas>
        </div>
    )
}