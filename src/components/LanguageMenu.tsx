import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { LANGUAGES } from '../i18n';
import type { Lang } from '../i18n';

interface Props {
  lang: Lang;
  onChange: (lang: Lang) => void;
  buttonLabel: string;
  menuLabel: string;
}

export default function LanguageMenu({ lang, onChange, buttonLabel, menuLabel }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(current => !current)}
        aria-label={menuLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        className="min-h-11 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-zinc-300 px-3 py-2 md:px-4 md:py-2 rounded-full hover:text-white hover:bg-zinc-800 transition-colors text-xs md:text-sm font-medium shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300"
      >
        <Globe size={16} />
        <span>{buttonLabel}</span>
        <ChevronDown size={15} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={menuLabel}
          className="absolute right-0 mt-2 w-44 rounded-2xl border border-zinc-800 bg-zinc-950/95 backdrop-blur-xl shadow-2xl p-2 z-50"
        >
          {LANGUAGES.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={lang === code}
              onClick={() => {
                onChange(code);
                setOpen(false);
              }}
              className="w-full min-h-11 flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm text-left text-zinc-300 hover:bg-zinc-900 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-300"
            >
              <span>{label}</span>
              <span className="w-4 flex justify-center text-zinc-100">
                {lang === code ? <Check size={14} /> : null}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
