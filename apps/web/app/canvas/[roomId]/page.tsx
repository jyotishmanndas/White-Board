"use client";

import { Draw } from "@/components/draw";
import { useEffect, useRef } from "react"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            Draw(canvasRef.current)
        }
    }, [canvasRef]);

    return (
        <div>
            <canvas width={1080} height={800} ref={canvasRef}></canvas>
        </div>
    )
}