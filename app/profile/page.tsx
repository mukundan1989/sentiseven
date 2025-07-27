"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  Award,
  Shield,
  CheckCircle,
  Clock,
} from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "January 2024",
    bio: "Experienced trader focused on sentiment-driven strategies",
  })

  const handleSave = () => {
    setIsEditing(false)
    // Save logic here
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data
  }

  const stats = [
    { label: "Total Trades", value: "1,247", icon: Activity, color: "text-electric-blue-400" },
    { label: "Win Rate", value: "73.2%", icon: Target, color: "text-emerald-400" },
    { label: "Portfolio Value", value: "$45,231", icon: DollarSign, color: "text-gold-400" },
    { label: "Active Signals", value: "23", icon: TrendingUp, color: "text-purple-400" },
  ]

  const achievements = [
    { title: "First Trade", description: "Completed your first trade", earned: true },
    { title: "Profit Streak", description: "10 consecutive profitable trades", earned: true },
    { title: "Sentiment Master", description: "Used all sentiment sources", earned: true },
    { title: "Risk Manager", description: "Maintained <5% portfolio risk", earned: false },
    { title: "Diamond Hands", description: "Held position for 30+ days", earned: false },
    { title: "Market Guru", description: "Achieved 80%+ win rate", earned: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
            Profile
          </h1>
          <Button
            variant={isEditing ? "glass" : "electric"}
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit3 className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-4 border-gradient-to-r from-electric-blue-500 to-purple-500">
                      <AvatarImage src="/placeholder-avatar.jpg" />
                      <AvatarFallback className="bg-gradient-to-r from-electric-blue-500 to-purple-500 text-white text-2xl font-bold">
                        {profileData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  {isEditing ? (
                    <div className="w-full space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-white/80">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bio" className="text-white/80">
                          Bio
                        </Label>
                        <Input
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <Button variant="electric" onClick={handleSave} className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <h2 className="text-xl font-bold text-white">{profileData.name}</h2>
                      <p className="text-white/60">{profileData.bio}</p>
                      <Badge variant="success" className="mt-2">
                        <Shield className="mr-1 h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3 text-white/70">
                    <Mail className="h-4 w-4" />
                    {isEditing ? (
                      <Input
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="flex-1"
                      />
                    ) : (
                      <span>{profileData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-white/70">
                    <Phone className="h-4 w-4" />
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="flex-1"
                      />
                    ) : (
                      <span>{profileData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-white/70">
                    <MapPin className="h-4 w-4" />
                    {isEditing ? (
                      <Input
                        value={profileData.location}
                        onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                        className="flex-1"
                      />
                    ) : (
                      <span>{profileData.location}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-white/70">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {profileData.joinDate}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="group hover:scale-105 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60">{stat.label}</p>
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/5 backdrop-blur-xl">
                <TabsTrigger
                  value="activity"
                  className="data-[state=active]:bg-electric-blue-500/20 data-[state=active]:text-electric-blue-400"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="data-[state=active]:bg-electric-blue-500/20 data-[state=active]:text-electric-blue-400"
                >
                  Achievements
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-electric-blue-500/20 data-[state=active]:text-electric-blue-400"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-electric-blue-400" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Your latest trading activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { action: "Bought AAPL", time: "2 hours ago", profit: "+$234", positive: true },
                        { action: "Sold MSFT", time: "5 hours ago", profit: "+$156", positive: true },
                        { action: "Bought GOOGL", time: "1 day ago", profit: "-$89", positive: false },
                        { action: "Sold TSLA", time: "2 days ago", profit: "+$445", positive: true },
                        { action: "Bought AMZN", time: "3 days ago", profit: "+$123", positive: true },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full ${activity.positive ? "bg-emerald-400" : "bg-red-400"}`}
                            />
                            <div>
                              <p className="text-white font-medium">{activity.action}</p>
                              <p className="text-white/60 text-sm">{activity.time}</p>
                            </div>
                          </div>
                          <Badge variant={activity.positive ? "success" : "destructive"}>{activity.profit}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-gold-400" />
                      Achievements
                    </CardTitle>
                    <CardDescription>Your trading milestones and accomplishments</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border transition-all duration-300 ${
                            achievement.earned
                              ? "bg-gradient-to-r from-gold-500/20 to-gold-600/20 border-gold-500/30 hover:border-gold-400/50"
                              : "bg-white/5 border-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`p-2 rounded-full ${
                                achievement.earned ? "bg-gradient-to-r from-gold-500 to-gold-600" : "bg-white/10"
                              }`}
                            >
                              {achievement.earned ? (
                                <Award className="h-4 w-4 text-white" />
                              ) : (
                                <Clock className="h-4 w-4 text-white/50" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold ${achievement.earned ? "text-gold-400" : "text-white/70"}`}>
                                {achievement.title}
                              </h3>
                              <p className="text-sm text-white/60 mt-1">{achievement.description}</p>
                              {achievement.earned && (
                                <Badge variant="gold" className="mt-2">
                                  Earned
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Email Notifications</h4>
                        <p className="text-white/60 text-sm">Receive trading alerts via email</p>
                      </div>
                      <Button variant="glass" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-white/60 text-sm">Add an extra layer of security</p>
                      </div>
                      <Button variant="electric" size="sm">
                        Enable
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">API Access</h4>
                        <p className="text-white/60 text-sm">Generate API keys for external access</p>
                      </div>
                      <Button variant="glass" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Data Export</h4>
                        <p className="text-white/60 text-sm">Download your trading data</p>
                      </div>
                      <Button variant="glass" size="sm">
                        Export
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
