"use client";

import DashboardComponent from "@/components/dashboard/DashboardComponent";
import ProtectedRoute from "@/wrappers/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col h-full w-full">
                <DashboardComponent />
            </div>
        </ProtectedRoute>
    );
}
