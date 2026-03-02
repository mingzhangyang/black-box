import type { RefObject } from 'react';
import { motion } from 'motion/react';
import { Sparkles, RefreshCw, Share2 } from 'lucide-react';
import Markdown from 'react-markdown';
import SharePanel from './SharePanel';
import type { Translations } from '../constants';

interface Props {
  output: string;
  isError: boolean;
  t: Translations;
  onReset: () => void;
  tryAnotherRef: RefObject<HTMLButtonElement>;
  shareUrl: string;
  onShare: () => void;
  shareStatus: 'idle' | 'loading' | 'error';
}

export default function ResultBox({ output, isError, t, onReset, tryAnotherRef, shareUrl, onShare, shareStatus }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateX: -30, y: 40, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], type: 'spring', bounce: 0.4 }}
      className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden transform-gpu"
    >
      {/* Flash overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-0 bg-white z-20 pointer-events-none"
      />

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-400 to-transparent opacity-30" />

      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className={`mb-4 md:mb-6 flex items-center gap-2 md:gap-3 text-xs md:text-sm font-mono uppercase tracking-wider ${isError ? 'text-red-400/70' : 'text-zinc-500'}`}
      >
        <Sparkles size={14} className={isError ? 'text-red-400/70' : 'text-zinc-400'} />
        <span>{isError ? t.errorBadge : t.complete}</span>
      </motion.div>

      {/* Output */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="max-w-none"
      >
        <div className="markdown-body text-lg md:text-2xl leading-relaxed text-zinc-200">
          <Markdown>{output}</Markdown>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex flex-col items-center gap-3 mt-8 md:mt-12"
      >
        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
          <motion.button
            ref={tryAnotherRef}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(39, 39, 42, 1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="w-full md:w-auto flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors px-6 py-3.5 md:py-3 rounded-full bg-zinc-800/50 border border-zinc-700/50"
          >
            <RefreshCw size={16} />
            {t.tryAnother}
          </motion.button>

          {!isError && !shareUrl && (
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(39, 39, 42, 1)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onShare}
              disabled={shareStatus === 'loading'}
              className="w-full md:w-auto flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors px-6 py-3.5 md:py-3 rounded-full bg-zinc-800/50 border border-zinc-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Share2 size={16} />
              {shareStatus === 'error' ? t.shareError : t.share}
            </motion.button>
          )}
        </div>

        {!isError && shareUrl && (
          <SharePanel
            shareUrl={shareUrl}
            shareText={t.shareText}
            copyLabel={t.copyLink}
            copiedLabel={t.copied}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
