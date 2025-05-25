import NavBarComponent from "@/components/NavBar/NavBarComponent";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-row w-screen h-screen">
      <div className="flex h-full w-1/6 bg-green-400">
        <NavBarComponent />
      </div>
      <div className="flex flex-col h-full w-full">
        <div className="flex w-full h-1/8">header</div>
        <main className="flex w-full h-full">{children}</main>
      </div>
    </div>
  );
}
