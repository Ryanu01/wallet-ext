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
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Grid2X2,
  List,
  Trash
} from "lucide-react"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader
} from "./ui/alert-dialog"

let TOTAL_ACCOUTS = 0

interface Wallet {
  publicKey: string,
  privateKey: string
}

export function WalletGenerator({ coinType }: {
  coinType: number
}) {

  const [secretPhrase, setSecretPhrase] = useState("")
  const [mnemonics, setMnemonics] = useState<string[]>([])
  const [seed, setSeed] = useState("")
  const [gridView, setGridView] = useState<boolean>(false);
  const [privateKey, setPrivateKey] = useState("")
  const [publicKey, setPublicKey] = useState("")
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<boolean[]>([]);
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [wallet, setWallet] = useState<Wallet[]>([])
  const [showInput, setShowInput] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedMnemonics = localStorage.getItem("mnemonics")
    const storedSeed = localStorage.getItem("seed")
    const storedWallets = localStorage.getItem("wallets")



    if (storedMnemonics && storedSeed) {
      setMnemonics(storedMnemonics.split(" "))
      setSeed(storedSeed)
    }

    // Load existing wallets and initialize visibility array
    if (storedWallets && storedSeed && storedMnemonics) {
      try {
        const parsedWallets = JSON.parse(storedWallets)
        if (parsedWallets.length > 0) {
          setWallet(parsedWallets)
          setVisiblePrivateKeys(new Array(parsedWallets.length).fill(false))
          setShowInput(false)
        }
      } catch (e) {
        console.error("Error parsing wallets:", e)
      }
    }
  }, [])

  // Sync visiblePrivateKeys with wallet length
  useEffect(() => {
    if (wallet.length > visiblePrivateKeys.length) {
      setVisiblePrivateKeys(prev => [...prev, ...new Array(wallet.length - prev.length).fill(false)])
    }
    if (localStorage.getItem("wallets")?.length == 2) {
      localStorage.setItem("wallets", '')
      redirect("/")
    }
  }, [wallet.length])

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

  const handleDeleteWallet = () => {
    localStorage.setItem("wallets", "")
    localStorage.setItem("mnemonics", "")
    localStorage.setItem("seed", "")
    localStorage.setItem("coin", "")
    toast.success("All Wallets Cleared", { position: "bottom-right" })
    router.push("/")
  }

  const handleClearWallet = (index: number) => {
    const updatedWallets = wallet.filter((_, i) => i !== index)
    setWallet(updatedWallets)

    // Also update the visibility array
    const updatedVisibility = visiblePrivateKeys.filter((_, i) => i !== index)
    setVisiblePrivateKeys(updatedVisibility)

    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
    toast.success("Wallet deleted successfully!", { position: "bottom-right" });
  }

  const togglePrivateKeyVisibility = (index: number) => {
    console.log("Click - Index:", index);
    console.log("Current visiblePrivateKeys:", visiblePrivateKeys);
    console.log("visiblePrivateKeys[index] before:", visiblePrivateKeys[index]);

    setVisiblePrivateKeys(prev => {
      const updated = prev.map((visible, i) => (i === index ? !visible : visible));
      return updated;
    });
  };

  const handleAddMoreWallet = () => {
    const existingMnemonics = mnemonics
    if (!existingMnemonics) {
      router.push("/")
    }

    const mnemonicString = existingMnemonics.join(" ")

    const seedBuffer = mnemonicToSeedSync(mnemonicString)
    const seedHex = seedBuffer.toString("hex")

    const path = `m/44'/${coinType}'/${TOTAL_ACCOUTS}'/0'`
    const derivedSeed = derivePath(path, seedHex).key

    const secretKey = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
    const pubKey = Keypair.fromSecretKey(secretKey).publicKey.toBase58()
    const privKey = bs58.encode(secretKey)

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

    localStorage.setItem("seed", seedHex)

    TOTAL_ACCOUTS++
    setShowInput(false)
  }

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
          placeholder="Enter your secret phrase (or leave blank to generate)"
          onChange={(e) => setSecretPhrase(e.target.value)}
          value={secretPhrase}
        />

        <Button onClick={() => {
          generateWalletFromMnemonics()
          toast.success("wallet generated successfully!", { position: "bottom-right" })
        }} className="w-40 h-11 cursor-pointer">
          {secretPhrase ? "Add Wallet" : "Generate Wallet"}
        </Button>
      </motion.div>
    )}

    {mnemonics.length > 0 && wallet.length > 0 && (
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



    {/* Display wallet pairs */}
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
        <div className="flex md:flex-row flex-col justify-between w-full gap-4 md:items-center">
          <h2 className="tracking-tighter text-3xl md:text-4xl font-extrabold">
            {coinType === 501 ? "Solana" : "Ethereum"} Wallet
          </h2>
          <div className="flex gap-2">
            {wallet.length > 1 && (
              <Button
                variant={"ghost"}
                onClick={() => setGridView(!gridView)}
                className="hidden md:block"
              >
                {gridView ? <Grid2X2 /> : <List />}
              </Button>
            )}
            <Button onClick={() => {
              handleAddMoreWallet()
              toast.success("wallet generated successfully!", { position: "bottom-right" })
            }} className="cursor-pointer">Add Wallet</Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="self-end cursor-pointer">
                  Clear Wallets
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete all wallets?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your wallets and keys from local storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeleteWallet()}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div
          className={`grid gap-6 grid-cols-1 col-span-1  ${gridView ? "md:grid-cols-2 lg:grid-cols-3" : ""
            }`}
        >
          {wallet.map((walletItem: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + index * 0.1,
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="flex flex-col rounded-2xl border border-primary/10"
            >
              <div className="flex justify-between px-8 py-6">
                <h3 className="font-bold text-2xl md:text-3xl tracking-tighter ">
                  Wallet {index + 1}
                </h3>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex gap-2 items-center"
                    >
                      <Trash className="size-4 text-destructive cursor-crosshair" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this wallet?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your wallet and keys from local storage.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleClearWallet(index)}
                        className="text-destructive"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex flex-col gap-8 px-8 py-4 rounded-2xl bg-secondary/50">
                <div
                  className="flex flex-col w-full gap-2"
                  onClick={() => copyToClipboard(walletItem.publicKey)}
                >
                  <span className="text-lg md:text-xl font-bold tracking-tighter">
                    Public Key
                  </span>
                  <p className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate">
                    {walletItem.publicKey}
                  </p>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <span className="text-lg md:text-xl font-bold tracking-tighter">
                    Private Key
                  </span>
                  <div className="flex justify-between w-full items-center gap-2">
                    <p
                      onClick={() => copyToClipboard(walletItem.privateKey)}
                      className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate"
                    >
                      {visiblePrivateKeys[index] === true
                        ? walletItem.privateKey
                        : "•".repeat(50)}
                    </p>
                    <Button
                      variant="ghost"
                      onClick={() => togglePrivateKeyVisibility(index)}
                    >
                      {visiblePrivateKeys[index] ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}
  </div >
}
