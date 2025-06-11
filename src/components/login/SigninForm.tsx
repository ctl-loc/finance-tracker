"use client";

import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, TriangleAlert } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export default function SignInForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result && result.status === 401) {
      setError("Invalid credentials");
    } else if (result && result.status === 500) {
      setError("Internal server error");
    } else if (result && result.ok && result.url) {
      window.location.href = result.url;
    }

    setLoading(false);
  };

  return (
    <Card>
      {/* header */}
      <CardHeader>
        <CardTitle>Sign In !</CardTitle>
        <CardDescription>Welcome back motherfucker</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col">
        {/* information popups */}
        {error && (
          <div className="bg-red-600 text-white p-2 m-2 rounded-xl flex items-center text-xl pl-5 gap-2">
            <TriangleAlert /> {error}
          </div>
        )}
        {loading && (
          <div className="bg-yellow-500 text-white p-2 m-2 rounded-xl flex items-center text-xl pl-5 gap-2">
            <Clock /> Loading...
          </div>
        )}
        {/* form */}
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
            <Button type="submit">Sign In</Button>
          </form>
        </Form>
      </CardContent>
      <Separator />
      {/* footer */}
      <CardFooter className="flex justify-between">
        {/* i am having fun */}
        <p
          className="underline text-blue-900 cursor-pointer"
          onClick={() => console.log("fuck you")}
        >
          Forgot password ?
        </p>
      </CardFooter>
    </Card>
  );
}
