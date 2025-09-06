import axios from "axios";
import { toast } from "sonner";

type ShapeType = { type: "Rectangle" | "Circle" | "Line" | "Triangle" | "Arrow" | "Rhombus" | "Pencil" | "Eraser" | "Text", x: number, y: number, width: number, height: number, points?: { x: number; y: number }[] };

export function Draw(canvas: HTMLCanvasElement, chooseShapes: string, socket: WebSocket | null, roomId: string) {
    const ctx = canvas.getContext("2d");
    let existingShapes: ShapeType[] = [];
    if (!ctx) return;

    let clicked = false;
    let startX = 0;
    let startY = 0;

    // if (!socket) {
    //     toast.error("disconnect")
    //     return
    // };

    // if (socket.readyState === WebSocket.OPEN) {
    //     socket.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         existingShapes.push({
    //             type: data.shape,
    //             x: data.x,
    //             y: data.y,
    //             width: data.width,
    //             height: data.height
    //         });
    //         renderShapes(existingShapes, ctx, canvas);
    //     }
    // }

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX - canvas.getBoundingClientRect().left;
        startY = e.clientY - canvas.getBoundingClientRect().top;

        if (chooseShapes === "pencil") {
            existingShapes.push({
                type: "Pencil",
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                points: [{ x: startX, y: startY }]
            });
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const currentX = e.clientX - canvas.getBoundingClientRect().left;
            const currentY = e.clientY - canvas.getBoundingClientRect().top;
            const width = currentX - startX;
            const height = currentY - startY;

            renderShapes(existingShapes, ctx, canvas);

            switch (chooseShapes) {
                case "square": {
                    ctx.strokeRect(startX, startY, width, height);
                }
                    break;

                case "circle": {
                    const x = Math.min(startX, currentX);
                    const y = Math.min(startY, currentY);
                    const width = Math.abs(currentX - startX);
                    const height = Math.abs(currentY - startY);

                    const centerX = x + width / 2;
                    const centerY = y + height / 2;

                    ctx.beginPath();
                    ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
                    ctx.stroke();
                }
                    break;

                case "line": {
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(currentX, currentY);
                    ctx.stroke()
                }
                    break;

                case "pencil": {
                    const pencilShape = existingShapes[existingShapes.length - 1];
                    if (pencilShape && pencilShape.type === "Pencil" && pencilShape.points) {
                        pencilShape.points.push({ x: currentX, y: currentY });
                    }
                }
                    break;

                case "arrow": {
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
                }
                    break;

                case "triangle": {
                    ctx.beginPath();
                    ctx.moveTo(startX + width / 2, startY);
                    ctx.lineTo(startX, startY + height);
                    ctx.lineTo(startX + width, startY + height);
                    ctx.closePath();
                    ctx.stroke();
                }
                    break;
                default:
                    break;
            }
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const currentX = e.clientX - canvas.getBoundingClientRect().left;
        const currentY = e.clientY - canvas.getBoundingClientRect().top;
        const width = currentX - startX;
        const height = currentY - startY;
        if (chooseShapes === "square") {
            existingShapes.push({ type: "Rectangle", x: startX, y: startY, width, height });
            // if (socket?.readyState === WebSocket.OPEN) {
            //     socket.send(JSON.stringify({ type: "send_message", shape: "square", x: startX, y: startY, height: height, width: width, roomCode: roomId }));
            // }
        } else if (chooseShapes === "circle") {
            const x = Math.min(startX, currentX);
            const y = Math.min(startY, currentY);
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);

            const centerX = x + width / 2;
            const centerY = y + height / 2;

            existingShapes.push({ type: "Circle", x: centerX, y: centerY, width, height })
        } else if (chooseShapes === "line") {
            existingShapes.push({ type: "Line", x: startX, y: startY, width, height })
        } else if (chooseShapes === "arrow") {
            existingShapes.push({ type: "Arrow", x: startX, y: startY, width, height })
        } else if (chooseShapes === "triangle") {
            ctx.beginPath();
            ctx.moveTo(startX + width / 2, startY);
            ctx.lineTo(startX, startY + height);
            ctx.lineTo(startX + width, startY + height);
            existingShapes.push({ type: "Triangle", x: startX, y: startY, width, height })
        }
    });
};

function renderShapes(existingShapes: ShapeType[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShapes.map(shape => {
        switch (shape.type) {
            case "Rectangle":
                ctx.strokeStyle = "rgba(255, 255, 255)"
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                break;
            case "Circle":
                ctx.strokeStyle = "rgba(255, 255, 255)"
                ctx.beginPath();
                ctx.ellipse(shape.x, shape.y, Math.abs(shape.width / 2), Math.abs(shape.height / 2), 0, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case "Line":
                ctx.strokeStyle = "rgba(255, 255, 255)"
                ctx.beginPath();
                ctx.moveTo(shape.x, shape.y);
                ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
                ctx.stroke();
                break;
            case "Arrow":
                ctx.strokeStyle = "rgba(255, 255, 255)"
                ctx.beginPath();
                let headlen = 10;
                let dx = shape.width;
                let dy = shape.height;
                let angle = Math.atan2(dy, dx);
                ctx.moveTo(shape.x, shape.y)
                ctx.lineTo(shape.x + shape.width, shape.y + shape.height);

                ctx.lineTo(shape.x + shape.width - headlen * Math.cos(angle - Math.PI / 6), shape.y + shape.height - headlen * Math.sin(angle - Math.PI / 6));
                ctx.moveTo(shape.x + shape.width, shape.y + shape.height);
                ctx.lineTo(shape.x + shape.width - headlen * Math.cos(angle + Math.PI / 6), shape.y + shape.height - headlen * Math.sin(angle + Math.PI / 6));
                ctx.stroke();
                break;
            case "Triangle":
                ctx.strokeStyle = "rgba(255, 255, 255)"
                ctx.beginPath();
                ctx.moveTo(shape.x + shape.width / 2, shape.y);
                ctx.lineTo(shape.x, shape.y + shape.height);
                ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
                ctx.closePath();
                ctx.stroke();
                break;
            case "Pencil":
                if (shape.points && shape.points.length > 1) {
                    ctx.strokeStyle = "rgba(255, 255, 255)";
                    ctx.beginPath();
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
                }
                break;
            default:
                break;
        }
    });
}
