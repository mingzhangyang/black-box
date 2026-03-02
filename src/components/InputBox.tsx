import { motion } from 'motion/react';
import type { MotionValue } from 'motion/react';
import { Inbox } from 'lucide-react';

interface Props {
  input: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder: string;
  dropBtn: string;
  maxLength: number;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
}

export default function InputBox({ input, onChange, onSubmit, placeholder, dropBtn, maxLength, rotateX, rotateY }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 0.8, rotateX: -20, y: 40, filter: 'blur(10px)' }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      style={{ rotateX, rotateY }}
      className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-2xl transform-gpu"
    >
      <textarea
        value={input}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && input.trim()) onSubmit();
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full h-32 md:h-40 bg-transparent text-lg md:text-2xl text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none"
      />
      <div className="flex items-center justify-between mt-4">
        <span className="text-zinc-600 text-xs font-mono">{input.length}/{maxLength}</span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={!input.trim()}
          className="flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 px-6 py-3.5 md:py-3 rounded-full font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {dropBtn}
          <Inbox size={18} className="group-hover:translate-y-0.5 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}
