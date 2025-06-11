"use client";

import { FormEvent, useState } from "react";
import { register } from "@/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Clock, TriangleAlert } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export default function SignUpForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validation, setValidation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      setError("Username and password are mandatory");
      return;
    }

    try {
      await register(email, password);
      setValidation(true);
      setError("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {/* header */}
      <CardHeader>
        <CardTitle>Sign Up !</CardTitle>
        <CardDescription>Who are you ? Welcome my stranger</CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col">
        {/* information popup */}
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
        {validation && (
          <div className="bg-green-700 text-white p-2 m-2 rounded-xl flex items-center text-xl pl-5 gap-2">
            <Check /> Successfully registred, you can now sign in
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
            <Button type="submit">Sign Up</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
