"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/context/theme-context"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="border-border hover:bg-accent hover:text-accent-foreground"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4 mr-2" />
          Dark
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 mr-2" />
          Light
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
