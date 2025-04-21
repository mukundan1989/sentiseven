"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LucideUser, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth-actions"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserType {
  email: string
  name: string
}

export function AuthStatus() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await logout()
    setUser(null)
    router.refresh()
  }

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-gray-800 animate-pulse"></div>
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent text-white border-gray-600 hover:bg-gray-800"
        >
          <LucideUser className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <p className="text-sm font-medium text-white">{user.name}</p>
        <p className="text-xs text-gray-400">{user.email}</p>
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={handleLogout}
        title="Sign out"
        className="bg-transparent text-white border-gray-600 hover:bg-gray-800"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
