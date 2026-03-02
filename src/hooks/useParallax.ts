import { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

export function useParallax() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const backgroundX = useTransform(smoothMouseX, [-0.5, 0.5], ['-2%', '2%']);
  const backgroundY = useTransform(smoothMouseY, [-0.5, 0.5], ['-2%', '2%']);
  const boxRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const boxRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);
  const orbX = useTransform(smoothMouseX, [-0.5, 0.5], ['-100%', '0%']);
  const orbY = useTransform(smoothMouseY, [-0.5, 0.5], ['-100%', '0%']);

  useEffect(() => {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set((e.clientX / window.innerWidth) - 0.5);
        mouseY.set((e.clientY / window.innerHeight) - 0.5);
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  return { backgroundX, backgroundY, boxRotateX, boxRotateY, orbX, orbY };
}
