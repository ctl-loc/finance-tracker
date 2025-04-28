"use client";

import ProtectedRoute from "@/wrappers/ProtectedRoute";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
    const { data: session } = useSession();

    return (
        <ProtectedRoute>
            <div>
                <h1>Dashboard</h1>
                <p>
                    Welcome to your dashboard {JSON.stringify(session?.user)}!
                </p>
            </div>
        </ProtectedRoute>
    );
}
