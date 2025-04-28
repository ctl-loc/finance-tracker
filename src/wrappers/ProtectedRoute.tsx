"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        console.log(status, session);
        if (status === "unauthenticated" || !session) {
            router.replace("/auth/signin");
        }
    }, [status, session, router]);

    if (status === "loading") return <div>Loading...</div>;
    if (status === "unauthenticated") return null; // prevent from rendering the child

    return <>{children}</>;
}
