"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Database,
  Key,
  Mail,
  Smartphone,
  Globe,
  Moon,
  Sun,
  Monitor,
  Eye,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    trading: true,
    news: true,
    system: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    activityVisible: false,
    analyticsEnabled: true,
    dataSharing: false,
  })

  const [theme, setTheme] = useState("dark")
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("UTC-5")

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-white/60 mt-1">Manage your account preferences and configurations</p>
          </div>
          <Badge variant="electric" className="hidden sm:flex">
            <CheckCircle className="mr-1 h-3 w-3" />
            All changes saved
          </Badge>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-white/5 backdrop-blur-xl">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-electric-blue-500/20 data-[state=active]:text-electric-blue-400"
            >
              <Settings className="mr-2 h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-electric-blue-500/20 data-[state=active]:text-electric-blue-400"
            >
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-electric-blue-500/20 data-[state=active]:text-electric-blue-400"
            >
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="appearance"
              className="data-[state=active]:bg-electric-blue-500/20 data-[state=active]:text-electric-blue-400"
            >
              <Palette className="mr-2 h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-electric-blue-500/20 data-[state=active]:text-electric-blue-400"
            >
              <Database className="mr-2 h-4 w-4" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-electric-blue-400" />
                  Regional Settings
                </CardTitle>
                <CardDescription>Configure your language, timezone, and regional preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-white/80">
                      Language
                    </Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="ja">日本語</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-white/80">
                      Timezone
                    </Label>
                    <Select value={timezone} onValueChange={setTimezone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="UTC+1">Central European (UTC+1)</SelectItem>
                        <SelectItem value="UTC+9">Japan Time (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trading Preferences</CardTitle>
                <CardDescription>Customize your trading experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Auto-refresh Data</h4>
                    <p className="text-white/60 text-sm">Automatically refresh market data every 30 seconds</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Sound Alerts</h4>
                    <p className="text-white/60 text-sm">Play sound notifications for important events</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">Advanced Charts</h4>
                    <p className="text-white/60 text-sm">Enable advanced charting features and indicators</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-400" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how you want to be notified about important events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Notifications
                  </h4>
                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Trading Alerts</p>
                        <p className="text-white/50 text-sm">Get notified about significant price movements</p>
                      </div>
                      <Switch
                        checked={notifications.trading}
                        onCheckedChange={(value) => handleNotificationChange("trading", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">News Updates</p>
                        <p className="text-white/50 text-sm">Receive important market news and analysis</p>
                      </div>
                      <Switch
                        checked={notifications.news}
                        onCheckedChange={(value) => handleNotificationChange("news", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">System Updates</p>
                        <p className="text-white/50 text-sm">Platform updates and maintenance notifications</p>
                      </div>
                      <Switch
                        checked={notifications.system}
                        onCheckedChange={(value) => handleNotificationChange("system", value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Push Notifications
                  </h4>
                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Enable Push Notifications</p>
                        <p className="text-white/50 text-sm">Receive notifications on your device</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(value) => handleNotificationChange("push", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">SMS Alerts</p>
                        <p className="text-white/50 text-sm">Critical alerts via SMS (charges may apply)</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(value) => handleNotificationChange("sms", value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-emerald-400" />
                  Account Security
                </CardTitle>
                <CardDescription>Protect your account with advanced security features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-white/60 text-sm">Enabled via authenticator app</p>
                      </div>
                    </div>
                    <Button variant="glass" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Key className="h-5 w-5 text-gold-400" />
                      <div>
                        <h4 className="text-white font-medium">API Keys</h4>
                        <p className="text-white/60 text-sm">Manage your API access keys</p>
                      </div>
                    </div>
                    <Button variant="electric" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Eye className="h-5 w-5 text-purple-400" />
                      <div>
                        <h4 className="text-white font-medium">Login Sessions</h4>
                        <p className="text-white/60 text-sm">View and manage active sessions</p>
                      </div>
                    </div>
                    <Button variant="glass" size="sm">
                      View All
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Privacy Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Profile Visibility</p>
                        <p className="text-white/50 text-sm">Make your profile visible to other users</p>
                      </div>
                      <Switch
                        checked={privacy.profileVisible}
                        onCheckedChange={(value) => handlePrivacyChange("profileVisible", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Activity Tracking</p>
                        <p className="text-white/50 text-sm">Allow tracking of your trading activity</p>
                      </div>
                      <Switch
                        checked={privacy.activityVisible}
                        onCheckedChange={(value) => handlePrivacyChange("activityVisible", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Analytics</p>
                        <p className="text-white/50 text-sm">Help improve our service with usage analytics</p>
                      </div>
                      <Switch
                        checked={privacy.analyticsEnabled}
                        onCheckedChange={(value) => handlePrivacyChange("analyticsEnabled", value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-gold-400" />
                  Theme & Appearance
                </CardTitle>
                <CardDescription>Customize the look and feel of your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Theme Selection</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === "dark"
                          ? "border-electric-blue-500 bg-electric-blue-500/10"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      onClick={() => setTheme("dark")}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-slate-800">
                          <Moon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white font-medium">Dark</h5>
                          <p className="text-white/60 text-sm">Default dark theme</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === "light"
                          ? "border-electric-blue-500 bg-electric-blue-500/10"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      onClick={() => setTheme("light")}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-white/20">
                          <Sun className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white font-medium">Light</h5>
                          <p className="text-white/60 text-sm">Clean light theme</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        theme === "auto"
                          ? "border-electric-blue-500 bg-electric-blue-500/10"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      onClick={() => setTheme("auto")}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-gradient-to-r from-slate-800 to-white/20">
                          <Monitor className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h5 className="text-white font-medium">Auto</h5>
                          <p className="text-white/60 text-sm">Follow system</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-white font-medium">Display Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Compact Mode</p>
                        <p className="text-white/50 text-sm">Reduce spacing and padding for more content</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">Animations</p>
                        <p className="text-white/50 text-sm">Enable smooth transitions and animations</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white/80">High Contrast</p>
                        <p className="text-white/50 text-sm">Increase contrast for better accessibility</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" />
                  Data Management
                </CardTitle>
                <CardDescription>Export, backup, or delete your account data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Download className="h-5 w-5 text-electric-blue-400" />
                      <div>
                        <h4 className="text-white font-medium">Export Data</h4>
                        <p className="text-white/60 text-sm">Download all your trading data and history</p>
                      </div>
                    </div>
                    <Button variant="electric" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-gold-400" />
                      <div>
                        <h4 className="text-white font-medium">Data Backup</h4>
                        <p className="text-white/60 text-sm">Create a backup of your account settings</p>
                      </div>
                    </div>
                    <Button variant="glass" size="sm">
                      Create Backup
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div>
                        <h4 className="text-white font-medium">Clear Cache</h4>
                        <p className="text-white/60 text-sm">Clear stored data and reset preferences</p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Clear Cache
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex items-center space-x-3">
                      <Trash2 className="h-5 w-5 text-red-400" />
                      <div>
                        <h4 className="text-white font-medium">Delete Account</h4>
                        <p className="text-white/60 text-sm">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="text-amber-400 font-medium">Data Retention Policy</h4>
                      <p className="text-white/70 text-sm mt-1">
                        We retain your trading data for 7 years as required by financial regulations. Personal
                        information can be deleted upon request, subject to legal requirements.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
