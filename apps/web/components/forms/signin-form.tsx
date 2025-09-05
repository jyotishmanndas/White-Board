"use client";

import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { signInschema } from "@workspace/zod-validator/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";

export function SignInForm() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const form = useForm<z.infer<typeof signInschema>>({
        mode: "all",
        resolver: zodResolver(signInschema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    async function onSubmit(values: z.infer<typeof signInschema>) {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:3001/signin", values);
            const token = res.data.token;
            if (token) {
                localStorage.setItem("token", token);
                form.reset();
                toast.success("Sign in successful")
                router.push("/dashboard")
            }
        } catch (error) {
            console.error("Error during sign in:", error);
            if (axios.isAxiosError(error) && error.response?.status == 404) {
                toast("User does not exist with this email", {
                    description: "Please check the email you entered or sign up for a new account."
                });
                form.reset();
            } else if (axios.isAxiosError(error) && error.response?.status == 401) {
                toast("Invalid Password", {
                    description: "The password you entered is incorrect. Please try again."
                });
                form.reset();
            }
            else {
                toast("Uh oh! Something went wrong.", {
                    description: "There was a problem with your request.",
                });
                form.reset();
            }
        } finally {
            setLoading(false);
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">Login to your account</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="jhondoe@example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative flex items-center">
                                                <Input type={showPassword ? "text" : "password"} placeholder="******" {...field} />
                                                <button type="button" className="absolute right-2" onClick={() => setShowPassword((prev) => !prev)}>
                                                    <span>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</span>
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button className="w-full cursor-pointer" type="submit">
                            {loading && (
                                <Loader className="w-4 h-4 animate-spin" />
                            )}
                            Sign In
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline underline-offset-4">
                            Sign up
                        </Link>
                    </div>
                </Form>
            </CardContent>
        </Card>
    )
}