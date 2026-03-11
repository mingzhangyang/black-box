import { FOOTER_TRANSLATIONS } from './constants';
import { buildLocalizedPath } from './siteLanguage';
import type { Lang } from './i18n';

export default function Footer({ lang }: { lang: Lang }) {
  const t = FOOTER_TRANSLATIONS[lang];
  return (
    <footer className="z-50 relative border-t border-zinc-800/50 px-4 py-4 md:px-6 flex items-center justify-between">
      <span className="text-zinc-600 text-xs md:text-sm">{t.copy}</span>
      <a
        href={buildLocalizedPath({ lang, page: 'privacy' })}
        className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs md:text-sm"
      >
        {t.privacy}
      </a>
    </footer>
  );
}
