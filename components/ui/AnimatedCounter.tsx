'use client';
// components/ui/AnimatedCounter.tsx
import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export default function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0,
}: AnimatedCounterProps) {
  const [current, setCurrent] = useState(0);
  const container = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration: duration / 1000,
      ease: 'power3.out',
      onUpdate: () => {
        setCurrent(parseFloat(obj.val.toFixed(decimals)));
      },
    });
  }, { scope: container, dependencies: [end, duration, decimals] });

  return (
    <span ref={container} className={className}>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  );
}
