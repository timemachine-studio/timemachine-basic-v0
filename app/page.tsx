"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import ChatHeader from "@/components/chat-header"
import ChatMessage from "@/components/chat-message"
import ChatInputAnimated from "@/components/chat-input-animated"
import TypingIndicator from "@/components/typing-indicator"

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Welcome to TimeMachine! I'm your AI guide through history and time travel concepts. Ask me about historical events, figures, timelines, or request creative content like poems, stories, or code related to time travel and history.",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [previousMessagesLength, setPreviousMessagesLength] = useState(messages.length)
  const [isUserLastMessage, setIsUserLastMessage] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Smart scroll logic
  useEffect(() => {
    // Check if a new message was added
    if (messages.length !== previousMessagesLength) {
      // Determine if the last message was from the user
      const lastMessage = messages[messages.length - 1]
      const isUser = lastMessage?.role === "user"

      setIsUserLastMessage(isUser)

      // If the last message is from the user, scroll to it immediately
      if (isUser && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }

      setPreviousMessagesLength(messages.length)
    } else if (isUserLastMessage && !isLoading) {
      // When AI response is complete (isLoading changes from true to false)
      // and the previous message was from the user, scroll to show the AI response
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        setIsUserLastMessage(false)
      }, 100)
    }
  }, [messages, isLoading, previousMessagesLength, isUserLastMessage])

  // Handle initial scroll position
  useEffect(() => {
    if (mounted && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <main className="flex flex-col h-screen bg-white relative overflow-hidden">
      {/* Colorful glows */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      <ChatHeader />

      {/* Add more padding at the top to ensure scrollability */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pt-32 px-6 pb-20 space-y-8 relative z-10">
        {/* Add an empty div at the top for extra padding */}
        <div className="h-8"></div>

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Show typing indicator when loading */}
        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Floating input with glassmorphism effect */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/40 backdrop-blur-md rounded-full shadow-sm border border-white/20 p-1">
            <ChatInputAnimated
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
