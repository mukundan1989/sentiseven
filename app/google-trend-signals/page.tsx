// /app/google-trend-signals/page.js
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function GoogleTrendSignalsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gtrend-signals')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-4">
        <img
          src="https://raw.githubusercontent.com/mukundan1989/stock-signals-app/refs/heads/main/images/gtrend-logo.png"
          alt="Google Trends Logo"
          className="w-14 h-14 bg-black p-1 rounded"
        />
        <h1 className="text-2xl font-bold">Google Trends Signals</h1>
      </div>
      <p className="text-muted-foreground">
        View the latest Google Trends sentiment signals for each stock.
      </p>
      <Card>
        <CardContent className="overflow-auto p-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="animate-spin w-6 h-6" /> Loading...
            </div>
          ) : data.length > 0 ? (
            <table className="w-full text-sm text-center border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-black text-white">
                  <th className="rounded-l-xl p-2">Date</th>
                  <th className="p-2">Company Symbol</th>
                  <th className="p-2">Analyzed Keywords</th>
                  <th className="p-2">Sentiment Score</th>
                  <th className="p-2">Sentiment</th>
                  <th className="rounded-r-xl p-2">Entry Price</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr
                    key={i}
                    className="bg-[#161616] text-white rounded-xl hover:bg-black"
                  >
                    <td className="rounded-l-xl p-2">{row.date}</td>
                    <td className="p-2">{row.comp_symbol}</td>
                    <td className="p-2 whitespace-pre-wrap">{row.analyzed_keywords}</td>
                    <td className="p-2">{row.sentiment_score}</td>
                    <td className="p-2">
                      <span
                        className={`px-3 py-1 rounded-xl font-medium text-black text-xs inline-block
                          ${row.sentiment.toLowerCase() === 'positive'
                            ? 'bg-lime-500'
                            : row.sentiment.toLowerCase() === 'negative'
                            ? 'bg-red-500'
                            : 'bg-gray-500'}
                        `}
                      >
                        {row.sentiment}
                      </span>
                    </td>
                    <td className="rounded-r-xl p-2">{row.entry_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted-foreground">No Google Trends signals found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
