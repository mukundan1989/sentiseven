import { TrendingUp, Clock, Activity, Zap, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section - Direct content without extra containers */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Icon Grid */}
              <div className="flex gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Main Heading */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Sentiment Analysis
                  </span>
                  <br />
                  <span className="text-white">Dashboard</span>
                </h1>

                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  Track market sentiment across multiple data sources with AI-powered insights. Make informed investment
                  decisions with real-time sentiment analysis.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sentiment-dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Get Started
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-4 rounded-xl text-lg font-semibold bg-transparent"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Content - Live Sentiment Card */}
            <div className="relative">
              <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                        <Activity className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">Live Sentiment Analysis</h3>
                    </div>

                    {/* Market Confidence */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Market Confidence</span>
                        <span className="text-emerald-400 font-bold">+72%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full"
                          style={{ width: "72%" }}
                        />
                      </div>
                    </div>

                    {/* Sentiment Breakdown */}
                    <div className="grid grid-cols-2 gap-6 pt-4">
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Bullish</span>
                        </div>
                        <div className="text-2xl font-bold text-white">45%</div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
                          <span className="text-red-400 font-semibold">Bearish</span>
                        </div>
                        <div className="text-2xl font-bold text-white">28%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="glass-morphism">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
              {/* Left side - Logo and tagline */}
              <div className="flex items-center gap-3">
                <div className="bg-foreground/30 p-2 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-foreground/70" />
                </div>
                <div>
                  <span className="text-lg font-neuropol text-foreground/70">SentiSeven</span>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Advanced sentiment analysis for smarter trading decisions
                  </p>
                </div>
              </div>

              {/* Right side - Copyright and legal links */}
              <div className="flex flex-col items-end gap-2">
                <p className="text-sm text-muted-foreground">© 2024 SentiSeven. All rights reserved.</p>
                <div className="flex flex-col items-end gap-1">
                  <a href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
