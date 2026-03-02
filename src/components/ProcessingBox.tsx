import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import type { Lang } from '../constants';

interface Props {
  processingText: string;
  lang: Lang;
}

export default function ProcessingBox({ processingText, lang }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -40, rotateX: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)', transition: { duration: 0.4 } }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="w-full h-56 md:h-64 relative flex flex-col items-center justify-center transform-gpu"
    >
      <motion.div
        className="absolute inset-0 bg-zinc-800 rounded-2xl blur-xl"
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0 bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col items-center justify-center shadow-2xl overflow-hidden"
        animate={{ boxShadow: ['0px 0px 0px rgba(255,255,255,0)', '0px 0px 40px rgba(255,255,255,0.05)', '0px 0px 0px rgba(255,255,255,0)'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-zinc-400/30 blur-sm"
          animate={{ y: [0, 220, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
          <Sparkles className="text-zinc-400 mb-4 md:mb-6" size={32} />
        </motion.div>
        <motion.p
          className={`text-base md:text-xl text-zinc-300 font-mono ${lang === 'zh' ? 'tracking-normal' : 'tracking-widest'} text-center px-4 md:px-6`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {processingText}
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
