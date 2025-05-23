"use client";

import DashboardComponent from "@/components/dashboard/DashboardComponent";
import NavBarComponent from "@/components/NavBar/NavBarComponent";
import ProtectedRoute from "@/wrappers/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen w-full flex-row">
        <div className="h-full w-1/5 bg-amber-100">
          <NavBarComponent />
        </div>
        <div className="flex flex-col w-full bg-red-400">
          <div className="h-1/10">Header</div>
          <div className="w-full ">
            <DashboardComponent />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
