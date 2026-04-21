'use client';

import { useEffect, useRef, useState, useMemo } from 'react';

interface TerminalLogProps {
  messages: string[];
}

const colorMap: Record<string, string> = {
  blue: "text-blue-400 font-bold",
  amber: "text-amber-400 font-bold",
  emerald: "text-emerald-400 font-bold",
  red: "text-red-500 font-bold",
  green: "text-emerald-400 font-bold",
};

interface MessageSegment {
  text: string;
  colorClass: string;
}

export default function TerminalLog({ messages }: TerminalLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);
  const [activeMessageIndex, setActiveMessageIndex] = useState(0);

  // Auto-scroll when new messages are added or while typing
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeMessageIndex]);

  const handleComplete = () => {
    setActiveMessageIndex((prev) => prev + 1);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm scroll-smooth">
      {messages.map((message, index) => (
        <div key={index} className="text-white whitespace-pre-wrap">
          <TypewriterMessage
            message={message}
            isFinished={index < activeMessageIndex}
            isTyping={index === activeMessageIndex}
            onComplete={handleComplete}
          />
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}

function TypewriterMessage({
  message,
  isFinished,
  isTyping,
  onComplete,
}: {
  message: string;
  isFinished: boolean;
  isTyping: boolean;
  onComplete: () => void;
}) {
  const segments = useMemo(() => {
    const parts = message.split(/(\[#[a-z]+:[^\]]+\])/g);
    return parts.map((part) => {
      const match = part.match(/\[#([a-z]+):([^\]]+)\]/);
      if (match) {
        const [, color, content] = match;
        return { text: content, colorClass: colorMap[color] || "" };
      }
      return { text: part, colorClass: "" };
    });
  }, [message]);

  const totalLength = useMemo(
    () => segments.reduce((acc, s) => acc + s.text.length, 0),
    [segments]
  );
  
  const [visibleChars, setVisibleChars] = useState(isFinished ? totalLength : 0);

  useEffect(() => {
    if (isFinished) {
      setVisibleChars(totalLength);
      return;
    }
    if (!isTyping) {
      return;
    }

    if (visibleChars < totalLength) {
      const char = message[visibleChars];
      // Faster typing for spaces and newlines, slower for punctuation
      const delay = char === ' ' || char === '\n' ? 5 : 15;
      
      const timer = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [visibleChars, totalLength, isFinished, isTyping, onComplete, message]);

  // Render segments up to visibleChars
  let charsProcessed = 0;
  
  return (
    <>
      {segments.map((segment, i) => {
        const startInSegment = Math.max(0, charsProcessed);
        const endInSegment = Math.min(segment.text.length, visibleChars - charsProcessed);
        
        charsProcessed += segment.text.length;
        
        if (endInSegment <= 0) return null;
        
        return (
          <span key={i} className={segment.colorClass}>
            {segment.text.slice(0, endInSegment)}
          </span>
        );
      })}
      {isTyping && <span className="inline-block w-2 h-4 ml-1 bg-white animate-pulse align-middle" />}
    </>
  );
}

