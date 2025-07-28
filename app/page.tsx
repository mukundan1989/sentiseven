import { TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-background">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-neuropol text-gradient leading-tight">
              Advanced Sentiment Analytics
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Make smarter trading decisions with real-time sentiment analysis across multiple data sources
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                size="lg"
                className="bg-gradient-primary hover:shadow-glow-blue transition-all duration-300 px-8 py-3 text-lg font-semibold"
              >
                <ArrowRight className="mr-2 h-5 w-5" />
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-border/50 hover:bg-accent/50 px-8 py-3 text-lg font-semibold bg-transparent"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Rest of the page content can go here */}
      <div className="max-w-7xl mx-auto px-6 py-16">{/* You can add other sections here if needed */}</div>

      {/* Footer */}
      <footer className="relative mt-16 border-t border-white/10">
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
