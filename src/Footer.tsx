type Lang = 'en' | 'zh';

const T = {
  en: { privacy: 'Privacy Policy', copy: `© ${new Date().getFullYear()} The Black Box` },
  zh: { privacy: '隐私政策', copy: `© ${new Date().getFullYear()} 神秘黑箱` },
};

export default function Footer({ lang }: { lang: Lang }) {
  const t = T[lang];
  return (
    <footer className="z-50 relative border-t border-zinc-800/50 px-4 py-4 md:px-6 flex items-center justify-between">
      <span className="text-zinc-600 text-xs md:text-sm">{t.copy}</span>
      <a
        href="/privacy"
        className="text-zinc-600 hover:text-zinc-400 transition-colors text-xs md:text-sm"
      >
        {t.privacy}
      </a>
    </footer>
  );
}
