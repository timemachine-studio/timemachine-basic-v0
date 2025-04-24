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
      {!isUser && <span className="text-xs font-medium text-gray-300 mb-1 ml-1">TimeMachine</span>}
      <div className={cn("prose max-w-full", isUser ? "text-right" : "text-left")}>
        {isUser ? (
          <ReactMarkdown
            className={cn(
              "prose prose-invert max-w-none",
              "text-gray-300", // User text slightly dimmer
              "prose-headings:text-gray-300 prose-strong:text-gray-300 prose-em:text-gray-300",
              "prose-pre:bg-gray-800 prose-pre:p-2 prose-pre:rounded-md prose-pre:border prose-pre:border-gray-700",
              "prose-code:text-gray-300",
            )}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          // AI response with solid white text
          <div className="text-white font-normal">
            <ReactMarkdown
              className={cn(
                "prose prose-invert max-w-none",
                "!text-white", // Force solid white text for AI responses
                "prose-p:text-white prose-li:text-white prose-ul:text-white prose-ol:text-white",
                "prose-headings:text-white prose-h1:text-white prose-h2:text-white prose-h3:text-white",
                "prose-strong:text-white prose-em:text-white prose-blockquote:text-white",
                "prose-pre:bg-gray-800 prose-pre:p-2 prose-pre:rounded-md prose-pre:border prose-pre:border-gray-700",
                "prose-code:text-white",
              )}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
