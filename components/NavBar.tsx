"use client"
import { Boxes } from "lucide-react";
import React from "react";
import { ModeToggle } from "./Change-theme-button";
import { useRouter } from "next/navigation";

export function  Navbar  ()  {
  const router = useRouter()
  return (
    <nav className="flex justify-between items-center py-4">
      <div className="flex items-center gap-2">
        <Boxes onClick={() => {
            router.push("/")
        }} className="size-10" />
        <div className="flex flex-col gap-4">
          <span className="tracking-tighter text-3xl font-extrabold text-primary flex gap-2 items-center">
            WALTEX{" "}
          </span>
        </div>
      </div>
      <ModeToggle />
    </nav>
  );
};

export default Navbar;