import type { Message } from "ai"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("max-w-3xl mx-auto", isUser ? "flex flex-col items-end" : "flex flex-col items-start")}>
      {!isUser && <span className="text-xs font-medium text-gray-300 mb-1 ml-1">TimeMachine</span>}
      <div className={cn("max-w-full", isUser ? "text-right" : "text-left")}>
        {isUser ? (
          <div className="text-gray-300">{message.content}</div>
        ) : (
          // AI response with solid white text - using a simpler approach
          <div className="text-white whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  )
}
