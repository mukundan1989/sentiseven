"use client"

import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User, Settings } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { user, signOut } = useAuth()

  // Get user's initials for the avatar
  const getInitials = () => {
    if (!user?.user_metadata?.name) {
      return user?.email?.substring(0, 2).toUpperCase() || "U"
    }

    const name = user.user_metadata.name as string
    const parts = name.split(" ")
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  // If no user, show login button
  if (!user) {
    return (
      <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
        <Link href="/login">Login</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarFallback className="bg-muted text-foreground font-medium">{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-md border-border shadow-lg" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium text-foreground">{user.user_metadata?.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
          asChild
        >
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
          asChild
        >
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          className="text-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
