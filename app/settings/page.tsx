"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Settings, Bell, Shield, BarChart3, Database, Palette } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Dashboard Settings
  const [defaultTimePeriod, setDefaultTimePeriod] = useState("7d")
  const [maxStocksDisplay, setMaxStocksDisplay] = useState(10)
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30)
  const [chartType, setChartType] = useState("line")
  const [theme, setTheme] = useState("dark")

  // Signal Settings
  const [signalSensitivity, setSignalSensitivity] = useState("medium")
  const [enableGoogleTrends, setEnableGoogleTrends] = useState(true)
  const [enableTwitterSignals, setEnableTwitterSignals] = useState(true)
  const [enableNewsSignals, setEnableNewsSignals] = useState(true)
  const [alertThreshold, setAlertThreshold] = useState(15)

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [dailySummary, setDailySummary] = useState(false)
  const [portfolioAlerts, setPortfolioAlerts] = useState(true)
  const [sentimentAlerts, setSentimentAlerts] = useState(true)

  // Performance Settings
  const [benchmarkIndex, setBenchmarkIndex] = useState("SPY")
  const [riskTolerance, setRiskTolerance] = useState("moderate")
  const [performanceCalculation, setPerformanceCalculation] = useState("time-weighted")

  // Load user settings
  useEffect(() => {
    if (user) {
      loadUserSettings()
    }
  }, [user])

  const loadUserSettings = async () => {
    try {
      const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user?.id).single()

      if (data && !error) {
        // Load dashboard settings
        setDefaultTimePeriod(data.default_time_period || "7d")
        setMaxStocksDisplay(data.max_stocks_display || 10)
        setAutoRefreshInterval(data.auto_refresh_interval || 30)
        setChartType(data.chart_type || "line")
        setTheme(data.theme || "dark")

        // Load signal settings
        setSignalSensitivity(data.signal_sensitivity || "medium")
        setEnableGoogleTrends(data.enable_google_trends ?? true)
        setEnableTwitterSignals(data.enable_twitter_signals ?? true)
        setEnableNewsSignals(data.enable_news_signals ?? true)
        setAlertThreshold(data.alert_threshold || 15)

        // Load notification settings
        setEmailNotifications(data.email_notifications ?? true)
        setDailySummary(data.daily_summary ?? false)
        setPortfolioAlerts(data.portfolio_alerts ?? true)
        setSentimentAlerts(data.sentiment_alerts ?? true)

        // Load performance settings
        setBenchmarkIndex(data.benchmark_index || "SPY")
        setRiskTolerance(data.risk_tolerance || "moderate")
        setPerformanceCalculation(data.performance_calculation || "time-weighted")
      }
    } catch (err) {
      console.error("Error loading settings:", err)
    }
  }

  const saveSettings = async () => {
    if (!user) return

    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const settings = {
        user_id: user.id,
        default_time_period: defaultTimePeriod,
        max_stocks_display: maxStocksDisplay,
        auto_refresh_interval: autoRefreshInterval,
        chart_type: chartType,
        theme: theme,
        signal_sensitivity: signalSensitivity,
        enable_google_trends: enableGoogleTrends,
        enable_twitter_signals: enableTwitterSignals,
        enable_news_signals: enableNewsSignals,
        alert_threshold: alertThreshold,
        email_notifications: emailNotifications,
        daily_summary: dailySummary,
        portfolio_alerts: portfolioAlerts,
        sentiment_alerts: sentimentAlerts,
        benchmark_index: benchmarkIndex,
        risk_tolerance: riskTolerance,
        performance_calculation: performanceCalculation,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from("user_settings").upsert(settings)

      if (error) {
        setError(error.message)
      } else {
        setSuccessMessage("Settings saved successfully!")
        setTimeout(() => setSuccessMessage(null), 3000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "signals", label: "Signals", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "performance", label: "Performance", icon: Database },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-950 to-slate-900 text-slate-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        {/* Success/Error Messages */}
        {error && (
          <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-4">{error}</div>
        )}

        {successMessage && (
          <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-500 text-sm mb-4">
            {successMessage}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-amber-500/10 text-amber-500 border-r-2 border-amber-500"
                            : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    )
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                {/* Dashboard Settings */}
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Dashboard Preferences</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Default Time Period</label>
                          <select
                            value={defaultTimePeriod}
                            onChange={(e) => setDefaultTimePeriod(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2"
                          >
                            <option value="1d">1 Day</option>
                            <option value="7d">7 Days</option>
                            <option value="30d">30 Days</option>
                            <option value="90d">90 Days</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Max Stocks to Display</label>
                          <Input
                            type="number"
                            min="5"
                            max="50"
                            value={maxStocksDisplay}
                            onChange={(e) => setMaxStocksDisplay(Number.parseInt(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Auto Refresh (seconds)</label>
                          <select
                            value={autoRefreshInterval}
                            onChange={(e) => setAutoRefreshInterval(Number.parseInt(e.target.value))}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2"
                          >
                            <option value={15}>15 seconds</option>
                            <option value={30}>30 seconds</option>
                            <option value={60}>1 minute</option>
                            <option value={300}>5 minutes</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Default Chart Type</label>
                          <select
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2"
                          >
                            <option value="line">Line Chart</option>
                            <option value="bar">Bar Chart</option>
                            <option value="area">Area Chart</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Signal Settings */}
                {activeTab === "signals" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Signal Configuration</h2>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Signal Sensitivity</label>
                          <select
                            value={signalSensitivity}
                            onChange={(e) => setSignalSensitivity(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2"
                          >
                            <option value="low">Low (Conservative)</option>
                            <option value="medium">Medium (Balanced)</option>
                            <option value="high">High (Aggressive)</option>
                          </select>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">Enable Signal Sources</h3>

                          <div className="flex items-center justify-between">
                            <span>Google Trends Signals</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={enableGoogleTrends}
                                onChange={(e) => setEnableGoogleTrends(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>Twitter Signals</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={enableTwitterSignals}
                                onChange={(e) => setEnableTwitterSignals(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <span>News Signals</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={enableNewsSignals}
                                onChange={(e) => setEnableNewsSignals(e.target.checked)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                            </label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Alert Threshold (%)</label>
                          <Input
                            type="number"
                            min="5"
                            max="50"
                            value={alertThreshold}
                            onChange={(e) => setAlertThreshold(Number.parseInt(e.target.value))}
                            className="bg-slate-800 border-slate-700"
                          />
                          <p className="text-xs text-slate-400">
                            Trigger alerts when sentiment changes by this percentage
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">Email Notifications</span>
                            <p className="text-sm text-slate-400">Receive important updates via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={emailNotifications}
                              onChange={(e) => setEmailNotifications(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">Daily Summary</span>
                            <p className="text-sm text-slate-400">Get a daily digest of market sentiment</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dailySummary}
                              onChange={(e) => setDailySummary(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">Portfolio Alerts</span>
                            <p className="text-sm text-slate-400">Notifications for significant portfolio changes</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={portfolioAlerts}
                              onChange={(e) => setPortfolioAlerts(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium">Sentiment Alerts</span>
                            <p className="text-sm text-slate-400">Alerts for major sentiment shifts</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={sentimentAlerts}
                              onChange={(e) => setSentimentAlerts(e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Settings */}
                {activeTab === "performance" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Performance Configuration</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Benchmark Index</label>
                          <select
                            value={benchmarkIndex}
                            onChange={(e) => setBenchmarkIndex(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2"
                          >
                            <option value="SPY">S&P 500 (SPY)</option>
                            <option value="QQQ">NASDAQ (QQQ)</option>
                            <option value="DIA">Dow Jones (DIA)</option>
                            <option value="VTI">Total Stock Market (VTI)</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Risk Tolerance</label>
                          <select
                            value={riskTolerance}
                            onChange={(e) => setRiskTolerance(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2"
                          >
                            <option value="conservative">Conservative</option>
                            <option value="moderate">Moderate</option>
                            <option value="aggressive">Aggressive</option>
                          </select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium">Performance Calculation Method</label>
                          <select
                            value={performanceCalculation}
                            onChange={(e) => setPerformanceCalculation(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2"
                          >
                            <option value="time-weighted">Time-Weighted Return</option>
                            <option value="money-weighted">Money-Weighted Return</option>
                            <option value="simple">Simple Return</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === "appearance" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Appearance & Theme</h2>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Theme</label>
                          <select
                            value={theme}
                            onChange={(e) => setTheme(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2"
                          >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="auto">Auto (System)</option>
                          </select>
                        </div>

                        <div className="p-4 bg-slate-800 rounded-md">
                          <h3 className="font-medium mb-2">Color Preview</h3>
                          <div className="flex gap-2">
                            <div className="w-8 h-8 bg-amber-500 rounded"></div>
                            <div className="w-8 h-8 bg-green-500 rounded"></div>
                            <div className="w-8 h-8 bg-red-500 rounded"></div>
                            <div className="w-8 h-8 bg-blue-500 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Security & Privacy</h2>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800 rounded-md">
                          <h3 className="font-medium mb-2">Account Information</h3>
                          <p className="text-sm text-slate-400 mb-2">Email: {user.email}</p>
                          <p className="text-sm text-slate-400">
                            Account created: {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-md">
                          <div>
                            <span className="font-medium">Change Password</span>
                            <p className="text-sm text-slate-400">Update your account password</p>
                          </div>
                          <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                            Change Password
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-800 rounded-md">
                          <div>
                            <span className="font-medium">Export Data</span>
                            <p className="text-sm text-slate-400">Download your account data</p>
                          </div>
                          <Button variant="outline" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                            Export Data
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-red-900/20 border border-red-500/20 rounded-md">
                          <div>
                            <span className="font-medium text-red-400">Delete Account</span>
                            <p className="text-sm text-slate-400">Permanently delete your account and all data</p>
                          </div>
                          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="flex justify-end pt-6 border-t border-slate-800">
                  <Button
                    onClick={saveSettings}
                    disabled={isLoading}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
