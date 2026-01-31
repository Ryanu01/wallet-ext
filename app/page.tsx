import Navbar from "@/components/NavBar";
import WalletGenerator from "@/components/WalletGenerator";


export default function HOME () {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4 p-4 min-h-[92vh]">
      <Navbar />
      <WalletGenerator />
    </div>
  )
}