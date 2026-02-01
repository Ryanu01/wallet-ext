"use client"

import Navbar from "@/components/NavBar";
import { Secret } from "@/components/WalletGenerator";
import { motion } from "framer-motion";
import { redirect, useRouter } from "next/navigation";

export default function () {

  const router = useRouter()

  return <div className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
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
      {localStorage.getItem("coin") === "solana" ?
        <Secret coinType={501} /> : redirect("/")
      }
      
    </motion.div>
  </div>
}