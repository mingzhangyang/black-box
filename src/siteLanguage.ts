export const LANGUAGES = [
  { code: 'en', label: 'English', ogLocale: 'en_US' },
  { code: 'zh', label: '中文', ogLocale: 'zh_CN' },
  { code: 'fr', label: 'Français', ogLocale: 'fr_FR' },
  { code: 'es', label: 'Español', ogLocale: 'es_ES' },
  { code: 'ja', label: '日本語', ogLocale: 'ja_JP' },
  { code: 'ko', label: '한국어', ogLocale: 'ko_KR' },
] as const;

export type Lang = typeof LANGUAGES[number]['code'];
export type AppPage = 'home' | 'privacy' | 'share';

export type RouteInfo = {
  lang: Lang;
  page: AppPage;
  shareId?: string;
  isLegacy: boolean;
};

export const DEFAULT_LANG: Lang = 'en';

const LANGUAGE_CODES = new Set<string>(LANGUAGES.map(({ code }) => code));

export function isLang(value: string | null | undefined): value is Lang {
  return value !== null && value !== undefined && LANGUAGE_CODES.has(value);
}

export function detectPreferredLanguage(language: string | undefined): Lang {
  const normalized = language?.toLowerCase() ?? '';

  if (normalized.startsWith('zh')) return 'zh';
  if (normalized.startsWith('fr')) return 'fr';
  if (normalized.startsWith('es')) return 'es';
  if (normalized.startsWith('ja')) return 'ja';
  if (normalized.startsWith('ko')) return 'ko';
  return DEFAULT_LANG;
}

export function parseRoute(pathname: string): RouteInfo | null {
  const normalized = normalizePath(pathname);
  const segments = normalized.split('/').filter(Boolean);

  if (segments.length === 0) {
    return { lang: DEFAULT_LANG, page: 'home', isLegacy: true };
  }

  const [first, second, third] = segments;

  if (isLang(first)) {
    if (segments.length === 1) {
      return { lang: first, page: 'home', isLegacy: false };
    }
    if (segments.length === 2 && second === 'privacy') {
      return { lang: first, page: 'privacy', isLegacy: false };
    }
    if (segments.length === 3 && second === 's' && /^[A-Za-z0-9]{8}$/.test(third)) {
      return { lang: first, page: 'share', shareId: third, isLegacy: false };
    }
    return null;
  }

  if (segments.length === 1 && first === 'privacy') {
    return { lang: DEFAULT_LANG, page: 'privacy', isLegacy: true };
  }
  if (segments.length === 2 && first === 's' && /^[A-Za-z0-9]{8}$/.test(second)) {
    return { lang: DEFAULT_LANG, page: 'share', shareId: second, isLegacy: true };
  }

  return null;
}

export function buildLocalizedPath(route: { lang: Lang; page: AppPage; shareId?: string }): string {
  if (route.page === 'privacy') return `/${route.lang}/privacy`;
  if (route.page === 'share' && route.shareId) return `/${route.lang}/s/${route.shareId}`;
  return `/${route.lang}`;
}

export function normalizePath(pathname: string): string {
  if (pathname === '/') return '/';
  return pathname.replace(/\/+$/, '') || '/';
}

