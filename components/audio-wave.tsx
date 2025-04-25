"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface AudioWaveProps {
  isActive: boolean
  color?: string
}

export default function AudioWave({ isActive, color = "#06b6d4" }: AudioWaveProps) {
  const [bars, setBars] = useState<number[]>([])

  useEffect(() => {
    // Generate random heights for the bars
    setBars(Array.from({ length: 5 }, () => Math.random() * 0.7 + 0.3))
  }, [])

  return (
    <div className="flex items-end justify-center gap-[2px] h-4 w-10">
      {bars.map((height, index) => (
        <motion.div
          key={index}
          className="w-[2px] rounded-full"
          style={{ backgroundColor: color }}
          animate={{
            height: isActive
              ? [
                  `${height * 100}%`,
                  `${Math.max(0.2, height - 0.3) * 100}%`,
                  `${Math.min(1, height + 0.3) * 100}%`,
                  `${height * 100}%`,
                ]
              : "20%",
            opacity: isActive ? 1 : 0.5,
          }}
          transition={{
            duration: isActive ? 1.2 : 0.4,
            repeat: isActive ? Number.POSITIVE_INFINITY : 0,
            ease: "easeInOut",
            delay: index * 0.1,
          }}
        />
      ))}
    </div>
  )
}
