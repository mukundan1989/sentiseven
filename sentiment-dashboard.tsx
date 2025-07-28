const SentimentDashboard = () => {
  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-neuropol mb-6">
            <span className="text_gradient">Advanced Sentiment Analytics</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Make smarter trading decisions with real-time sentiment analysis across multiple data sources
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
              Get Started
            </button>
            <button className="px-8 py-3 border border-white/20 text-foreground rounded-lg font-semibold hover:bg-white/5 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section (Example - Replace with actual features) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
              <p className="text-muted-foreground">Access up-to-the-minute sentiment data from various sources.</p>
            </div>
            <div className="bg-card rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Customizable Dashboards</h3>
              <p className="text-muted-foreground">
                Tailor your dashboard to track the metrics that matter most to you.
              </p>
            </div>
            <div className="bg-card rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Utilize powerful algorithms to gain deeper insights into market sentiment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Example) */}
      <footer className="py-6 text-center text-muted-foreground">
        <p>&copy; 2024 Sentiment Analytics. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default SentimentDashboard
