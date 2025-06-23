import { WebSocket, WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@workspace/backend-common/config"

const wss = new WebSocketServer({ port: 8080 });

interface User {
    userId: string;
    ws: WebSocket;
    rooms: string[]
};

const users: User[] = [];

function checkUser(token: string): string | null {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
        return null;
    };
    return decoded.userId;
}

wss.on('connection', function connection(ws, request) {

    const url = request.url;
    if (!url) {
        return;
    };

    const params = new URLSearchParams(url.split("?")[1]);
    const token = params.get("token");
    const userId = checkUser(token || "");

    if (!userId) {
        ws.close();
        return;
    };

    users.push({
        userId,
        ws,
        rooms: []
    });

    ws.on('message', function message(data) {

        const message = JSON.parse(data.toString());

        if (message.type === "join_room") {
            const roomId = message.roomId;

            // Check if the user is already in the room
            const user = users.find(user => user.userId === userId);
            if (user && !user.rooms.includes(roomId)) {
                user.rooms.push(roomId);
                ws.send(JSON.stringify({ type: "joined_room", roomId }));
            } else {
                ws.send(JSON.stringify({ type: "error", message: "Already in this room" }));
            }
        };

        if (message.type === "leave_room") {
            const roomId = message.roomId;

            // Check if the user is in the room
            const user = users.find(user => user.userId === userId);
            if (user && user.rooms.includes(roomId)) {
                user.rooms = user.rooms.filter(room => room !== roomId);
                ws.send(JSON.stringify({ type: "left_room", roomId }));
            } else {
                ws.send(JSON.stringify({ type: "error", message: "Not in this room" }));
            }
        };

        if (message.type === "send_message") {
            const roomId = message.roomId;
            const text = message.text;

            // Broadcast the message to all users in the room
            users.forEach(user => {
                if (user.rooms.includes(roomId)) {
                    user.ws.send(JSON.stringify({ type: "message", roomId, text }));
                }
            });
        };
    });
    ws.send('Hello');
});