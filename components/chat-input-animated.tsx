"use client"

import type { FormEvent, ChangeEvent } from "react"
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input"

interface ChatInputAnimatedProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export default function ChatInputAnimated({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputAnimatedProps) {
  const historyPlaceholders = [
    "Ask about Ancient Egypt...",
    "Tell me about the Renaissance...",
    "What happened during World War II?",
    "Write a poem about time travel...",
    "Explain the theory of relativity...",
    "Who was Leonardo da Vinci?",
    "What was life like in medieval times?",
    "Tell me about the Roman Empire...",
  ]

  return (
    <PlaceholdersAndVanishInput
      placeholders={historyPlaceholders}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
    />
  )
}
