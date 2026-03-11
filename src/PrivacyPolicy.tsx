import { useState, useEffect } from 'react';
import { Box, ArrowLeft } from 'lucide-react';
import Footer from './Footer';
import LanguageMenu from './components/LanguageMenu';
import { PRIVACY_CONTENT } from './privacyContent';
import { navigateToLocalizedPage, persistLanguage } from './i18n';
import { buildLocalizedPath } from './siteLanguage';
import type { Lang } from './siteLanguage';

export default function PrivacyPolicy({ initialLang }: { initialLang: Lang }) {
  const [lang, setLang] = useState(initialLang);

  const t = PRIVACY_CONTENT[lang];

  useEffect(() => {
    document.title = t.pageTitle;
    document.documentElement.lang = lang;
    persistLanguage(lang);
  }, [lang]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
        <a
          href={buildLocalizedPath({ lang, page: 'home' })}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          {t.backHome}
        </a>
        <LanguageMenu
          lang={lang}
          onChange={(nextLang) => {
            navigateToLocalizedPage({ lang: nextLang, page: 'privacy' });
            setLang(nextLang);
          }}
          buttonLabel={t.languageButton}
          menuLabel={t.languageMenuLabel}
        />
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-10 md:px-6 md:py-16 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-2">
          <Box size={20} className="text-zinc-500" />
          <span className="text-zinc-500 text-sm font-mono uppercase tracking-wider">{t.siteName}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-100 mb-2">
          {t.title}
        </h1>
        <p className="text-zinc-600 text-sm mb-10">{t.updated}</p>

        <div className="space-y-8">
          {t.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold text-zinc-200 mb-3">{section.heading}</h2>
              <div className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                {section.body.split(/(\*\*[^*]+\*\*)/).map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="text-zinc-200 font-semibold">{part.slice(2, -2)}</strong>;
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer lang={lang} />
    </div>
  );
}
