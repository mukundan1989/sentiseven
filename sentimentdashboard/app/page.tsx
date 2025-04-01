import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const menuItems = [
  { name: "Google Trends Signals", path: "/google-trends" },
  { name: "News Signals", path: "/news-signals" },
  { name: "Gtrend Backtest", path: "/gtrend-backtest" },
  { name: "News Backtest", path: "/news-backtest" },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Stock Signals Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg" onClick={() => router.push(item.path)}>
            <CardContent className="p-4 text-center">
              <h2 className="text-xl font-semibold">{item.name}</h2>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
