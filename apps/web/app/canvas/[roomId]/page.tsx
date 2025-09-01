"use client";

import { Draw } from "@/components/draw";
import { useEffect, useRef, useState } from "react"

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
            <div className="absolute flex justify-center h-12 mt-5 rounded-md border w-72 border-white">

            </div>
            <canvas width={dimensions.width} height={dimensions.height} ref={canvasRef}></canvas>
        </div>
    )
}