"use client";

import { FormEvent } from "react";
import { register } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export default function SignUpForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    try {
      await register(email, password);
      router.push("/auth/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="bg-gray-700 min-h-1/3 w-1/3 flex justify-around text-gray-200">
      {/* header */}
      <CardHeader>
        <CardTitle>Sign Up !</CardTitle>
        <CardDescription>Who are you ? Welcome my stranger</CardDescription>
      </CardHeader>
      <Separator />
      {/* content */}
      <CardContent className="flex flex-col">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* email field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Sign Up</Button>
          </form>
        </Form>
      </CardContent>
      <Separator />
      {/* footer */}
      <CardFooter className="flex justify-between">
        <Link href="/auth/signin" className="underline text-blue-300">
          Already signed up? Sign in now
        </Link>
      </CardFooter>
    </Card>
  );
}
