import { ModeToggle } from "./Change-theme-button";

export function NavBar () {
    return <div className="flex justify-between m-3">
        <div>
            Wallet Generator
        </div>
        <div>
            <ModeToggle />
        </div>
    </div>
}