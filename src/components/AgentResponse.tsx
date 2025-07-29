import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Bot, Check } from "lucide-react";

interface AgentResponseProps {
  response: string;
  isTyping?: boolean;
  className?: string;
}

export const AgentResponse = ({ 
  response, 
  isTyping = false, 
  className 
}: AgentResponseProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!isTyping) {
      setDisplayedText(response);
      return;
    }

    if (currentIndex < response.length) {
      const timer = setTimeout(() => {
        setDisplayedText(response.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 30);

      return () => clearTimeout(timer);
    }
  }, [response, isTyping, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
    setDisplayedText("");
  }, [response]);

  return (
    <div className={cn(
      "p-4 rounded-lg bg-card border border-border",
      "transition-all duration-300",
      className
    )}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-sm font-medium font-mono text-primary">
              Agent Response
            </h4>
            {!isTyping && (
              <Check className="w-3 h-3 text-step-complete" />
            )}
          </div>
          <div className="relative">
            <p className="text-sm text-foreground leading-relaxed font-mono">
              {displayedText}
              {isTyping && currentIndex < response.length && (
                <span className="animate-pulse ml-1 text-primary">|</span>
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Scanning line effect when typing */}
      {isTyping && (
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30 animate-scan-line" />
      )}
    </div>
  );
};