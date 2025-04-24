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
    "Explain me rocket science...",
    "Let's possibly cure cancer...",
    "Will AI rule the world one day?",
    "We support Palestine!",
    "Are you better than ChatGPT?...",
    "How to look good in photos",
    "How to study night before exam?",
    "Explore the timeline and universe...",
  ]

  // Wrap the handleSubmit to prevent auto-scrolling
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Call the original handleSubmit without triggering auto-scroll
    handleSubmit(e)
  }

  return (
    <PlaceholdersAndVanishInput placeholders={historyPlaceholders} onChange={handleInputChange} onSubmit={onSubmit} />
  )
}
