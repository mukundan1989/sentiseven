"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

interface TwitterSignal {
  date: string;
  comp_symbol: string;
  analyzed_tweets: number;
  sentiment_score: number;
  sentiment: string;
  entry_price: number;
}

const TwitterSignalsPage: React.FC = () => {
  const [twitterData, setTwitterData] = useState<TwitterSignal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchTwitterSignals = async () => {
      try {
        const response = await axios.get("/api/twitter-signals");
        setTwitterData(response.data);
      } catch (error) {
        console.error("Error fetching Twitter signals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTwitterSignals();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-white text-2xl font-bold mb-4">X (Twitter) Signals</h1>

      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-white border border-gray-700">
            <thead className="text-xs uppercase bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Analyzed Tweets</th>
                <th className="px-4 py-2">Sentiment Score</th>
                <th className="px-4 py-2">Sentiment</th>
                <th className="px-4 py-2">Entry Price</th>
              </tr>
            </thead>
            <tbody>
              {twitterData.map((signal, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-900">
                  <td className="px-4 py-2">{signal.date}</td>
                  <td className="px-4 py-2">{signal.comp_symbol}</td>
                  <td className="px-4 py-2">{signal.analyzed_tweets}</td>
                  <td className="px-4 py-2">{signal.sentiment_score}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                        signal.sentiment.toLowerCase() === "positive"
                          ? "bg-green-600"
                          : signal.sentiment.toLowerCase() === "negative"
                          ? "bg-red-600"
                          : "bg-gray-500"
                      }`}
                    >
                      {signal.sentiment}
                    </span>
                  </td>
                  <td className="px-4 py-2">{signal.entry_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TwitterSignalsPage;
