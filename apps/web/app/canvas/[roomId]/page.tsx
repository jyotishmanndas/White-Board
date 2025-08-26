"use client";

import { useEffect, useRef } from "react"

export default function Canvas() {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {

        if (canvasRef.current) {
            const canvass = canvasRef.current;
            const ctx = canvass.getContext("2d");

            if (!ctx) return;

            ctx.strokeRect(25, 0, 100, 100);
            // ctx.fillStyle = 
            ctx.strokeStyle = "rgba(255, 255, 255)"

            // canvass.addEventListener("mouseup", (e) => {
            //     console.log(e.clientX);
            //     console.log(e.clientY);
            // })
        }

    }, [canvasRef])

    return (
        <div>
            <canvas className="border border-black" ref={canvasRef}></canvas>
        </div>
    )
}