"use client"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import bs58 from 'bs58';
import { derivePath } from "ed25519-hd-key"
import nacl from "tweetnacl"
import { Keypair } from "@solana/web3.js"

let TOTAL_ACCOUTS = 0

interface Wallet {
    publicKey: string,
    privateKey: string
}

export function Secret({ coinType }: {
    coinType: number
}) {

    const [secretPhrase, setSecretPhrase] = useState("")
    const [mnemonics, setMnemonics] = useState<string[]>([])
    const [seed, setSeed] = useState("")
    const [privateKey, setPrivateKey] = useState("")
    const [publicKey, setPublicKey] = useState("")
    const [wallet, setWallet] = useState<Wallet[]>([])
    useEffect(() => {
        const mnemonics = localStorage.getItem("mnemonics")
        const seed = localStorage.getItem("seed")
        if (mnemonics && seed) {
            console.log("ho");

        }
    }, [])

    function generateWalletFromMnemonics() {
        const finalMnemonics = secretPhrase.length !== 0 ? secretPhrase.split(" ") : generateMnemonic().split(" ")

        const mnemonicString = finalMnemonics.join(" ")

        const seedBuffer = mnemonicToSeedSync(mnemonicString)
        const seedHex = seedBuffer.toString("hex")

        const path = `m/44'/${coinType}'/${TOTAL_ACCOUTS}'/0'`
        const derivedSeed = derivePath(path, seedHex).key

        const secretKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
        const pubKey = Keypair.fromSecretKey(secretKey).publicKey.toBase58()
        const privKey = bs58.encode(secretKey)

        setMnemonics(finalMnemonics)
        setSeed(seedHex)
        setPublicKey(pubKey)
        setPrivateKey(privKey)

        setWallet(prev => {
            const updated = [
                ...prev,
                { publicKey: pubKey, privateKey: privKey }
            ]
            localStorage.setItem("wallets", JSON.stringify(updated))
            return updated
        })

        localStorage.setItem("mnemonics", mnemonicString)
        localStorage.setItem("seed", seedHex)

        TOTAL_ACCOUTS++
    }

    return <div className="mt-5">
        <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight text-balance">
            Secret Recovery Phrase
        </h1>
        <h3 className="scroll-m-20 mt-2 text-primary/80 font-semibold text-lg md:text-xl">
            Save these words in a safe place.
        </h3>
        <div className="mt-5">
            <Input
                className="w-[85%] mr-5"
                type="password"
                placeholder="Enter your secret phase (or leave blank to generate)"
                onChange={(e) => setSecretPhrase(e.target.value)}
                value={secretPhrase}
            />

            <Button onClick={() => {
                generateWalletFromMnemonics()
            }} className="w-40 h-11 cursor-pointer"> {secretPhrase ? "Add Wallet" : "Generat Wallet"} </Button>
        </div>

    </div>
}