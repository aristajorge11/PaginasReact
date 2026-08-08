import { useCallback, useEffect, useRef, useState } from 'react';

export const useHoldNumber = (
  initial: number,
  options?: { min?: number; step?: number; interval?: number }
) => {
  const { min = 1, step = 1, interval = 120 } = options ?? {};
  const [value, setValue] = useState<number>(Math.max(min, initial));
  const timerRef = useRef<number | null>(null);
  const clearRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (clearRef.current) {
      try {
        window.removeEventListener('pointerup', clearRef.current);
        window.removeEventListener('pointercancel', clearRef.current);
      } catch (e) {
        /* ignore */
      }

      clearRef.current = null;
    }
  }, []);

  const start = useCallback(
    (direction: 1 | -1) => {
      setValue((v) => Math.max(min, v + direction * step));

      stop();

      timerRef.current = window.setInterval(() => {
        setValue((v) => Math.max(min, v + direction * step));
      }, interval);

      const clearListeners = () => {
        stop();
      };

      clearRef.current = clearListeners;

      window.addEventListener('pointerup', clearListeners);
      window.addEventListener('pointercancel', clearListeners);
    },
    [interval, min, step, stop],
  );

  useEffect(() => stop, [stop]);

  return { value, setValue, start, stop } as const;
};

export default useHoldNumber;
