import type { Message } from "ai"
import ReactMarkdown from "react-markdown"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("max-w-3xl mx-auto", isUser ? "flex flex-col items-end" : "flex flex-col items-start")}>
      {!isUser && <span className="text-xs font-medium text-gray-500 mb-1 ml-1">TimeMachine</span>}
      <div className={cn("prose max-w-full", isUser ? "text-right" : "text-left")}>
        <ReactMarkdown
          className={cn(
            "prose max-w-none",
            isUser ? "text-gray-800" : "text-gray-900",
            "prose-pre:bg-gray-50 prose-pre:p-2 prose-pre:rounded-md prose-pre:border prose-pre:border-gray-100",
          )}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
