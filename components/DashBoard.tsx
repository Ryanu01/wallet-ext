"use client"

import { useState } from "react";
import { Button } from "./ui/button";
import WalletGenerator from "./WalletGeneratortemp";
import { useRouter } from "next/navigation";


export function DashBoard () {

    const [solana, setSolana] = useState("")
    const navigate = useRouter()
    return <div className="mt-15">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            WALTEX suppports multiple blockchains
        </h1>
        <h4 className="mt-2">
            Select a blockchain to get started
        </h4>
        <div className="mt-5">
            <Button onClick={() => {
                localStorage.setItem("coin", "solana")
                navigate.push("/wallet")
            }} className="cursor-pointer w-30 h-10" size={"lg"}>
                Solana
            </Button>
            <Button onClick={() => {
                localStorage.setItem("coin", "ethereum")
                navigate.push("/wallet")
            }} className="ml-4 h-10 w-30 cursor-pointer" size={"lg"}>
                Ethereum
            </Button>
        </div>
    </div>
}