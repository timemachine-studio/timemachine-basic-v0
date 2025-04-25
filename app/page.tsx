"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { useChat } from "ai/react"
import ChatHeader from "@/components/chat-header"
import ChatMessage from "@/components/chat-message"
import ChatInputAnimated from "@/components/chat-input-animated"
import TypingIndicator from "@/components/typing-indicator"
import VoiceChat from "@/components/voice-chat"
import StatusIndicator from "@/components/status-indicator"
import { motion } from "framer-motion"

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hey there! I'm TimeMachine, your AI assistant from the future. You can chat with me by typing or using your voice - just click the microphone button to start speaking. I can answer your questions about history, time travel, or anything else you're curious about!",
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [lastSpokenMessage, setLastSpokenMessage] = useState<string | null>(null)
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle")
  const speakTextRef = useRef<(text: string) => Promise<void>>(() => Promise.resolve())

  // Handle voice transcript
  const handleTranscript = useCallback(
    (text: string) => {
      if (text && text.trim()) {
        console.log("Received transcript:", text)
        setInput(text)
        setVoiceStatus("processing")

        // Submit the form with the transcript
        const formEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        }) as unknown as React.FormEvent<HTMLFormElement>
        handleSubmit(formEvent)
      }
    },
    [setInput, handleSubmit],
  )

  // Handle speaking the response
  const handleSpeakResponse = useCallback((speakFunction: (text: string) => Promise<void>) => {
    // Store the speak function for later use
    speakTextRef.current = speakFunction
  }, [])

  // Speak the latest message when it arrives
  useEffect(() => {
    const speakLatestMessage = async () => {
      // Find the latest assistant message that hasn't been spoken yet
      const latestMessage = messages.filter((msg) => msg.role === "assistant").pop()

      if (latestMessage && latestMessage.content !== lastSpokenMessage && !isLoading) {
        setVoiceStatus("speaking")
        try {
          await speakTextRef.current(latestMessage.content)
        } catch (err) {
          console.error("Failed to speak message:", err)
        }
        setLastSpokenMessage(latestMessage.content)
        setVoiceStatus("idle")
      }
    }

    speakLatestMessage()
  }, [messages, lastSpokenMessage, isLoading])

  // Add a function to handle voice status changes
  const handleVoiceStatusChange = (status: "idle" | "listening" | "processing" | "speaking") => {
    console.log("Voice status changed to:", status)
    setVoiceStatus(status)
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      const scrollContainer = messagesContainerRef.current
      const scrollHeight = scrollContainer.scrollHeight
      const clientHeight = scrollContainer.clientHeight
      const maxScrollTop = scrollHeight - clientHeight

      // Only auto-scroll if user is already near the bottom
      const isNearBottom = scrollContainer.scrollTop > maxScrollTop - 100
      if (isNearBottom) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [messages])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="flex flex-col h-screen bg-black relative overflow-hidden">
      {/* Animated colorful glows using framer-motion with full screen coverage */}
      <motion.div
        className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"
        animate={{
          x: ["-30%", "100%", "70%", "-50%", "-30%"],
          y: ["-30%", "20%", "100%", "50%", "-30%"],
        }}
        transition={{
          duration: 60,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] bg-cyan-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"
        animate={{
          x: ["100%", "0%", "-70%", "30%", "100%"],
          y: ["0%", "80%", "30%", "-50%", "0%"],
        }}
        transition={{
          duration: 60,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 10,
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] bg-pink-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none"
        animate={{
          x: ["50%", "-70%", "-20%", "80%", "50%"],
          y: ["80%", "40%", "-40%", "10%", "80%"],
        }}
        transition={{
          duration: 60,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "mirror",
          ease: "easeInOut",
          delay: 20,
        }}
      />

      <ChatHeader />

      {/* Add more padding at the top to ensure scrollability */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto pt-40 px-6 pb-28 space-y-8 relative z-10">
        {/* Add an empty div at the top for extra padding */}
        <div className="h-16"></div>

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Show typing indicator when loading */}
        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} className="h-8" />
      </div>

      {/* Floating input with glassmorphism effect */}
      <div className="fixed bottom-6 left-0 right-0 px-4 z-20">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-900/60 backdrop-blur-md rounded-full shadow-sm border border-gray-700/30 p-1">
            <div className="flex items-center">
              <div className="flex-shrink-0 ml-2">
                <VoiceChat
                  onTranscript={handleTranscript}
                  onSpeakResponse={handleSpeakResponse}
                  isProcessing={isLoading}
                  onStatusChange={handleVoiceStatusChange}
                />
              </div>
              <div className="flex-grow">
                <ChatInputAnimated
                  input={input}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add the StatusIndicator component below the chat input */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-2">
        <StatusIndicator status={voiceStatus} className="bg-gray-900/60 backdrop-blur-md px-2 py-1 rounded-full" />
      </div>
    </main>
  )
}
