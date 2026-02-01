"use client"

import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { useState } from "react";
import nacl from "tweetnacl";
import bs58 from 'bs58';
import { Card } from "./Card";
import { Button } from "./ui/button";
import { DashBoard } from "./DashBoard";

export default function WalletGenerator() {

    const [words, setWords] = useState("")
    const [seed, setSeed] = useState("")

    function generateMnemonics() {
        const words = generateMnemonic()
        setWords(words)
        console.log(words);
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
        {localStorage.getItem("Mnemonic") ? 
            <div>
                Hi
            </div> : <div>
                <DashBoard />
            </div>
        }
    </div>
}