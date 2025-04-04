'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

interface TwitterSignal {
  date: string;
  comp_symbol: string;
  analyzed_tweets: number;
  sentiment_score: number;
  sentiment: string;
  entry_price: number;
}

export default function TwitterSignalsPage() {
  const [signals, setSignals] = useState<TwitterSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const res = await axios.get('/api/twitter-signals');
        setSignals(res.data);
      } catch (err: any) {
        setError('Failed to load Twitter Signals.');
      } finally {
        setLoading(false);
      }
    };

    fetchSignals();
  }, []);

  const getSentimentClass = (sentiment: string) => {
    if (sentiment.toLowerCase() === 'positive') return 'bg-green-600 text-white';
    if (sentiment.toLowerCase() === 'negative') return 'bg-red-600 text-white';
    return 'bg-gray-600 text-white';
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <img
          src="https://raw.githubusercontent.com/mukundan1989/stock-signals-app/refs/heads/main/images/twitter-logo.png"
          alt="Twitter Logo"
          className="w-10 h-10"
        />
        <h1 className="text-2xl font-bold">X Signals</h1>
      </div>

      <p className="mb-4 text-gray-300">View the latest Twitter sentiment signals for each stock.</p>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && signals.length === 0 && (
        <p className="text-yellow-500">No Twitter signals found.</p>
      )}

      {!loading && !error && signals.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="bg-black text-white rounded-lg">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Company Symbol</th>
                <th className="px-4 py-2">Analyzed Tweets</th>
                <th className="px-4 py-2">Sentiment Score</th>
                <th className="px-4 py-2">Sentiment</th>
                <th className="px-4 py-2">Entry Price</th>
              </tr>
            </thead>
            <tbody>
              {signals.map((signal, index) => (
                <tr key={index} className="bg-zinc-900 text-white rounded-lg">
                  <td className="px-4 py-2">{signal.date}</td>
                  <td className="px-4 py-2 font-semibold">{signal.comp_symbol}</td>
                  <td className="px-4 py-2 text-center">{signal.analyzed_tweets}</td>
                  <td className="px-4 py-2 text-center">{signal.sentiment_score.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-3 py-1 rounded-full ${getSentimentClass(signal.sentiment)}`}>
                      {signal.sentiment}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">{signal.entry_price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
