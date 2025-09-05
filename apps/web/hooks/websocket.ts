import { useEffect, useState } from "react";

export function useWebsocket() {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [connected, setIsConnected] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            return
        };

        const socketUrl = new WebSocket(`ws://localhost:8080?token=${token}`);

        socketUrl.onopen = () => {
            setSocket(socketUrl);
            setIsConnected(true);
            console.log("Websocket connected successfully");
        };

        socketUrl.onclose = () => {
            setSocket(null)
            setIsConnected(false);
            console.log("Websocket disconnected");
        };

        socketUrl.onerror = (error) => {
            setIsConnected(false);
            socketUrl.close();
            console.log("Websocket error", error);
        }

        return () => {
            socketUrl.close();
            console.log("Cleaning up WebSocket connection");
        }
    }, []);

    return {
        socket,
        connected
    }
};