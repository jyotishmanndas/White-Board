"use client";

import { useEffect, useRef } from "react"

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasRef.current) {
            const canvass = canvasRef.current;
            const ctx = canvass.getContext("2d");

            if (!ctx) return;

            let clicked = false;
            let startX = 0;
            let startY = 0;

            canvass.addEventListener("mouseup", (e) => {
                clicked = false;
                startX = e.clientX;
                startY = e.clientY;
            })
            canvass.addEventListener("mousedown", (e) => {
                clicked = true;
                startX = e.clientX;
                startY = e.clientY;
            })
            canvass.addEventListener("mousemove", (e) => {
                if (clicked) {
                    const width = e.clientX - startX;
                    const height = e.clientY - startY;
                    ctx.clearRect(0, 0, canvass.width, canvass.height);
                    ctx.strokeRect(startX, startY, width, height);
                }
            })
        }
    }, [canvasRef])

    return (
        <div>
            <canvas width={1024} height={1024} className="border border-black" ref={canvasRef}></canvas>
        </div>
    )
}