import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";

export default function Dashboard() {
    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <Card className="w-full max-w-md" >
                <CardHeader>
                    <CardTitle>Jyoti</CardTitle>
                    <CardDescription>Rita Das Subodh Das</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    <Label>Room Name</Label>
                    <Input className="w-full" />
                </CardContent>
            </Card>
        </div>
    )
}