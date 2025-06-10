"use client";
import SignInComponent from "@/components/login/SignInComponent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session || !session.user) {
      router.push("/auth/signin");
    } else {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <div className="bg-gray-800 h-screen flex items-center justify-center">
      <SignInComponent />
    </div>
  );
}
