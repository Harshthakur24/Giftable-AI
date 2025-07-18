import * as React from "react";

import { PromptForm } from "@/components/prompt-form";
import { ButtonScrollToBottom } from "@/components/button-scroll-to-bottom";
import { FooterText } from "@/components/footer";
import { useActions, useUIState } from "ai/rsc";
import type { AI } from "@/lib/chat/actions";
import { nanoid } from "nanoid";
import { UserMessage } from "@/components/message";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { PencilLine, PlayCircle } from "lucide-react";

export interface ChatPanelProps {
  input: string;
  setInput: (value: string) => void;
  isAtBottom: boolean;
  scrollToBottom: () => void;
  quickAnswers?: string[];
  onSelectAnswer?: (answer: string) => void;
}

export function ChatPanel({
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  quickAnswers = [],
  onSelectAnswer,
}: ChatPanelProps) {
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  return (
    <div className="fixed inset-x-0 bg-mint-10 bottom-0 w-full duration-300 ease-in-out peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px] dark:from-10%">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="grid gap-4 sm:pb-4">
          {/* Quick Answer Suggestions */}
          {quickAnswers.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 sm:px-0">
              {quickAnswers.map((answer, index) => (
                <Button
                  key={index}
                  theme="neutral"
                  size="sm"
                  onClick={() => onSelectAnswer?.(answer)}
                  className="text-xs bg-mint-100 hover:bg-mint-200 border-mint-300 text-mint-800 rounded-full px-3 py-1"
                >
                  💬 {answer}
                </Button>
              ))}
            </div>
          )}
          <PromptForm input={input} setInput={setInput} />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  );
}
