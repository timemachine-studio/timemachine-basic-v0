"use client"

import type React from "react"

import type { FormEvent, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { SendIcon, Loader2 } from "lucide-react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}

export default function ChatInput({ input, handleInputChange, handleSubmit, isLoading }: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim()) {
        const form = e.currentTarget.form
        if (form) form.requestSubmit()
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative max-w-screen-lg mx-auto w-full">
      <div className="relative flex items-center">
        <textarea
          className="flex-1 min-h-[50px] max-h-[200px] resize-none rounded-2xl border border-white/20 
                    bg-purple-500/10 backdrop-blur-lg px-4 py-3 pr-12 text-base text-white 
                    placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about history or time travel..."
          rows={1}
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-2 h-8 w-8 rounded-full bg-cyan-500/80 hover:bg-cyan-400/80 backdrop-blur-md text-white border border-cyan-300/30"
          disabled={isLoading || !input.trim()}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendIcon className="h-4 w-4" />}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  )
}
