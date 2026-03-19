/// <reference types="@cloudflare/workers-types" />
import { buildLocalizedPath, DEFAULT_LANG, detectPreferredLanguage, LANGUAGES, normalizePath, parseRoute } from '../src/siteLanguage';
import type { Lang, RouteInfo } from '../src/siteLanguage';

interface Env {
  ASSETS: { fetch(r: Request): Promise<Response> };
  GEMINI_API_KEY: string;
  GEMINI_MODEL?: string;
  'BLACK-BOX-SHARE': KVNamespace;
}

type ShareData = { input: string; output: string; personaId: string };
type SeoPage = {
  lang: Lang;
  title: string;
  description: string;
  robots: string;
  canonicalUrl: string;
  jsonLd: string;
  fallbackHtml: string;
  noscriptHtml: string;
  alternateLinksHtml: string;
  ogLocale: string;
  ogAlternateLocales: string[];
  xRobotsTag?: string;
};

function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}

const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

const MAX_INPUT_LENGTH = 2000;
const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;
const SEO_IMAGE_PATH = '/og-image.png';
const SEO_LOGO_PATH = '/logo-1024.png';
const SITE_ORIGIN = 'https://black-box.orangely.xyz';
const INDEXABLE_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const HOME_SEO: Record<Lang, { title: string; description: string; fallbackHtml: string; noscriptHtml: string }> = {
  en: {
    title: 'The Black Box — Drop Your Thoughts In',
    description: 'A playful AI text transformer. Drop in a thought, complaint, or random sentence and see what wildly unexpected result comes out.',
    fallbackHtml: '<h1>The Black Box</h1><p>The Black Box is a playful AI text transformer that rewrites your words through absurd personas.</p><p>Drop in a thought, a complaint, or a random sentence and see what unexpectedly comes out.</p>',
    noscriptHtml: '<h1>The Black Box</h1><p>This site needs JavaScript to run the interactive text transformer, but the localized homepage and privacy pages remain crawlable for search engines.</p>',
  },
  zh: {
    title: '神秘黑箱 — 把你的想法丢进去',
    description: '一个充满戏剧性的 AI 文本转换器。把一句话、一个抱怨或一个随机想法丢进去，看看黑箱会吐出什么意想不到的结果。',
    fallbackHtml: '<h1>神秘黑箱</h1><p>神秘黑箱是一款会用荒诞人格改写你文字的 AI 文本游戏。</p><p>丢进去一句话、一句抱怨或一个随想，看看会出现什么离谱结果。</p>',
    noscriptHtml: '<h1>神秘黑箱</h1><p>这个站点的互动功能需要 JavaScript，但本地化首页与隐私政策仍然对搜索引擎可读。</p>',
  },
  fr: {
    title: 'La Boîte Noire — Déposez vos pensées',
    description: 'Un transformateur de texte IA ludique. Déposez une pensée, une plainte ou une phrase au hasard et regardez le résultat inattendu qui en ressort.',
    fallbackHtml: '<h1>La Boîte Noire</h1><p>La Boîte Noire est un transformateur de texte IA ludique qui réécrit vos mots à travers des personnages absurdes.</p><p>Déposez une pensée, une plainte ou une phrase quelconque et voyez ce qui en ressort.</p>',
    noscriptHtml: '<h1>La Boîte Noire</h1><p>JavaScript est nécessaire pour l’expérience interactive, mais les pages localisées restent accessibles aux moteurs de recherche.</p>',
  },
  es: {
    title: 'La Caja Negra — Deja tus pensamientos dentro',
    description: 'Un transformador de texto con IA pensado para jugar. Deja una idea, una queja o una frase cualquiera y descubre el resultado inesperado que sale de la caja.',
    fallbackHtml: '<h1>La Caja Negra</h1><p>La Caja Negra es un transformador de texto con IA que reescribe tus palabras con personalidades absurdas.</p><p>Deja una idea, una queja o una frase al azar y mira qué sale.</p>',
    noscriptHtml: '<h1>La Caja Negra</h1><p>La experiencia interactiva necesita JavaScript, pero las páginas localizadas siguen siendo rastreables por buscadores.</p>',
  },
  ja: {
    title: 'ブラックボックス — 考えを投げ入れてください',
    description: '遊び心のある AI テキスト変換ツールです。思いつきや不満や一文を投げ入れると、予想外の結果が返ってきます。',
    fallbackHtml: '<h1>ブラックボックス</h1><p>ブラックボックスは、奇妙な人格であなたの言葉を書き換える遊び心のある AI テキスト変換ツールです。</p><p>思いつきでも不満でも一文でも、投げ入れて結果を見てください。</p>',
    noscriptHtml: '<h1>ブラックボックス</h1><p>対話機能には JavaScript が必要ですが、各言語ページ自体は検索エンジンから読めます。</p>',
  },
  ko: {
    title: '블랙 박스 — 생각을 던져 넣어 보세요',
    description: '장난스럽게 즐기는 AI 텍스트 변환기입니다. 생각, 불평, 아무 문장이나 넣으면 예상 밖의 결과가 나옵니다.',
    fallbackHtml: '<h1>블랙 박스</h1><p>블랙 박스는 엉뚱한 캐릭터를 통해 당신의 문장을 다시 써 주는 AI 텍스트 변환기입니다.</p><p>생각이든 불평이든 아무 문장이든 넣고 어떤 결과가 나오는지 확인해 보세요.</p>',
    noscriptHtml: '<h1>블랙 박스</h1><p>대화형 기능에는 JavaScript가 필요하지만, 언어별 페이지는 검색 엔진이 읽을 수 있습니다.</p>',
  },
};

const PRIVACY_SEO: Record<Lang, { title: string; description: string; fallbackHtml: string; noscriptHtml: string }> = {
  en: {
    title: 'Privacy Policy — The Black Box',
    description: 'Read how The Black Box handles submitted text, shared links, rate limiting, and third-party services.',
    fallbackHtml: '<h1>Privacy Policy</h1><p>Read how The Black Box handles submitted text, shared links, IP-based rate limiting, and third-party services such as Google Gemini and Cloudflare.</p>',
    noscriptHtml: '<h1>Privacy Policy</h1><p>The privacy policy remains readable without JavaScript.</p>',
  },
  zh: {
    title: '隐私政策 — 神秘黑箱',
    description: '了解神秘黑箱如何处理提交文字、分享链接、基于 IP 的频率限制，以及 Google Gemini 与 Cloudflare 等第三方服务。',
    fallbackHtml: '<h1>隐私政策</h1><p>了解神秘黑箱如何处理提交文字、分享链接、基于 IP 的频率限制，以及 Google Gemini 与 Cloudflare 等第三方服务。</p>',
    noscriptHtml: '<h1>隐私政策</h1><p>隐私政策在未启用 JavaScript 时仍然可阅读。</p>',
  },
  fr: {
    title: 'Politique de confidentialité — La Boîte Noire',
    description: 'Découvrez comment La Boîte Noire traite les textes soumis, les liens partagés, la limitation par IP et les services tiers comme Google Gemini et Cloudflare.',
    fallbackHtml: '<h1>Politique de confidentialité</h1><p>Découvrez comment La Boîte Noire traite les textes soumis, les liens partagés, la limitation par IP et les services tiers comme Google Gemini et Cloudflare.</p>',
    noscriptHtml: '<h1>Politique de confidentialité</h1><p>La politique de confidentialité reste lisible sans JavaScript.</p>',
  },
  es: {
    title: 'Política de privacidad — La Caja Negra',
    description: 'Consulta cómo La Caja Negra gestiona el texto enviado, los enlaces compartidos, el control por IP y servicios de terceros como Google Gemini y Cloudflare.',
    fallbackHtml: '<h1>Política de privacidad</h1><p>Consulta cómo La Caja Negra gestiona el texto enviado, los enlaces compartidos, el control por IP y servicios de terceros como Google Gemini y Cloudflare.</p>',
    noscriptHtml: '<h1>Política de privacidad</h1><p>La política de privacidad sigue siendo legible sin JavaScript.</p>',
  },
  ja: {
    title: 'プライバシーポリシー — ブラックボックス',
    description: 'ブラックボックスが送信された文章、共有リンク、IP ベースの制限、Google Gemini や Cloudflare などの外部サービスをどう扱うかを説明します。',
    fallbackHtml: '<h1>プライバシーポリシー</h1><p>ブラックボックスが送信された文章、共有リンク、IP ベースの制限、Google Gemini や Cloudflare などの外部サービスをどう扱うかを説明します。</p>',
    noscriptHtml: '<h1>プライバシーポリシー</h1><p>JavaScript が無効でもプライバシーポリシーは読めます。</p>',
  },
  ko: {
    title: '개인정보 처리방침 — 블랙 박스',
    description: '블랙 박스가 제출된 텍스트, 공유 링크, IP 기반 제한, Google Gemini 및 Cloudflare 같은 외부 서비스를 어떻게 다루는지 설명합니다.',
    fallbackHtml: '<h1>개인정보 처리방침</h1><p>블랙 박스가 제출된 텍스트, 공유 링크, IP 기반 제한, Google Gemini 및 Cloudflare 같은 외부 서비스를 어떻게 다루는지 설명합니다.</p>',
    noscriptHtml: '<h1>개인정보 처리방침</h1><p>JavaScript 없이도 개인정보 처리방침을 읽을 수 있습니다.</p>',
  },
};

const SHARE_SEO: Record<Lang, { title: string; description: string; fallbackHtml: string; noscriptHtml: string }> = {
  en: {
    title: 'Shared Result — The Black Box',
    description: 'A shared transformation result from The Black Box.',
    fallbackHtml: '<h1>Shared Result</h1><p>This is a shared result from The Black Box. Shared result pages are not indexed by search engines.</p>',
    noscriptHtml: '<h1>Shared Result</h1><p>Shared result pages are intentionally excluded from search indexing.</p>',
  },
  zh: {
    title: '分享结果 — 神秘黑箱',
    description: '来自神秘黑箱的一个分享结果页面。',
    fallbackHtml: '<h1>分享结果</h1><p>这是一个来自神秘黑箱的分享结果页面。该页面不会被搜索引擎收录。</p>',
    noscriptHtml: '<h1>分享结果</h1><p>分享结果页被明确排除在搜索索引之外。</p>',
  },
  fr: {
    title: 'Résultat partagé — La Boîte Noire',
    description: 'Une page de résultat partagé issue de La Boîte Noire.',
    fallbackHtml: '<h1>Résultat partagé</h1><p>Cette page montre un résultat partagé de La Boîte Noire. Elle n’est pas indexée par les moteurs de recherche.</p>',
    noscriptHtml: '<h1>Résultat partagé</h1><p>Les pages de partage sont volontairement exclues de l’indexation.</p>',
  },
  es: {
    title: 'Resultado compartido — La Caja Negra',
    description: 'Una página de resultado compartido generada por La Caja Negra.',
    fallbackHtml: '<h1>Resultado compartido</h1><p>Esta es una página de resultado compartido de La Caja Negra. No se indexa en buscadores.</p>',
    noscriptHtml: '<h1>Resultado compartido</h1><p>Las páginas compartidas están excluidas de la indexación.</p>',
  },
  ja: {
    title: '共有結果 — ブラックボックス',
    description: 'ブラックボックスの共有結果ページです。',
    fallbackHtml: '<h1>共有結果</h1><p>これはブラックボックスの共有結果ページです。検索エンジンには登録されません。</p>',
    noscriptHtml: '<h1>共有結果</h1><p>共有結果ページは検索対象から除外されています。</p>',
  },
  ko: {
    title: '공유 결과 — 블랙 박스',
    description: '블랙 박스에서 생성된 공유 결과 페이지입니다.',
    fallbackHtml: '<h1>공유 결과</h1><p>이 페이지는 블랙 박스의 공유 결과 페이지이며 검색 엔진에 색인되지 않습니다.</p>',
    noscriptHtml: '<h1>공유 결과</h1><p>공유 결과 페이지는 검색 색인에서 제외됩니다.</p>',
  },
};

// In-memory rate limiter. Resets per worker instance; not globally consistent
// across Cloudflare's distributed edge, but sufficient for basic abuse prevention.
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitStore.get(ip) ?? [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_REQUESTS) return true;
  recent.push(now);
  rateLimitStore.set(ip, recent);
  return false;
}

type LanguageMode = 'same' | 'alien' | 'bard';

type PersonaConfig = {
  instruction: string;
  languageMode: LanguageMode;
};

// Persona instructions live server-side only; clients send a personaId, never the instruction text.
const PERSONAS: Record<string, PersonaConfig> = {
  conspiracy: {
    instruction: "You are a paranoid conspiracy theorist. Take the user's input and explain how it's actually proof of a massive, ridiculous global conspiracy involving pigeons, the moon landing, or ancient aliens. Be dramatic, use ALL CAPS occasionally, and sound absolutely convinced of your absurd theory.",
    languageMode: 'same',
  },
  cat: {
    instruction: "You are a highly intelligent, extremely passive-aggressive house cat. Respond to the user's input with disdain, complaining about your empty food bowl and how inferior humans are, while vaguely addressing what they said. Meow occasionally.",
    languageMode: 'same',
  },
  trailer: {
    instruction: "You are a voiceover artist for an epic summer blockbuster movie trailer. Turn the user's mundane input into the plot of a high-stakes, action-packed movie. Start with \"IN A WORLD...\" and make it sound incredibly dramatic and over-the-top.",
    languageMode: 'same',
  },
  robot: {
    instruction: "You are a robot that takes everything completely literally and misunderstands human idioms and emotions. Analyze the user's input in a cold, clinical, and hilariously literal way, pointing out logical flaws and requesting clarification on human nonsense.",
    languageMode: 'same',
  },
  bard: {
    instruction: "You are an overly enthusiastic medieval bard. Turn the user's input into a dramatic, rhyming tavern song or poem. Use old English words like \"thou\", \"hath\", \"alas\", and sing of their mundane input as if it were a legendary quest.",
    languageMode: 'bard',
  },
  fortune: {
    instruction: "You are a terrible fortune teller who gives highly specific, completely useless, and slightly concerning predictions based on the user's input. E.g., \"Because you said this, beware of men named Gary wearing yellow socks next Tuesday.\"",
    languageMode: 'same',
  },
  creation: {
    instruction: "You are a whimsical creator deity. Take the user's input and use it as the seed to create a bizarre, magical new world, creature, or mythological origin story. Be highly imaginative, poetic, and slightly unhinged.",
    languageMode: 'same',
  },
  deep_analysis: {
    instruction: "You are an overly intense psychoanalyst and philosopher. Over-analyze the user's simple input, finding deep, dark subconscious meanings, existential dread, and complex philosophical implications in their mundane words. Sound incredibly academic and serious.",
    languageMode: 'same',
  },
  reconstruction: {
    instruction: "You are a bureaucratic reconstructor. Take the user's input and completely rewrite it as a highly formal, overly complex legal contract, a medical prescription, or an instruction manual for a nuclear reactor. Use absurdly formal jargon and completely miss the original point.",
    languageMode: 'same',
  },
  multiverse: {
    instruction: "You are a multiverse traveler. Describe how the user's input is playing out in three bizarre alternate universes (e.g., a universe where everyone is made of soup, a cyberpunk dystopia ruled by hamsters). Keep each universe description brief but wildly different.",
    languageMode: 'same',
  },
  future_deduction: {
    instruction: "You are a temporal butterfly-effect analyst. Extrapolate how the user's mundane input will inevitably trigger a chain of events leading to a bizarre, catastrophic, or utopian future 1000 years from now. Detail the absurd step-by-step chain of events.",
    languageMode: 'same',
  },
  noir: {
    instruction: "You are a gritty, hardboiled 1940s noir detective. Narrate the user's input as if it's a clue in a depressing, rain-soaked murder mystery. Use lots of metaphors about cheap whiskey, neon lights, and broken dreams. Speak in short, punchy, cynical sentences.",
    languageMode: 'same',
  },
  alien: {
    instruction: "You are an alien anthropologist observing Earth from orbit. Misinterpret the user's input as a bizarre, highly complex human mating ritual, a declaration of war against the sun, or a religious ceremony involving carbohydrates. Use clinical, scientific, but entirely confused language.",
    languageMode: 'alien',
  },
  zen: {
    instruction: "You are a cryptic Zen master. Respond to the user's input with a deeply confusing, paradoxical koan that seems profound but is actually complete nonsense. Refuse to give a straight answer. End with an unanswerable philosophical question.",
    languageMode: 'same',
  },
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);
    const route = parseRoute(pathname);

    if (request.method === 'POST' && url.pathname === '/api/generate') {
      return handleGenerate(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/api/share') {
      return handleCreateShare(request, env);
    }
    if (request.method === 'GET' && url.pathname.startsWith('/api/share/')) {
      return handleGetShare(request, env);
    }
    if (request.method === 'GET' && pathname === '/robots.txt') {
      return handleRobots(url);
    }
    if (request.method === 'GET' && pathname === '/sitemap.xml') {
      return handleSitemap(url);
    }
    if (request.method === 'GET' && route && pathname !== url.pathname) {
      return Response.redirect(new URL(`${pathname}${url.search}`, url.origin).toString(), 301);
    }
    if (request.method === 'GET' && pathname === '/') {
      return redirectToLocalizedRoute(getPreferredRoute(request, { lang: DEFAULT_LANG, page: 'home', isLegacy: true }), url, 302);
    }
    if (request.method === 'GET' && route?.isLegacy) {
      return redirectToLocalizedRoute(getPreferredRoute(request, route), url, 302);
    }

    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.status !== 404) {
      if (route && isHtmlResponse(assetResponse)) {
        return applySeoMetadata(assetResponse, url);
      }
      return assetResponse;
    }

    if (!route) {
      return new Response('Not Found', {
        status: 404,
        headers: {
          'Content-Type': 'text/plain; charset=UTF-8',
          'X-Robots-Tag': 'noindex, nofollow',
        },
      });
    }

    const spaResponse = await env.ASSETS.fetch(new Request(new URL('/', request.url).toString()));
    return applySeoMetadata(spaResponse, new URL(`${pathname}${url.search}`, getSiteOrigin(url)));
  },
};

function isHtmlResponse(response: Response): boolean {
  return response.headers.get('content-type')?.includes('text/html') ?? false;
}

function getSiteOrigin(url: URL): string {
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    return url.origin;
  }
  return SITE_ORIGIN;
}

function getPreferredRoute(request: Request, route: RouteInfo): RouteInfo {
  const acceptLanguage = request.headers.get('Accept-Language') ?? undefined;
  const lang = detectPreferredLanguage(acceptLanguage);
  return {
    ...route,
    lang,
    isLegacy: false,
  };
}

function redirectToLocalizedRoute(route: RouteInfo, url: URL, status: 301 | 302): Response {
  const location = new URL(buildLocalizedPath(route), getSiteOrigin(url)).toString();
  return new Response(null, {
    status,
    headers: {
      Location: location,
      Vary: 'Accept-Language',
    },
  });
}

function getAlternateLinksHtml(route: RouteInfo, origin: string): string {
  const alternates = LANGUAGES.map(({ code }) => {
    const href = new URL(buildLocalizedPath({ lang: code, page: route.page, shareId: route.shareId }), origin).toString();
    return `<link rel="alternate" hreflang="${code}" href="${href}" />`;
  });

  const xDefaultHref = route.page === 'home'
    ? new URL('/', origin).toString()
    : new URL(buildLocalizedPath({ lang: DEFAULT_LANG, page: route.page, shareId: route.shareId }), origin).toString();

  return [...alternates, `<link rel="alternate" hreflang="x-default" href="${xDefaultHref}" />`].join('');
}

function getSeoPage(url: URL): SeoPage {
  const origin = getSiteOrigin(url);
  const route = parseRoute(normalizePath(url.pathname));
  if (!route || route.isLegacy) {
    throw new Error('SEO requested for non-localized route');
  }

  const canonicalUrl = new URL(buildLocalizedPath(route), origin).toString();
  const siteUrl = new URL('/', origin).toString();
  const imageUrl = new URL(SEO_IMAGE_PATH, origin).toString();
  const logoUrl = new URL(SEO_LOGO_PATH, origin).toString();
  const ogLocale = LANGUAGES.find(language => language.code === route.lang)?.ogLocale ?? 'en_US';
  const ogAlternateLocales = LANGUAGES
    .filter(language => language.code !== route.lang)
    .map(language => language.ogLocale);
  const alternateLinksHtml = getAlternateLinksHtml(route, origin);

  if (route.page === 'privacy') {
    const copy = PRIVACY_SEO[route.lang];
    return {
      lang: route.lang,
      title: copy.title,
      description: copy.description,
      robots: INDEXABLE_ROBOTS,
      canonicalUrl,
      fallbackHtml: copy.fallbackHtml,
      noscriptHtml: copy.noscriptHtml,
      alternateLinksHtml,
      ogLocale,
      ogAlternateLocales,
      jsonLd: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: copy.title,
        url: canonicalUrl,
        inLanguage: route.lang,
        description: copy.description,
        image: imageUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: 'The Black Box',
          url: siteUrl,
        },
      }),
    };
  }

  if (route.page === 'share') {
    const copy = SHARE_SEO[route.lang];
    return {
      lang: route.lang,
      title: copy.title,
      description: copy.description,
      robots: 'noindex, nofollow, noarchive',
      canonicalUrl,
      fallbackHtml: copy.fallbackHtml,
      noscriptHtml: copy.noscriptHtml,
      alternateLinksHtml: '',
      ogLocale,
      ogAlternateLocales: [],
      xRobotsTag: 'noindex, nofollow, noarchive',
      jsonLd: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: copy.title,
        url: canonicalUrl,
        inLanguage: route.lang,
        description: copy.description,
        image: imageUrl,
        isPartOf: {
          '@type': 'WebSite',
          name: 'The Black Box',
          url: siteUrl,
        },
      }),
    };
  }

  const copy = HOME_SEO[route.lang];
  return {
    lang: route.lang,
    title: copy.title,
    description: copy.description,
    robots: INDEXABLE_ROBOTS,
    canonicalUrl,
    fallbackHtml: copy.fallbackHtml,
    noscriptHtml: copy.noscriptHtml,
    alternateLinksHtml,
    ogLocale,
    ogAlternateLocales,
    jsonLd: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'The Black Box',
      applicationCategory: 'EntertainmentApplication',
      operatingSystem: 'Any',
      url: canonicalUrl,
      inLanguage: route.lang,
      description: copy.description,
      image: imageUrl,
      publisher: {
        '@type': 'Organization',
        name: 'The Black Box',
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    }),
  };
}

class TextContentHandler {
  constructor(private readonly value: string) {}

  element(element: Element) {
    element.setInnerContent(this.value);
  }
}

class AttributeHandler {
  constructor(
    private readonly name: string,
    private readonly value: string,
  ) {}

  element(element: Element) {
    element.setAttribute(this.name, this.value);
  }
}

class InnerHtmlHandler {
  constructor(private readonly value: string) {}

  element(element: Element) {
    element.setInnerContent(this.value, { html: true });
  }
}

class AppendHeadHandler {
  constructor(private readonly value: string) {}

  element(element: Element) {
    if (this.value) {
      element.append(this.value, { html: true });
    }
  }
}

function applySeoMetadata(response: Response, url: URL): Response {
  const seo = getSeoPage(url);
  const origin = getSiteOrigin(url);
  const imageUrl = new URL(SEO_IMAGE_PATH, origin).toString();
  const ogAlternateLocaleHtml = seo.ogAlternateLocales
    .map(locale => `<meta property="og:locale:alternate" content="${locale}" />`)
    .join('');
  const headAppendHtml = `${seo.alternateLinksHtml}${ogAlternateLocaleHtml}`;

  const rewritten = new HTMLRewriter()
    .on('html', new AttributeHandler('lang', seo.lang))
    .on('head', new AppendHeadHandler(headAppendHtml))
    .on('title', new TextContentHandler(seo.title))
    .on('meta[name="description"]', new AttributeHandler('content', seo.description))
    .on('meta[name="robots"]', new AttributeHandler('content', seo.robots))
    .on('meta[name="googlebot"]', new AttributeHandler('content', seo.robots))
    .on('meta[property="og:title"]', new AttributeHandler('content', seo.title))
    .on('meta[property="og:description"]', new AttributeHandler('content', seo.description))
    .on('meta[property="og:url"]', new AttributeHandler('content', seo.canonicalUrl))
    .on('meta[property="og:locale"]', new AttributeHandler('content', seo.ogLocale))
    .on('meta[property="og:image"]', new AttributeHandler('content', imageUrl))
    .on('meta[property="og:image:secure_url"]', new AttributeHandler('content', imageUrl))
    .on('meta[property="og:image:type"]', new AttributeHandler('content', 'image/png'))
    .on('meta[name="twitter:title"]', new AttributeHandler('content', seo.title))
    .on('meta[name="twitter:description"]', new AttributeHandler('content', seo.description))
    .on('meta[name="twitter:image"]', new AttributeHandler('content', imageUrl))
    .on('meta[name="twitter:url"]', new AttributeHandler('content', seo.canonicalUrl))
    .on('link[rel="canonical"]', new AttributeHandler('href', seo.canonicalUrl))
    .on('script[data-seo="structured-data"]', new TextContentHandler(seo.jsonLd))
    .on('main[data-seo-fallback]', new InnerHtmlHandler(seo.fallbackHtml))
    .on('main[data-seo-noscript]', new InnerHtmlHandler(seo.noscriptHtml))
    .transform(new Response(response.body, response));

  const headers = new Headers(rewritten.headers);
  headers.set('Content-Language', seo.lang);
  if (seo.xRobotsTag) {
    headers.set('X-Robots-Tag', seo.xRobotsTag);
  } else {
    headers.delete('X-Robots-Tag');
  }

  return new Response(rewritten.body, {
    status: rewritten.status,
    statusText: rewritten.statusText,
    headers,
  });
}

function handleRobots(url: URL): Response {
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /api/',
    'Disallow: /s/',
    ...LANGUAGES.map(({ code }) => `Disallow: /${code}/s/`),
    `Sitemap: ${new URL('/sitemap.xml', getSiteOrigin(url)).toString()}`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function handleSitemap(url: URL): Response {
  const origin = getSiteOrigin(url);
  const pages: Array<{ page: 'home' | 'privacy'; priority: string; changefreq: string }> = [
    { page: 'home', priority: '1.0', changefreq: 'weekly' },
    { page: 'privacy', priority: '0.3', changefreq: 'yearly' },
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pages.flatMap(page =>
  LANGUAGES.map(({ code }) => {
    const loc = new URL(buildLocalizedPath({ lang: code, page: page.page }), origin).toString();
    const alternates = LANGUAGES
      .map(language => `    <xhtml:link rel="alternate" hreflang="${language.code}" href="${new URL(buildLocalizedPath({ lang: language.code, page: page.page }), origin).toString()}" />`)
      .join('\n');
    const xDefault = page.page === 'home'
      ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL('/', origin).toString()}" />`
      : `    <xhtml:link rel="alternate" hreflang="x-default" href="${new URL(buildLocalizedPath({ lang: DEFAULT_LANG, page: page.page }), origin).toString()}" />`;

    return `  <url>
    <loc>${loc}</loc>
${alternates}
${xDefault}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }),
).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

async function handleCreateShare(request: Request, env: Env): Promise<Response> {
  let body: { input?: unknown; output?: unknown; personaId?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { input, output, personaId } = body;
  if (typeof input !== 'string' || typeof output !== 'string' || typeof personaId !== 'string') {
    return Response.json({ error: 'Missing or invalid fields' }, { status: 400 });
  }
  if (input.length > 2000 || output.length > 10000) {
    return Response.json({ error: 'Content too long' }, { status: 400 });
  }
  if (!PERSONAS[personaId]) {
    return Response.json({ error: 'Unknown persona' }, { status: 400 });
  }

  const id = generateId();
  const shareData: ShareData = { input, output, personaId };
  await env['BLACK-BOX-SHARE'].put(id, JSON.stringify(shareData), { expirationTtl: 7776000 });
  return Response.json({ id });
}

async function handleGetShare(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const id = url.pathname.slice('/api/share/'.length);
  if (!/^[A-Za-z0-9]{8}$/.test(id)) {
    return Response.json({ error: 'Invalid share ID' }, { status: 400 });
  }

  const value = await env['BLACK-BOX-SHARE'].get(id);
  if (!value) {
    return Response.json({ error: 'Share not found' }, { status: 404 });
  }
  return Response.json(JSON.parse(value) as ShareData);
}

async function handleGenerate(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (isRateLimited(ip)) {
    return Response.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  let body: { input?: string; personaId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { input, personaId } = body;
  if (!input || !personaId) {
    return Response.json({ error: 'Missing input or personaId' }, { status: 400 });
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return Response.json({ error: 'Input too long' }, { status: 400 });
  }

  const persona = PERSONAS[personaId];
  if (!persona) {
    return Response.json({ error: 'Unknown persona' }, { status: 400 });
  }

  let instruction = persona.instruction;
  if (persona.languageMode === 'alien') {
    instruction += "\n\nIMPORTANT: Respond mostly in the exact same language that the user used in their input, but frequently interject with bizarre, unpronounceable alien symbols (like ⍙⟒⍀⏁) or made-up alien words.";
  } else if (persona.languageMode === 'bard') {
    instruction += "\n\nIMPORTANT: Respond in the exact same language as the user's input. If the user uses Chinese, reply in a theatrical, ancient Chinese poetic style (文言文/武侠风). If English, use Shakespearean English.";
  } else {
    instruction += "\n\nIMPORTANT: You MUST respond in the exact same language that the user used in their input.";
  }

  const geminiModel = env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent`;
  const geminiRes = await fetch(`${geminiUrl}?key=${env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: instruction }] },
      contents: [{ parts: [{ text: input }] }],
      generationConfig: { temperature: 0.9 },
    }),
  });

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.error('Gemini API error:', errText);
    return Response.json({ error: 'Gemini API request failed' }, { status: 502 });
  }

  const data = await geminiRes.json() as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return Response.json({ text });
}
