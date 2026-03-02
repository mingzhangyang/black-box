import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe } from 'lucide-react';
import Footer from './Footer';
import { TRANSLATIONS, PERSONAS, MAX_INPUT_LENGTH } from './constants';
import type { Lang, BoxState } from './constants';
import { useParallax } from './hooks/useParallax';
import ParallaxBackground from './components/ParallaxBackground';
import HeroHeader from './components/HeroHeader';
import InputBox from './components/InputBox';
import ProcessingBox from './components/ProcessingBox';
import ResultBox from './components/ResultBox';

export default function App() {
  const [lang, setLang] = useState<Lang>(() =>
    navigator.language.startsWith('zh') ? 'zh' : 'en'
  );
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isError, setIsError] = useState(false);
  const [currentPersona, setCurrentPersona] = useState(PERSONAS[0]);
  const [boxState, setBoxState] = useState<BoxState>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [shareUrl, setShareUrl] = useState('');

  const tryAnotherRef = useRef<HTMLButtonElement>(null);
  const t = TRANSLATIONS[lang];

  const { backgroundX, backgroundY, boxRotateX, boxRotateY, orbX, orbY } = useParallax();

  useEffect(() => {
    document.title = lang === 'zh'
      ? '神秘黑箱 — 把你的想法丢进去'
      : 'The Black Box — Drop Your Thoughts In';
    document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
  }, [lang]);

  // Load shared result from URL on mount
  useEffect(() => {
    const match = window.location.pathname.match(/^\/s\/([A-Za-z0-9]{8})$/);
    if (!match) return;
    const shareId = match[1];
    setBoxState('processing');
    fetch(`/api/share/${shareId}`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then((data: { input: string; output: string; personaId: string }) => {
        const persona = PERSONAS.find(p => p.id === data.personaId) ?? PERSONAS[0];
        setInput(data.input);
        setOutput(data.output);
        setCurrentPersona(persona);
        setBoxState('revealed');
      })
      .catch(() => setBoxState('idle'));
  }, []);

  // Move focus to "Try another" after reveal animation completes
  useEffect(() => {
    if (boxState === 'revealed') {
      const timer = setTimeout(() => tryAnotherRef.current?.focus(), 1200);
      return () => clearTimeout(timer);
    }
  }, [boxState]);

  const handleProcess = async () => {
    if (!input.trim()) return;

    let nextPersona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    while (nextPersona.id === currentPersona.id && PERSONAS.length > 1) {
      nextPersona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    }

    setCurrentPersona(nextPersona);
    setIsError(false);
    setBoxState('processing');
    setOutput('');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const [res] = await Promise.all([
        fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input, personaId: nextPersona.id }),
          signal: controller.signal,
        }),
        new Promise(resolve => setTimeout(resolve, 2000)),
      ]);

      if (!res.ok) {
        setIsError(true);
        setOutput(t.error);
        setBoxState('revealed');
        return;
      }

      const data = await res.json() as { text?: string; error?: string };
      if (data.error) {
        setIsError(true);
        setOutput(t.error);
      } else {
        setOutput(data.text || t.silent);
      }
      setBoxState('revealed');
    } catch (err) {
      console.error('Error generating content:', err);
      setIsError(true);
      setOutput(t.error);
      setBoxState('revealed');
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleShare = async () => {
    if (shareStatus === 'loading') return;
    setShareStatus('loading');
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, output, personaId: currentPersona.id }),
      });
      if (!res.ok) throw new Error();
      const { id } = await res.json() as { id: string };
      const url = `${window.location.origin}/s/${id}`;
      await navigator.clipboard.writeText(url);
      history.replaceState(null, '', `/s/${id}`);
      setShareUrl(url);
      setShareStatus('idle');
    } catch {
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const handleReset = () => {
    setBoxState('idle');
    setOutput('');
    setShareStatus('idle');
    setShareUrl('');
    if (window.location.pathname !== '/') {
      history.pushState(null, '', '/');
    }
    // Input is preserved so users can retry or edit without retyping
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 relative overflow-hidden">

      <ParallaxBackground
        backgroundX={backgroundX}
        backgroundY={backgroundY}
        orbX={orbX}
        orbY={orbY}
      />

      {/* Language Toggle — in document flow to avoid overlap on mobile */}
      <div className="flex justify-end px-4 pt-4 md:px-6 md:pt-6 z-50 relative">
        <button
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          aria-label={lang === 'en' ? 'Switch to Chinese' : 'Switch to English'}
          className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-zinc-300 px-3 py-2 md:px-4 md:py-2 rounded-full hover:text-white hover:bg-zinc-800 transition-colors text-xs md:text-sm font-medium shadow-lg"
        >
          <Globe size={16} />
          {lang === 'en' ? '中文' : 'English'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 sm:px-6 sm:pb-6 md:px-8 md:pb-8">
        <div className="max-w-2xl w-full flex flex-col items-center z-10">

          <AnimatePresence mode="wait">
            {boxState === 'idle' && (
              <motion.div
                key="hero-header"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden w-full"
              >
                <HeroHeader title={t.title} subtitle={t.subtitle} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full relative" style={{ perspective: '1200px' }}>
            <AnimatePresence mode="wait">
              {boxState === 'idle' && (
                <InputBox
                  key="input-box"
                  input={input}
                  onChange={setInput}
                  onSubmit={handleProcess}
                  placeholder={t.placeholder}
                  dropBtn={t.dropBtn}
                  maxLength={MAX_INPUT_LENGTH}
                  rotateX={boxRotateX}
                  rotateY={boxRotateY}
                />
              )}
              {boxState === 'processing' && (
                <ProcessingBox
                  key="processing-box"
                  processingText={currentPersona.processingText[lang]}
                  lang={lang}
                />
              )}
              {boxState === 'revealed' && (
                <ResultBox
                  key="revealed-box"
                  output={output}
                  isError={isError}
                  t={t}
                  onReset={handleReset}
                  tryAnotherRef={tryAnotherRef}
                  shareUrl={shareUrl}
                  onShare={handleShare}
                  shareStatus={shareStatus}
                />
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {boxState === 'idle' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 md:mt-12 text-zinc-500 text-xs md:text-sm font-mono text-center max-w-lg px-4"
              >
                {t.warning}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
