"use client"

import { useState } from "react";
import { Button } from "./ui/button";

export function DashBoard () {

    const [solana, setSolana] = useState("")

    return <div className="mt-15">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            WALTEX suppports multiple blockchains
        </h1>
        <h4 className="mt-2">
            Select a blockchain to get started
        </h4>
        <div className="mt-5">
            <Button onClick={() => {
                
            }} className="cursor-pointer w-30 h-10" size={"lg"}>
                Solana
            </Button>
            <Button onClick={() => {
                alert("Hi")
            }} className="ml-4 h-10 w-30 cursor-pointer" size={"lg"}>
                Ethereum
            </Button>
        </div>
    </div>
}