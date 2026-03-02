import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Sparkles, Send, RefreshCw, Box, Globe } from 'lucide-react';
import Markdown from 'react-markdown';

const TRANSLATIONS = {
  en: {
    title: "The Black Box",
    subtitle: "Drop your thoughts inside. You never know what will come out.",
    placeholder: "Type anything here... a sentence, a complaint, a random thought.",
    dropBtn: "Drop into the Box",
    complete: "Transformation Complete",
    tryAnother: "Try another",
    warning: "Warning: Results may be highly unpredictable. This is just a game for fun, please don't take it seriously.",
    error: "The black box malfunctioned. Please try again.",
    silent: "The box remains silent..."
  },
  zh: {
    title: "神秘黑箱",
    subtitle: "把你的想法丢进去。你永远不知道会出来什么。",
    placeholder: "在这里输入任何内容……一句话、一句抱怨、一个随机的想法。",
    dropBtn: "丢入黑箱",
    complete: "转化完成",
    tryAnother: "再试一次",
    warning: "警告：结果可能极具不可预测性。这只是一个供娱乐的文字游戏，请勿当真。",
    error: "黑箱发生故障，请重试。",
    silent: "黑箱保持沉默……"
  }
};

// Only UI display data lives on the client; instructions are kept server-side
const PERSONAS = [
  { id: 'conspiracy', processingText: { en: 'Uncovering the hidden truth...', zh: '正在揭开隐藏的真相...' } },
  { id: 'cat', processingText: { en: 'Judging you silently...', zh: '正在默默地评判你...' } },
  { id: 'trailer', processingText: { en: 'Adding dramatic explosions...', zh: '正在添加戏剧性的爆炸效果...' } },
  { id: 'robot', processingText: { en: 'Analyzing logical fallacies...', zh: '正在分析逻辑谬误...' } },
  { id: 'bard', processingText: { en: 'Tuning the lute...', zh: '正在调音鲁特琴...' } },
  { id: 'fortune', processingText: { en: 'Gazing into the cloudy crystal ball...', zh: '正在凝视浑浊的水晶球...' } },
  { id: 'creation', processingText: { en: 'Weaving a new reality...', zh: '正在编织新的现实...' } },
  { id: 'deep_analysis', processingText: { en: 'Psychoanalyzing your soul...', zh: '正在对你的灵魂进行精神分析...' } },
  { id: 'reconstruction', processingText: { en: 'Drafting legal paperwork...', zh: '正在起草法律文件...' } },
  { id: 'multiverse', processingText: { en: 'Scanning alternate dimensions...', zh: '正在扫描平行维度...' } },
  { id: 'future_deduction', processingText: { en: 'Calculating the butterfly effect...', zh: '正在计算蝴蝶效应...' } },
  { id: 'noir', processingText: { en: 'Lighting a cheap cigarette...', zh: '正在点燃一根廉价香烟...' } },
  { id: 'alien', processingText: { en: 'Translating human nonsense...', zh: '正在翻译人类的胡言乱语...' } },
  { id: 'zen', processingText: { en: 'Meditating on the void...', zh: '正在虚空中冥想...' } },
];

const MAX_INPUT_LENGTH = 2000;

export default function App() {
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPersona, setCurrentPersona] = useState(PERSONAS[0]);
  const [boxState, setBoxState] = useState<'idle' | 'processing' | 'revealed'>('idle');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const t = TRANSLATIONS[lang];

  // Parallax effect values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const backgroundX = useTransform(smoothMouseX, [-0.5, 0.5], ['-2%', '2%']);
  const backgroundY = useTransform(smoothMouseY, [-0.5, 0.5], ['-2%', '2%']);

  const boxRotateX = useTransform(smoothMouseY, [-0.5, 0.5], [5, -5]);
  const boxRotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-5, 5]);

  // Moved from inline JSX to comply with Rules of Hooks
  const orbX = useTransform(smoothMouseX, [-0.5, 0.5], ['-100%', '0%']);
  const orbY = useTransform(smoothMouseY, [-0.5, 0.5], ['-100%', '0%']);

  useEffect(() => {
    // Only apply mousemove on devices that likely have a mouse (not touch-only)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice) {
      const handleMouseMove = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        mouseX.set(x);
        mouseY.set(y);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const handleProcess = async () => {
    if (!input.trim()) return;

    let nextPersona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    while (nextPersona.id === currentPersona.id && PERSONAS.length > 1) {
      nextPersona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    }

    setCurrentPersona(nextPersona);
    setIsProcessing(true);
    setBoxState('processing');
    setOutput('');

    try {
      // Run the API call and the minimum display delay in parallel
      const [res] = await Promise.all([
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, personaId: nextPersona.id }),
        }),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ]);

      if (!res.ok) {
        setOutput(t.error);
        setBoxState('revealed');
        return;
      }

      const data = await res.json() as { text?: string; error?: string };
      setOutput(data.text || t.silent);
      setBoxState('revealed');
    } catch (error) {
      console.error('Error generating content:', error);
      setOutput(t.error);
      setBoxState('revealed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setBoxState('idle');
    setInput('');
    setOutput('');
    // Removed auto-focus on reset for mobile friendliness
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 font-sans selection:bg-zinc-800 relative overflow-hidden">

      {/* Language Toggle */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-50">
        <button
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-zinc-300 px-3 py-2 md:px-4 md:py-2 rounded-full hover:text-white hover:bg-zinc-800 transition-colors text-xs md:text-sm font-medium shadow-lg"
        >
          <Globe size={16} />
          {lang === 'en' ? '中文' : 'English'}
        </button>
      </div>

      {/* Parallax Background Grid */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ x: backgroundX, y: backgroundY }}
      >
        <div className="absolute inset-0"
             style={{
               backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)',
               backgroundSize: '40px 40px'
             }}
        />
        {/* Glowing orb with subtle breathing animation for mobile where mousemove isn't active */}
        <motion.div
          className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full bg-zinc-800/30 blur-[100px] md:blur-[120px]"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            left: '50%',
            top: '50%',
            x: orbX,
            y: orbY,
          }}
        />
      </motion.div>

      <div className="max-w-2xl w-full flex flex-col items-center z-10 mt-12 md:mt-0">

        <AnimatePresence>
          {boxState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="overflow-hidden w-full"
            >
              <div className="text-center mb-8 md:mb-12 pt-2">
                <motion.div
                  className="inline-flex items-center justify-center p-3 mb-4 md:mb-6 rounded-full bg-zinc-900 border border-zinc-800 shadow-lg"
                  animate={{
                    boxShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 20px rgba(255,255,255,0.05)", "0px 0px 0px rgba(255,255,255,0)"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Box size={28} className="text-zinc-400 md:w-8 md:h-8" />
                </motion.div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 md:mb-4 text-zinc-100">
                  {t.title}
                </h1>
                <p className="text-zinc-400 text-base md:text-lg max-w-md mx-auto px-4">
                  {t.subtitle}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full relative" style={{ perspective: '1200px' }}>
          <AnimatePresence mode="wait">
            {boxState === 'idle' && (
              <motion.div
                key="input-box"
                initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{
                  opacity: 0,
                  scale: 0.8,
                  rotateX: -20,
                  y: 40,
                  filter: "blur(10px)"
                }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                style={{ rotateX: boxRotateX, rotateY: boxRotateY }}
                className="w-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-2xl transform-gpu"
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  maxLength={MAX_INPUT_LENGTH}
                  className="w-full h-32 md:h-40 bg-transparent text-lg md:text-2xl text-zinc-200 placeholder-zinc-600 resize-none focus:outline-none"
                  // Removed autoFocus to prevent keyboard from popping up immediately on mobile
                />
                <div className="flex justify-end mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleProcess}
                    disabled={!input.trim()}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-zinc-100 text-zinc-950 px-6 py-3.5 md:py-3 rounded-full font-medium hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {t.dropBtn}
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {boxState === 'processing' && (
              <motion.div
                key="processing-box"
                initial={{ opacity: 0, scale: 0.8, y: -40, rotateX: 20 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  rotateX: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 1.1,
                  filter: "blur(20px)",
                  transition: { duration: 0.4 }
                }}
                transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                className="w-full h-56 md:h-64 relative flex flex-col items-center justify-center transform-gpu"
              >
                <motion.div
                  className="absolute inset-0 bg-zinc-800 rounded-2xl blur-xl"
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [0.95, 1.05, 0.95]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                <motion.div
                  className="absolute inset-0 bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col items-center justify-center shadow-2xl overflow-hidden"
                  animate={{
                    boxShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 40px rgba(255,255,255,0.05)", "0px 0px 0px rgba(255,255,255,0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute top-0 left-0 w-full h-1 bg-zinc-400/30 blur-sm"
                    animate={{ y: [0, 256, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />

                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="text-zinc-400 mb-4 md:mb-6" size={32} />
                  </motion.div>
                  <motion.p
                    className="text-base md:text-xl text-zinc-300 font-mono tracking-widest text-center px-4 md:px-6"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {currentPersona.processingText[lang]}
                  </motion.p>
                </motion.div>
              </motion.div>
            )}

            {boxState === 'revealed' && (
              <motion.div
                key="revealed-box"
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  rotateX: -30,
                  y: 40,
                  filter: "blur(10px)"
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateX: 0,
                  y: 0,
                  filter: "blur(0px)"
                }}
                transition={{
                  duration: 0.8,
                  ease: [0.23, 1, 0.32, 1],
                  type: "spring",
                  bounce: 0.4
                }}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden transform-gpu"
              >
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0 bg-white z-20 pointer-events-none"
                />

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-400 to-transparent opacity-30" />

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-zinc-500 text-xs md:text-sm font-mono uppercase tracking-wider"
                >
                  <Sparkles size={14} className="text-zinc-400" />
                  <span>{t.complete}</span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="max-w-none"
                >
                  <div className="markdown-body text-lg md:text-2xl leading-relaxed text-zinc-200 font-serif">
                    <Markdown>{output}</Markdown>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="flex justify-center mt-8 md:mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(39, 39, 42, 1)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReset}
                    className="w-full md:w-auto flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors px-6 py-3.5 md:py-3 rounded-full bg-zinc-800/50 border border-zinc-700/50"
                  >
                    <RefreshCw size={16} />
                    {t.tryAnother}
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 md:mt-12 text-zinc-500 text-xs md:text-sm font-mono text-center max-w-lg px-4"
        >
          {t.warning}
        </motion.div>
      </div>
    </div>
  );
}
