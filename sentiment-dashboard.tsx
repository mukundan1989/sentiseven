import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Positive", value: 4000 },
  { name: "Negative", value: 3000 },
  { name: "Neutral", value: 2000 },
]

const SentimentDashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Sentiment Analysis Dashboard</h1>
        </div>
        <p className="text-gray-500">Overview of sentiment analysis results.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Overall Sentiment</h2>
            <p className="text-sm text-gray-500">Distribution of sentiment across all data.</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Positive Sentiment</h2>
            <p className="text-sm text-gray-500">Detailed view of positive sentiment.</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500 text-center">40%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Negative Sentiment</h2>
            <p className="text-sm text-gray-500">Detailed view of negative sentiment.</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500 text-center">30%</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {/* Add recent activity feed or data table here */}
        <p>No recent activity to display.</p>
      </section>
    </div>
  )
}

export default SentimentDashboard
