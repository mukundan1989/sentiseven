"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { LucideUser, LogOut } from 'lucide-react'
import { logout } from "@/app/actions/auth-actions"
import Link from "next/link"

interface UserType {
  email: string
  name: string
}

export function AuthStatus() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user")
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-gray-800 animate-pulse"></div>
  }

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="outline" size="sm" className="gap-2">
          <LucideUser className="h-4 w-4" />
          Sign In
        </Button>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-gray-400">{user.email}</p>
      </div>
      <Button variant="outline" size="icon" onClick={() => logout()} title="Sign out">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
