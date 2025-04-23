"use client"

import { motion } from "framer-motion"

export default function TypingIndicator() {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-start">
      <span className="text-xs font-medium text-gray-500 mb-1 ml-1">TimeMachine</span>
      <div className="flex items-center space-x-1 px-1">
        {[0, 1, 2].map((dot) => (
          <motion.div
            key={dot}
            className="w-1.5 h-1.5 bg-gray-400 rounded-full"
            animate={{
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              delay: dot * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  )
}
