import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useHoldNumber } from '../hooks/useHoldNumber';

export default function QuantityInput({ value, onChange }: { value: number; onChange: (v: number) => void; }) {
  const { value: v, setValue, start, stop } = useHoldNumber(value, { min: 1, step: 1, interval: 120 });

  useEffect(() => {
    setValue(Math.max(1, value));
  }, [value]);

  useEffect(() => {
    if (v !== value) onChange(v);
  }, [v]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white p-1 shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
      <motion.button
        type="button"
        onMouseDown={() => start(-1)}
        onTouchStart={() => start(-1)}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchEnd={stop}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:border-black/20 hover:bg-black/5"
      >
        <span className="sr-only">Menos</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </motion.button>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={v}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, '');
          setValue(raw === '' ? 1 : Number(raw));
        }}
        className="w-10 border-x border-black/10 bg-white py-1 text-center text-sm font-medium text-black outline-none"
      />

      <motion.button
        type="button"
        onMouseDown={() => start(1)}
        onTouchStart={() => start(1)}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchEnd={stop}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-black/10 bg-white text-black transition hover:border-black/20 hover:bg-black/5"
      >
        <span className="sr-only">Más</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </motion.button>
    </div>
  );
}
