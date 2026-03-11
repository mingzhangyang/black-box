import { buildLocalizedPath, detectPreferredLanguage, parseRoute } from './siteLanguage';
import type { Lang } from './siteLanguage';

const LANGUAGE_STORAGE_KEY = 'black-box-language';

export function getInitialLanguage(pathname = window.location.pathname): Lang {
  const route = parseRoute(pathname);
  if (route && !route.isLegacy) return route.lang;

  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'zh' || stored === 'fr' || stored === 'es' || stored === 'ja' || stored === 'ko') {
      return stored;
    }
  } catch {
    // Ignore storage failures and fall back to browser language.
  }

  return detectPreferredLanguage(window.navigator.language);
}

export function persistLanguage(lang: Lang) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // Ignore storage failures so language selection stays functional.
  }
}

export function navigateToLocalizedPage(route: { lang: Lang; page: 'home' | 'privacy' | 'share'; shareId?: string }) {
  const nextPath = buildLocalizedPath(route);
  if (window.location.pathname === nextPath) return;
  window.history.replaceState(null, '', nextPath);
}

export function usesTightTracking(lang: Lang) {
  return lang === 'zh' || lang === 'ja' || lang === 'ko';
}
