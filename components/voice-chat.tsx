"use client"

import { useRef, useEffect, useState } from "react"
import { Mic, Square, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import AudioWave from "@/components/audio-wave"

interface VoiceChatProps {
  onTranscript: (text: string) => void
  onSpeakResponse: (speakFunction: (text: string) => Promise<void>) => void
  isProcessing: boolean
  onStatusChange?: (status: "idle" | "listening" | "processing" | "speaking") => void
}

export default function VoiceChat({ onTranscript, onSpeakResponse, isProcessing, onStatusChange }: VoiceChatProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeakerActive, setIsSpeakerActive] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if browser supports SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (!SpeechRecognition) {
        setError("Speech recognition not supported in this browser")
        return
      }

      try {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript
          console.log("Recognized text:", transcript)
          if (transcript) {
            onTranscript(transcript)
          }
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error)
          setError(`Recognition error: ${event.error}`)
          setIsListening(false)
          onStatusChange?.("idle")
        }

        recognition.onend = () => {
          setIsListening(false)
          onStatusChange?.("idle")
        }

        recognitionRef.current = recognition
      } catch (err) {
        console.error("Error initializing speech recognition:", err)
        setError("Failed to initialize speech recognition")
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          console.error("Error stopping recognition on unmount:", e)
        }
      }
    }
  }, [onTranscript, onStatusChange])

  // Start/stop listening
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not available")
      return
    }

    if (isListening) {
      try {
        recognitionRef.current.stop()
        setIsListening(false)
        onStatusChange?.("idle")
      } catch (err) {
        console.error("Error stopping recognition:", err)
      }
    } else {
      setError(null)
      try {
        recognitionRef.current.start()
        setIsListening(true)
        onStatusChange?.("listening")
      } catch (err) {
        console.error("Error starting recognition:", err)
        setError(`Failed to start listening: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  // Web Speech API for text-to-speech
  const speakWithWebSpeech = async (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!("speechSynthesis" in window)) {
        console.error("Web Speech API not supported")
        setError("Speech synthesis not supported in this browser")
        resolve()
        return
      }

      if (!isSpeakerActive) {
        resolve()
        return
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      setIsPlaying(true)
      onStatusChange?.("speaking")

      const utterance = new SpeechSynthesisUtterance(text)

      // Set voice properties
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Try to get a good voice
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find(
        (voice) =>
          voice.name.includes("Google") ||
          voice.name.includes("Natural") ||
          voice.name.includes("Female") ||
          voice.name.includes("Samantha") ||
          voice.name.includes("Karen"),
      )

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.onend = () => {
        setIsPlaying(false)
        onStatusChange?.("idle")
        resolve()
      }

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event)
        setIsPlaying(false)
        onStatusChange?.("idle")
        setError("Speech synthesis failed")
        resolve()
      }

      window.speechSynthesis.speak(utterance)
    })
  }

  // Toggle speaker
  const toggleSpeaker = () => {
    setIsSpeakerActive(!isSpeakerActive)
    if (isSpeakerActive) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }
  }

  // Set up the speak function for the parent component
  useEffect(() => {
    onSpeakResponse(speakWithWebSpeech)
  }, [onSpeakResponse, isSpeakerActive])

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current && isListening) {
        try {
          recognitionRef.current.abort()
        } catch (e) {
          console.error("Error stopping recognition on unmount:", e)
        }
      }
      window.speechSynthesis.cancel()
    }
  }, [isListening])

  return (
    <div className="flex items-center space-x-4 relative">
      {/* Microphone button */}
      <div className="relative">
        <Button
          onClick={toggleListening}
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full relative",
            isListening
              ? "bg-red-500/80 hover:bg-red-400/80 text-white"
              : "bg-cyan-500/80 hover:bg-cyan-400/80 text-white",
            isProcessing && "opacity-50 cursor-not-allowed",
          )}
          disabled={isProcessing}
        >
          {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>

        {/* Listening indicator */}
        {isListening && <span className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-red-500 animate-pulse" />}
      </div>

      {/* Speaker button */}
      <div className="relative">
        <Button
          onClick={toggleSpeaker}
          size="icon"
          className={cn(
            "h-10 w-10 rounded-full",
            isSpeakerActive
              ? "bg-purple-500/80 hover:bg-purple-400/80 text-white"
              : "bg-gray-700/80 hover:bg-gray-600/80 text-gray-300",
            isProcessing && "opacity-50 cursor-not-allowed",
          )}
          disabled={isProcessing}
        >
          {isPlaying ? (
            <Volume2 className="h-4 w-4 animate-pulse" />
          ) : isSpeakerActive ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
        </Button>

        {/* Audio wave animation */}
        {isSpeakerActive && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-none">
            <AudioWave isActive={isPlaying} color="#8b5cf6" />
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="absolute -bottom-12 left-0 right-0 text-red-400 text-xs text-center bg-gray-900/80 backdrop-blur-sm p-1 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}
