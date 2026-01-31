"use client"

import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { useState } from "react";

export default function WalletGenerator() {

    const [words, setWords] = useState("")
    const [seed, setSeed] = useState("")

    function generateMnemonics() {
        const words = generateMnemonic()
        setWords(words)
    }

    function generateSeed (words: string) {
        
        const randomSeed = mnemonicToSeedSync(words)        
        setSeed(randomSeed.toString("hex"))
    }


    return <div className="">
        <div className="flex justify-center">
            <div className="border-2 bg-slate-300 rounded-xl">
                <button onClick={generateMnemonics}>Click me</button>
            </div>
        </div>
        {words ?
            <div className="mt-5 flex justify-center">
                    {words}
            </div> : <div className="mt-5 flex justify-center">
                    No words
            </div>
        }


        <div className="flex justify-center mt-2">
            <div className="border-2 bg-slate-300 rounded-br-sm">
                <button onClick={() => {
                    generateSeed(words)
                }}>To generate seed</button>
            </div>
        </div>
        <div className="flex justify-center mt-5">
            {seed}
        </div>
    </div>
}