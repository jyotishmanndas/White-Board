"use client";

import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { signUpSchema } from "@workspace/zod-validator/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@workspace/ui/components/form";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeClosed, EyeOff, Loader } from "lucide-react";
import { toast } from "sonner";

export function SignUpForm() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:3001/signup", values);
            const token = res.data.token;
            if (token) {
                localStorage.setItem("token", token);
                form.reset();
                toast.success("Account created successfully!");
                router.push("/dashboard")
            };
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status == 400) {
                toast("Email already Registered", {
                    description: "This email is already in use. Please try signing in or using a different email."
                });
                form.reset();
            } else {
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
                <CardTitle className="text-2xl">Create a new account</CardTitle>
                <CardDescription>
                    Enter your details below to create a new account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="jhon doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                                                <button type="button" className="absolute right-2 " onClick={() => setShowPassword((prev) => !prev)}>
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
                            Sign Up
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/signin" className="underline underline-offset-4">
                            Sign in
                        </Link>
                    </div>
                </Form>
            </CardContent>
        </Card>
    )
}