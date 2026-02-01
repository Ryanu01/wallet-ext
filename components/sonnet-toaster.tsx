"use client"

import { Toaster } from "sonner"
import { useTheme } from "next-themes"

export function SonnerToaster() {
  const { theme } = useTheme()

  return (
    <Toaster
      theme={theme === "dark" ? "dark" : "light"}
        richColors={false}
      position="top-right"
    />
  )
}
