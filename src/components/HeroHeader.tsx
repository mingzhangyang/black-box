import { motion } from 'motion/react';
import { Box } from 'lucide-react';

interface Props {
  title: string;
  subtitle: string;
}

export default function HeroHeader({ title, subtitle }: Props) {
  return (
    <div className="text-center mb-8 md:mb-12 pt-2">
      <motion.div
        className="inline-flex items-center justify-center p-3 mb-4 md:mb-6 rounded-full bg-zinc-900 border border-zinc-800 shadow-lg"
        animate={{ boxShadow: ['0px 0px 0px rgba(255,255,255,0)', '0px 0px 20px rgba(255,255,255,0.05)', '0px 0px 0px rgba(255,255,255,0)'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Box size={28} className="text-zinc-400 md:w-8 md:h-8" />
      </motion.div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4 text-zinc-100">
        {title}
      </h1>
      <p className="text-zinc-400 text-base md:text-lg max-w-md mx-auto px-4">
        {subtitle}
      </p>
    </div>
  );
}
