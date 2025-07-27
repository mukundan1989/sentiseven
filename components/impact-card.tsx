"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

export function ImpactCard({
  title,
  description,
  value,
  comparison,
  icon,
}: {
  title: string
  description: string
  value: string
  comparison: string
  icon: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="glass-morphism border-border/50 shadow-premium h-full hover:shadow-glow-blue transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-6">
          <motion.div
            className="rounded-full bg-gradient-primary p-4 shadow-glow-blue"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-white text-2xl">{icon}</div>
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </div>

          <div className="space-y-2">
            <div className="text-4xl font-bold text-gradient">{value}</div>
            <p className="text-sm text-muted-foreground">{comparison}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
