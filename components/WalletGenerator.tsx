"use client"

import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { useState } from "react";
import nacl from "tweetnacl";
import bs58 from 'bs58';
import { Card } from "./Card";

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

    function generateSolanaKeypair(seed: string) {
        const path = `m/44'/501'/0'/0'`
        const derivedSeed = derivePath(path, seed).key
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
        const privateEncoded = bs58.encode(secret)
        console.log("private key " + privateEncoded);
        
        console.log("public key " + Keypair.fromSecretKey(secret).publicKey.toBase58());
        
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
        {seed ? <div className="flex justify-center mt-5">
            {seed}
        </div> : <div className="flex justify-center mt-5">
            null
        </div> }

        <div className="flex justify-center mt-5">
            <div className="border-2 bg-slate-300 rounded-br-sm">
                <button onClick={() => {
                    generateSolanaKeypair(seed)
                }}> Click</button>
            </div>
        </div>

        <div>
            <Card word="Hello"></Card>
        </div>

    </div>
}