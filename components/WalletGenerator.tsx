"use client"
import { Input } from "@/components/ui/input"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { generateMnemonic, mnemonicToSeedSync } from "bip39"
import bs58 from 'bs58';
import { derivePath } from "ed25519-hd-key"
import nacl from "tweetnacl"
import { Keypair } from "@solana/web3.js"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronUp, Copy } from "lucide-react"
import { toast } from "sonner"

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
    const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
    const [wallet, setWallet] = useState<Wallet[]>([])
    const [showInput, setShowInput] = useState(true)
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
        setShowInput(false)

    }
    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content);
        toast.success("Copied to clipboard!");
    };

    return <div className="mt-5">
        {showInput && (
            <motion.div
                className="mt-5"
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                }}
            >
                <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight text-balance">
                    Secret Recovery Phrase
                </h1>
                <h3 className="scroll-m-20 mt-2 text-primary/80 font-semibold text-lg md:text-xl">
                    Save these words in a safe place.
                </h3>
                <Input
                    className="w-[85%] mr-5"
                    type="password"
                    placeholder="Enter your secret phase (or leave blank to generate)"
                    onChange={(e) => setSecretPhrase(e.target.value)}
                    value={secretPhrase}
                />

                <Button onClick={() => {
                    generateWalletFromMnemonics()
                }} className="w-40 h-11 cursor-pointer">
                    {secretPhrase ? "Add Wallet" : "Generate Wallet"}
                </Button>
            </motion.div>
        )}

        {mnemonics && wallet.length > 0 && (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="group flex flex-col items-center gap-4 cursor-pointer rounded-lg border border-primary/10 p-8"
            >
                <div
                    className="flex w-full justify-between items-center"
                    onClick={() => setShowMnemonic(!showMnemonic)}
                >
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
                        Your Secret Phrase
                    </h2>
                    <Button
                        onClick={() => setShowMnemonic(!showMnemonic)}
                        variant="ghost"
                    >
                        {showMnemonic ? (
                            <ChevronUp className="size-4" />
                        ) : (
                            <ChevronDown className="size-4" />
                        )}
                    </Button>
                </div>

                {showMnemonic && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className="flex flex-col w-full items-center justify-center"
                        onClick={() => copyToClipboard(mnemonics.join(" "))}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center w-full items-center mx-auto my-8"
                        >
                            {mnemonics.map((word, index) => (
                                <p
                                    key={index}
                                    className="md:text-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 rounded-lg p-4"
                                >
                                    {word}
                                </p>
                            ))}
                        </motion.div>
                        <div className="text-sm md:text-base text-primary/50 flex w-full gap-2 items-center group-hover:text-primary/80 transition-all duration-300">
                            <Copy className="size-4" /> Click Anywhere To Copy
                        </div>
                    </motion.div>
                )}
            </motion.div>
        )}

        {wallet.length > 0 && (
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.3,
                    ease: "easeInOut",
                }}
                className="flex flex-col gap-8 mt-6"
            > 
                <div className="flex justify-between">
                    <h1 className="tracking-tighter text-3xl md:text-4xl font-extrabold">
                        {coinType === 501 ? "Solana" : "Ethereum"} WAllet
                    </h1>
                    <div>
                        dawd
                    </div>
                </div>
            </motion.div>
        )}

    </div >
}