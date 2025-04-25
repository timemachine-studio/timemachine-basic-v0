"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StatusIndicatorProps {
  status: "idle" | "listening" | "processing" | "speaking"
  className?: string
}

export default function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const getStatusText = () => {
    switch (status) {
      case "listening":
        return "Listening..."
      case "processing":
        return "Processing..."
      case "speaking":
        return "Speaking..."
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "listening":
        return "bg-cyan-500"
      case "processing":
        return "bg-amber-500"
      case "speaking":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }

  const statusText = getStatusText()

  if (!statusText) return null

  return (
    <div className={cn("flex items-center space-x-2 text-xs", className)}>
      <motion.div
        className={cn("h-2 w-2 rounded-full", getStatusColor())}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />
      <span className="text-gray-300">{statusText}</span>
    </div>
  )
}
