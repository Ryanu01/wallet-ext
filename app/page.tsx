"use client"
import { DashBoard } from "@/components/DashBoard";
import Navbar from "@/components/NavBar";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

export default function HOME () {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
      {localStorage.getItem("wallets") ? redirect("/wallet") : 
      <div>
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        > 
        <Navbar />
        <DashBoard />
        </motion.div>
        </div>
      }
    </div>
  )
}