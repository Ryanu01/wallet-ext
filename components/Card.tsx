import { Button } from "./ui/button"

export function Card ({word}: {
    word: string
}) {
    return <div>
        <div>
            <Button variant={"secondary"}>Click me</Button>
            {word}
        </div>
    </div>
}
