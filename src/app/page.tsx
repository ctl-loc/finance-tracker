"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (!session || !session.user) {
            router.push("/auth/signin");
        } else {
            router.push("/dashboard");
        }
    }, [session, router]);

    return <p>Welcome to Finance Tracker!</p>;
}
