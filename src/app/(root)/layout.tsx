import NavBarComponent from "@/components/NavBar/NavBarComponent";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

type LayoutProps = {
    children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
    return (
        <SidebarProvider>
            <NavBarComponent />
            <main className="flex w-screen h-screen">
                <SidebarTrigger />
                {children}
            </main>
        </SidebarProvider>
    );
}
