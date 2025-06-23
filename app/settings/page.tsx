"use client"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Loader2, SettingsIcon, Bell, Shield } from "lucide-react"
import { useTheme } from "@/context/theme-context"

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketAlerts, setMarketAlerts] = useState(true)
  const { theme, toggleTheme } = useTheme()
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  if (authLoading) {
    return (
      <div className="bg-background text-foreground min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in AuthProvider
  }

  return (
    <div className="bg-background text-foreground min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Simple tabs without using shadcn components */}
        <div className="space-y-4">
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex-1 py-2 px-4 ${
                activeTab === "general" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 py-2 px-4 ${
                activeTab === "notifications" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex-1 py-2 px-4 ${
                activeTab === "security" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              Security
            </button>
          </div>

          {/* General Tab */}
          {activeTab === "general" && (
            <div className="bg-card border border-border rounded-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <SettingsIcon className="h-5 w-5 text-brand-accent" />
                <h2 className="text-xl font-semibold">General Settings</h2>
              </div>
              <p className="text-muted-foreground mb-6">Manage your general preferences</p>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="dark-mode" className="font-medium">
                      Dark Mode
                    </label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                    <input
                      type="checkbox"
                      id="dark-mode"
                      checked={theme === "dark"}
                      onChange={toggleTheme}
                      className="peer sr-only"
                    />
                    <span
                      className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-primary-foreground transition-all ${
                        theme === "dark" ? "translate-x-5 bg-brand-accent" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="language" className="font-medium">
                      Language
                    </label>
                    <p className="text-sm text-muted-foreground">Currently set to English</p>
                  </div>
                  <select
                    id="language"
                    className="bg-input border border-border rounded-md px-3 py-1 text-sm text-foreground"
                    defaultValue="en"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="bg-card border border-border rounded-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="h-5 w-5 text-brand-accent" />
                <h2 className="text-xl font-semibold">Notification Settings</h2>
              </div>
              <p className="text-muted-foreground mb-6">Manage how you receive notifications</p>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="email-notifications" className="font-medium">
                      Email Notifications
                    </label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                    <input
                      type="checkbox"
                      id="email-notifications"
                      checked={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      className="peer sr-only"
                    />
                    <span
                      className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-primary-foreground transition-all ${
                        emailNotifications ? "translate-x-5 bg-brand-accent" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="market-alerts" className="font-medium">
                      Market Alerts
                    </label>
                    <p className="text-sm text-muted-foreground">Get notified about significant market changes</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                    <input
                      type="checkbox"
                      id="market-alerts"
                      checked={marketAlerts}
                      onChange={() => setMarketAlerts(!marketAlerts)}
                      className="peer sr-only"
                    />
                    <span
                      className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-primary-foreground transition-all ${
                        marketAlerts ? "translate-x-5 bg-brand-accent" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="bg-card border border-border rounded-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-brand-accent" />
                <h2 className="text-xl font-semibold">Security Settings</h2>
              </div>
              <p className="text-muted-foreground mb-6">Manage your account security</p>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="two-factor" className="font-medium">
                      Two-Factor Authentication
                    </label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted">
                    <input
                      type="checkbox"
                      id="two-factor"
                      checked={twoFactorAuth}
                      onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                      className="peer sr-only"
                    />
                    <span
                      className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-primary-foreground transition-all ${
                        twoFactorAuth ? "translate-x-5 bg-brand-accent" : ""
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="password-reset" className="font-medium">
                      Password Reset
                    </label>
                    <p className="text-sm text-muted-foreground">Change your account password</p>
                  </div>
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1 rounded-md text-sm">
                    Reset Password
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
