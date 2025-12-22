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

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1 font-mono text-sm">
      {messages.map((message, index) => (
        <div key={index} className="text-white whitespace-pre-wrap">
          {message}
        </div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
}

