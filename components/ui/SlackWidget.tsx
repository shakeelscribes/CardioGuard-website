"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export function SlackWidget() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end">
      <Link
        href="https://join.slack.com/t/shakeelscob/shared_invite/zt-4322dkwtt-IYvOwUdR5A5dtUzFwD6xhQ"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center bg-background border border-border shadow-2xl rounded-full overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-[0_10px_40px_-10px_rgba(0,93,172,0.4)]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: isHovered ? '220px' : '56px',
          height: '56px'
        }}
      >
        <div className="absolute left-0 w-14 h-14 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" fill="currentColor">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.523-2.522v-2.522h2.523zM15.165 17.688a2.527 2.527 0 0 1-2.523-2.523 2.526 2.526 0 0 1 2.523-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
          </svg>
        </div>
        <span 
          className="whitespace-nowrap font-heading font-bold text-sm pl-16 pr-6 opacity-0 transition-opacity duration-300 delay-100"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          Chat with us on Slack
        </span>
      </Link>
    </div>
  );
}
