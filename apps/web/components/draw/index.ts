type Shape = { type: "Rectangle" | "Circle" | "Line" | "Triangle" | "Arrow" | "Rhombus" | "Pencil" | "Eraser" | "Text", x: number, y: number, width: number, height: number, points?: { x: number; y: number }[] }
export function Draw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    let existingShapes: Shape[] = [];
    if (!ctx) return;

    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        // const currentX = e.clientX - canvas.getBoundingClientRect().left;
        // const currentY = e.clientY - canvas.getBoundingClientRect().top;
        // const width = currentX - startX;
        // const height = currentY - startY;
        existingShapes.push({ type: "Rectangle", x: startX, y: startY, width, height });
    })
    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        // startX = e.clientX - canvas.getBoundingClientRect().left;
        // startY = e.clientY - canvas.getBoundingClientRect().top;
    })
    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            // const currentX = e.clientX - canvas.getBoundingClientRect().left;
            // const currentY = e.clientY - canvas.getBoundingClientRect().top;
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            // ctx.clearRect(0, 0, canvas.width, canvas.height);
            // ctx.fillRect(startX, startY, width, height);
            // ctx.fillStyle = "rgba(0, 0, 0)";
            renderShapes(existingShapes, ctx, canvas)
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(startX, startY, width, height);
        }
    });
};

function renderShapes(existingShapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShapes.forEach(shape => {
        switch (shape.type) {
            case "Rectangle":
                //    ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
                ctx.strokeStyle = "rgba(255, 255, 255)"
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
                break;
            // Handle other shapes...
        }
    });
}
