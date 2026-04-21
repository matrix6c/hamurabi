'use client';

import { useEffect, useRef } from 'react';

interface TerminalLogProps {
  messages: string[];
}

export default function TerminalLog({ messages }: TerminalLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const parseMessage = (text: string) => {
    const parts = text.split(/(\[#[a-z]+:[^\]]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/\[#([a-z]+):([^\]]+)\]/);
      if (match) {
        const [, color, content] = match;
        const colorClass = {
          blue: "text-blue-400 font-bold",
          amber: "text-amber-400 font-bold",
          emerald: "text-emerald-400 font-bold",
        }[color] || "";
        return <span key={i} className={colorClass}>{content}</span>;
      }
      return part;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm">
      {messages.map((message, index) => (
        <div key={index} className="text-white whitespace-pre-wrap">
          {parseMessage(message)}
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}

