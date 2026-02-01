"use client"

import Navbar from "@/components/NavBar";
import { WalletGenerator } from "@/components/WalletGenerator";
import { motion } from "framer-motion";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function () {

  const router = useRouter()
  const [coin, setCoin] = useState("")

  useEffect(() => {
    setCoin(localStorage.getItem("coin") || "")
    console.log(localStorage.getItem("wallets")?.length);
  }, [])

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
        {coin === "solana" ? 
        <WalletGenerator coinType={501} /> : <WalletGenerator coinType={60}/>
      }
    </motion.div>
  </div>
}