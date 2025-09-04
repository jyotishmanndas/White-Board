import rough from 'roughjs';
import { RoughCanvas } from 'roughjs/bin/canvas';
import { Drawable } from 'roughjs/bin/core';

type ShapeType = "Rectangle" | "Circle" | "Line" | "Triangle" | "Arrow" | "Rhombus" | "Pencil" | "Eraser" | "Text";
// type PencilShape = { type: "Pencil"; points: { x: number; y: number }[] };
type Shape = {
    type: ShapeType;
    drawable?: Drawable;
    points?: { x: number; y: number }[];
};
export function Draw(canvas: HTMLCanvasElement, chooseShapes: string) {
    const ctx = canvas.getContext("2d");
    const rc = rough.canvas(canvas)
    let existingShapes: Shape[] = [];
    if (!ctx) return;

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const currentX = e.clientX - canvas.getBoundingClientRect().left;
        const currentY = e.clientY - canvas.getBoundingClientRect().top;
        const width = currentX - startX;
        const height = currentY - startY;
        // existingShapes.push({ type: "Rectangle", x: startX, y: startY, width, height, shape });
        if (chooseShapes === "square") {
            const shape = rc.generator.rectangle(startX, startY, width, height, { stroke: "white" });
            existingShapes.push({ type: "Rectangle", drawable: shape })
        } else if (chooseShapes === "circle") {
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            const diameter = Math.max(Math.abs(width), Math.abs(height));
            ctx.beginPath();
            const shape = rc.generator.circle(centerX, centerY, diameter, { stroke: "white" });
            existingShapes.push({ type: "Circle", drawable: shape })
        } else if (chooseShapes === "line") {
            ctx.beginPath();
            const shape = rc.generator.line(startX, startY, currentX, currentY, { stroke: "white" });
            existingShapes.push({ type: "Line", drawable: shape })
        } else if (chooseShapes === "arrow") {
            ctx.beginPath();
            let headlen = 10;
            let dx = currentX - startX;
            let dy = currentY - startY;
            let angle = Math.atan2(dy, dx);

            // line
            ctx.moveTo(startX, startY)
            ctx.lineTo(currentX, currentY);

            ctx.lineTo(currentX - headlen * Math.cos(angle - Math.PI / 6), currentY - headlen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(currentX, currentY);
            ctx.lineTo(currentX - headlen * Math.cos(angle + Math.PI / 6), currentY - headlen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
            // existingShapes.push({type: "Arrow", drawable: ctx})
        } else if (chooseShapes === "triangle") {
            ctx.beginPath();
            ctx.moveTo(startX + width / 2, startY);
            ctx.lineTo(startX, startY + height);
            ctx.lineTo(startX + width, startY + height);
            ctx.closePath();
            ctx.stroke();
        }
    });
    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        // startX = e.clientX;
        // startY = e.clientY;
        startX = e.clientX - canvas.getBoundingClientRect().left;
        startY = e.clientY - canvas.getBoundingClientRect().top;

        if (chooseShapes === "pencil") {
            existingShapes.push({
                type: "Pencil",
                points: [{ x: startX, y: startY }]
            });
        }
    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const currentX = e.clientX - canvas.getBoundingClientRect().left;
            const currentY = e.clientY - canvas.getBoundingClientRect().top;
            const width = currentX - startX;
            const height = currentY - startY;
            renderShapes(existingShapes, ctx, canvas, rc)
            if (chooseShapes === "square") {
                const preview = rc.generator.rectangle(startX, startY, width, height, { stroke: "white" });
                rc.draw(preview);
            } else if (chooseShapes === "circle") {
                const centerX = startX + width / 2;
                const centerY = startY + height / 2;
                const diameter = Math.max(Math.abs(width), Math.abs(height));
                const preview = rc.generator.circle(centerX, centerY, diameter, { stroke: "white" });
                rc.draw(preview);
            } else if (chooseShapes === "line") {
                const preview = rc.generator.line(startX, startY, currentX, currentY, { stroke: "white" });
                rc.draw(preview);
            } else if (chooseShapes === "pencil") {
                const pencilShape = existingShapes[existingShapes.length - 1];
                if (pencilShape && pencilShape.type === "Pencil" && pencilShape.points) {
                    pencilShape.points.push({ x: currentX, y: currentY });
                }
            } else if (chooseShapes === "arrow") {
                ctx.beginPath();
                let headlen = 10;
                let dx = currentX - startX;
                let dy = currentY - startY;
                let angle = Math.atan2(dy, dx);

                // line
                ctx.moveTo(startX, startY)
                ctx.lineTo(currentX, currentY);

                ctx.lineTo(currentX - headlen * Math.cos(angle - Math.PI / 6), currentY - headlen * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(currentX, currentY);
                ctx.lineTo(currentX - headlen * Math.cos(angle + Math.PI / 6), currentY - headlen * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
            } else if (chooseShapes === "triangle") {
                ctx.beginPath();
                ctx.moveTo(startX + width / 2, startY);
                ctx.lineTo(startX, startY + height);
                ctx.lineTo(startX + width, startY + height);
                ctx.closePath();
                ctx.stroke();
            }
        }
    });
};

function renderShapes(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, rc: RoughCanvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // existingShapes.forEach(shape => {
    //     // switch (shape.type) {
    //     //     case "Rectangle":
    //     //         //    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    //     //         // ctx.strokeStyle = "rgba(255, 255, 255)"
    //     //         // ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    //     //         rc.rectangle(shape.x, shape.y, shape.width, shape.height, { stroke: "white" })
    //     //         break;
    //     //     // Handle other shapes...
    //     // }
    //     rc.draw(shape.drawable);
    // });

    existingShapes.forEach(shape => {
        if (shape.type === "Pencil" && shape.points) {
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;

            for (let i = 1; i < shape.points.length; i++) {
                let p1 = shape.points[i - 1];
                let p2 = shape.points[i];
                if (p1 && p2) {
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                }
            }

            ctx.stroke();
        } else {
            // normal rough.js shapes
            if (shape.drawable) rc.draw(shape.drawable);
        }
    });
}
