import { motion } from 'motion/react';
import type { MotionValue } from 'motion/react';

interface Props {
  backgroundX: MotionValue<string>;
  backgroundY: MotionValue<string>;
  orbX: MotionValue<string>;
  orbY: MotionValue<string>;
}

export default function ParallaxBackground({ backgroundX, backgroundY, orbX, orbY }: Props) {
  return (
    <motion.div
      className="absolute inset-0 z-0 opacity-20 pointer-events-none"
      style={{ x: backgroundX, y: backgroundY }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-zinc-800/30 blur-[100px] md:blur-[120px]"
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{ left: '50%', top: '50%', x: orbX, y: orbY }}
      />
    </motion.div>
  );
}
