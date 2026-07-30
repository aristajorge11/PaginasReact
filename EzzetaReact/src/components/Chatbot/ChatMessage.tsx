import { motion } from "framer-motion";
import type { ChatMessage as ChatMessageType } from "./chatbotResponses";
import { Bot, User } from "lucide-react";

interface Props {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: Props) {
  const isBot = message.sender === "bot";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex max-w-[85%] gap-2 ${
          isBot ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-full ${
            isBot
              ? "bg-red-600 text-white"
              : "bg-white text-black"
          }`}
        >
          {isBot ? <Bot size={18} /> : <User size={18} />}
        </div>

        <div
          className={`rounded-2xl px-4 py-3 shadow-md ${
            isBot
              ? "bg-neutral-900 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <p className="whitespace-pre-line text-sm leading-relaxed">
            {message.text}
          </p>

          <p
            className={`mt-2 text-right text-[11px] ${
              isBot ? "text-white/50" : "text-white/70"
            }`}
          >
            {message.date}
          </p>
        </div>
      </div>
    </motion.div>
  );
}