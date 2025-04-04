'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function NewsSignalsPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('/api/news-signals')
      .then(res => setData(res.data))
      .catch(err => setError('Error loading News signals'));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-center gap-4">
        <Image
          src="https://raw.githubusercontent.com/mukundan1989/stock-signals-app/refs/heads/main/images/news-icon.png"
          alt="News Logo"
          width={60}
          height={60}
          className="bg-black p-2 rounded-md"
        />
        <h1 className="text-3xl font-bold text-center">News Signals</h1>
      </div>
      <p className="text-center text-muted-foreground">View the latest News sentiment signals for each stock.</p>

      {error && <p className="text-red-500">{error}</p>}

      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-center border-spacing-y-2 border-separate">
            <thead>
              <tr className="bg-black text-white">
                <th className="px-4 py-2 rounded-tl-2xl rounded-bl-2xl">Date</th>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Articles</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Sentiment</th>
                <th className="px-4 py-2 rounded-tr-2xl rounded-br-2xl">Entry Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row: any, idx) => (
                <tr key={idx} className="bg-[#161616] text-white hover:bg-black">
                  <td className="px-4 py-2 rounded-l-xl">{row.date}</td>
                  <td className="px-4 py-2">{row.comp_symbol}</td>
                  <td className="px-4 py-2">{row.analyzed_articles}</td>
                  <td className="px-4 py-2">{row.sentiment_score}</td>
                  <td className="px-4 py-2">
                    <span className={`px-3 py-1 rounded-full font-semibold ${row.sentiment.toLowerCase() === 'positive' ? 'bg-green-600' : row.sentiment.toLowerCase() === 'negative' ? 'bg-red-600' : 'bg-gray-600'}`}>
                      {row.sentiment}
                    </span>
                  </td>
                  <td className="px-4 py-2 rounded-r-xl">{row.entry_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !error && (
        <p className="text-center text-gray-400">No News signals found.</p>
      )}
    </div>
  );
}
