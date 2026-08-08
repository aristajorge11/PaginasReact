import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react';

type TypewriterTitleProps<T extends ElementType> = {
  as?: T;
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  once?: boolean;
  caret?: boolean;
  children?: ReactNode;
};

export const TypewriterTitle = <T extends ElementType = 'h1'>({
  as,
  text,
  className = '',
  speed = 0.045,
  delay = 0,
  once = true,
  caret = true,
}: TypewriterTitleProps<T>) => {
  const Component = (as ?? 'h1') as ElementType;
  const containerRef = useRef<HTMLElement | null>(null);
  const hasAnimatedRef = useRef(false);
  const isInView = useInView(containerRef, { once, amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();

  const progress = useMotionValue(0);
  const roundedProgress = useTransform(progress, (value) => Math.round(value));
  const [visibleChars, setVisibleChars] = useState(shouldReduceMotion ? text.length : 0);

  useMotionValueEvent(roundedProgress, 'change', (latest) => {
    const nextValue = Math.min(text.length, Math.max(0, latest));
    setVisibleChars(nextValue);
  });

  useEffect(() => {
    if (!isInView) {
      return undefined;
    }

    if (hasAnimatedRef.current) {
      setVisibleChars(text.length);
      return undefined;
    }

    if (shouldReduceMotion) {
      hasAnimatedRef.current = true;
      setVisibleChars(text.length);
      return undefined;
    }

    progress.set(0);
    const controls = animate(progress, text.length, {
      duration: Math.max(text.length * speed, 0.35),
      delay,
      ease: 'easeOut',
      onComplete: () => {
        hasAnimatedRef.current = true;
      },
    });

    return () => controls.stop();
  }, [delay, isInView, progress, shouldReduceMotion, speed, text.length]);

  const shownText = text.slice(0, visibleChars);
  const style = {
    '--typewriter-caret-state': visibleChars >= text.length ? '0' : '1',
  } as CSSProperties;

  return (
    <Component ref={containerRef} className={className} aria-label={text} style={style}>
      <span>{shownText}</span>
      {caret ? (
        <motion.span
          aria-hidden="true"
          className="typewriter-caret"
          animate={{ opacity: [1, 0.25, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          |
        </motion.span>
      ) : null}
    </Component>
  );
};
