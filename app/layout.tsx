import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/context/theme-context"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Toaster } from "@/components/ui/toaster"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, PanelLeft } from "lucide-react"
import localFont from "next/font/local"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"

const inter = Inter({ subsets: ["latin"] })

// Load Neuropol font locally
const neuropol = localFont({
  src: "../public/fonts/neuropol.otf",
  variable: "--font-neuropol",
})

export const metadata: Metadata = {
  title: "Sentiment Dashboard",
  description: "Track market sentiment across multiple data sources",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${neuropol.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <SidebarProvider>
              <div className="min-h-screen bg-background text-foreground">
                <nav className="border-b border-border bg-white dark:bg-card">
                  <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {/* Hamburger icon for mobile */}
                        <div className="lg:hidden mr-4">
                          <SidebarTrigger className="h-7 w-7">
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle Sidebar</span>
                          </SidebarTrigger>
                        </div>
                        {/* SENTIBOARD Logo - stays on left */}
                        <span className="font-neuropol text-foreground text-lg">SENTIBOARD</span>
                      </div>

                      <div className="hidden lg:flex items-center space-x-4">
                        {/* Navigation menu items */}
                        <Link
                          href="/"
                          className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                        >
                          Home
                        </Link>

                        {/* Signals Dropdown Menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger className="text-foreground hover:text-primary transition-colors whitespace-nowrap flex items-center">
                            Signals
                            <ChevronDown className="ml-1 h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-background border-border">
                            <DropdownMenuItem asChild>
                              <Link
                                href="/google-trend-signals"
                                className="text-foreground hover:text-primary transition-colors w-full"
                              >
                                Google Trends
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/twitter-signals"
                                className="text-foreground hover:text-primary transition-colors w-full"
                              >
                                Twitter Signals
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href="/news-signals"
                                className="text-foreground hover:text-primary transition-colors w-full"
                              >
                                News Signals
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Link
                          href="/performance"
                          className="text-foreground hover:text-primary transition-colors whitespace-nowrap"
                        >
                          Performance
                        </Link>
                      </div>

                      <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <UserNav />
                      </div>
                    </div>
                  </div>
                </nav>
                {children}
              </div>
              <MobileSidebar />
              <Toaster />
            </SidebarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
