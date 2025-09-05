"use client";

import { CreateRoom } from "@/components/forms/createRoom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Dashboard() {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/signup");
        }
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-accent p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-1">
                        Create a Room
                    </CardTitle>
                    <CardDescription>Make a Room by just clicking a Button.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateRoom />
                </CardContent>
            </Card>
        </div>
    )
}