import type { Lang } from './i18n';

export type Translation = {
  title: string;
  subtitle: string;
  placeholder: string;
  dropBtn: string;
  complete: string;
  errorBadge: string;
  tryAnother: string;
  share: string;
  copied: string;
  shareError: string;
  copyLink: string;
  shareText: string;
  warning: string;
  error: string;
  silent: string;
  rateLimited: string;
  shareMissing: string;
  appTitle: string;
  languageButton: string;
  languageMenuLabel: string;
};

export const TRANSLATIONS: Record<Lang, Translation> = {
  en: {
    title: 'The Black Box',
    subtitle: 'Drop your thoughts inside. You never know what will come out.',
    placeholder: 'Type anything here... a sentence, a complaint, a random thought.',
    dropBtn: 'Drop into the Box',
    complete: 'Transformation Complete',
    errorBadge: 'Something Went Wrong',
    tryAnother: 'Try another',
    share: 'Share',
    copied: 'Copied!',
    shareError: 'Failed',
    copyLink: 'Copy Link',
    shareText: 'Look what The Black Box transformed my text into!',
    warning: "Warning: Results may be highly unpredictable. This is just a game for fun, please don't take it seriously.",
    error: 'The black box malfunctioned. Please try again.',
    silent: 'The box remains silent...',
    rateLimited: 'The black box is overheating. Please wait a moment and try again.',
    shareMissing: 'This shared result was not found, or the link has expired.',
    appTitle: 'The Black Box — Drop Your Thoughts In',
    languageButton: 'Language',
    languageMenuLabel: 'Choose language',
  },
  zh: {
    title: '神秘黑箱',
    subtitle: '把你的想法丢进去。你永远不知道会出来什么。',
    placeholder: '在这里输入任何内容……一句话、一句抱怨、一个随机的想法。',
    dropBtn: '丢入黑箱',
    complete: '转化完成',
    errorBadge: '发生错误',
    tryAnother: '再试一次',
    share: '分享',
    copied: '已复制！',
    shareError: '失败',
    copyLink: '复制链接',
    shareText: '看看神秘黑箱把我的文字变成了什么！',
    warning: '警告：结果可能极具不可预测性。这只是一个供娱乐的文字游戏，请勿当真。',
    error: '黑箱发生故障，请重试。',
    silent: '黑箱保持沉默……',
    rateLimited: '黑箱过热了，请稍后再试。',
    shareMissing: '找不到这个分享结果，或链接已经过期。',
    appTitle: '神秘黑箱 — 把你的想法丢进去',
    languageButton: '语言',
    languageMenuLabel: '选择语言',
  },
  fr: {
    title: 'La Boîte Noire',
    subtitle: "Déposez-y vos pensées. On ne sait jamais ce qui en ressortira.",
    placeholder: "Écrivez n'importe quoi ici... une phrase, une plainte ou une pensée au hasard.",
    dropBtn: 'Déposer dans la boîte',
    complete: 'Transformation terminée',
    errorBadge: 'Un problème est survenu',
    tryAnother: 'Réessayer',
    share: 'Partager',
    copied: 'Copié !',
    shareError: 'Échec',
    copyLink: 'Copier le lien',
    shareText: 'Regardez ce que La Boîte Noire a fait de mon texte !',
    warning: "Attention : les résultats peuvent être très imprévisibles. C'est juste un jeu pour s'amuser, ne le prenez pas au sérieux.",
    error: 'La boîte noire a rencontré un problème. Veuillez réessayer.',
    silent: 'La boîte reste silencieuse...',
    rateLimited: 'La boîte noire surchauffe. Veuillez patienter un instant puis réessayer.',
    shareMissing: 'Ce résultat partagé est introuvable, ou le lien a expiré.',
    appTitle: 'La Boîte Noire — Déposez vos pensées',
    languageButton: 'Langue',
    languageMenuLabel: 'Choisir la langue',
  },
  es: {
    title: 'La Caja Negra',
    subtitle: 'Deja tus pensamientos dentro. Nunca sabes qué saldrá.',
    placeholder: 'Escribe cualquier cosa aquí... una frase, una queja o un pensamiento al azar.',
    dropBtn: 'Meter en la caja',
    complete: 'Transformación completada',
    errorBadge: 'Algo salió mal',
    tryAnother: 'Probar otra vez',
    share: 'Compartir',
    copied: 'Copiado',
    shareError: 'Error',
    copyLink: 'Copiar enlace',
    shareText: 'Mira en qué convirtió mi texto La Caja Negra.',
    warning: 'Advertencia: los resultados pueden ser muy impredecibles. Esto es solo un juego para divertirse, no lo tomes demasiado en serio.',
    error: 'La caja negra falló. Inténtalo de nuevo.',
    silent: 'La caja permanece en silencio...',
    rateLimited: 'La caja negra se está sobrecalentando. Espera un momento e inténtalo de nuevo.',
    shareMissing: 'No se encontró este resultado compartido, o el enlace ha caducado.',
    appTitle: 'La Caja Negra — Deja tus pensamientos dentro',
    languageButton: 'Idioma',
    languageMenuLabel: 'Elegir idioma',
  },
  ja: {
    title: 'ブラックボックス',
    subtitle: '考えを投げ入れてください。何が出てくるかは誰にもわかりません。',
    placeholder: 'ここに何でも入力してください……一文でも、不満でも、思いつきでも。',
    dropBtn: '箱に投げ入れる',
    complete: '変換完了',
    errorBadge: '問題が発生しました',
    tryAnother: 'もう一度試す',
    share: '共有',
    copied: 'コピーしました',
    shareError: '失敗',
    copyLink: 'リンクをコピー',
    shareText: 'ブラックボックスが私の文章をこんなふうに変換しました。',
    warning: '注意: 結果はかなり予測不能な場合があります。これは気軽に楽しむための遊びです。真に受けないでください。',
    error: 'ブラックボックスで不具合が発生しました。もう一度お試しください。',
    silent: '箱は沈黙したままです……',
    rateLimited: 'ブラックボックスが過熱しています。少し待ってから再試行してください。',
    shareMissing: 'この共有結果は見つからないか、リンクの有効期限が切れています。',
    appTitle: 'ブラックボックス — 考えを投げ入れてください',
    languageButton: '言語',
    languageMenuLabel: '言語を選択',
  },
  ko: {
    title: '블랙 박스',
    subtitle: '생각을 던져 넣어 보세요. 무엇이 나올지는 아무도 모릅니다.',
    placeholder: '여기에 아무 말이나 입력하세요... 한 문장, 불평, 아무 생각이나 좋습니다.',
    dropBtn: '상자에 넣기',
    complete: '변환 완료',
    errorBadge: '문제가 발생했습니다',
    tryAnother: '다시 시도',
    share: '공유',
    copied: '복사됨!',
    shareError: '실패',
    copyLink: '링크 복사',
    shareText: '블랙 박스가 내 글을 이렇게 바꿨어요!',
    warning: '주의: 결과는 매우 예측 불가능할 수 있습니다. 이것은 재미를 위한 가벼운 게임이니 너무 진지하게 받아들이지 마세요.',
    error: '블랙 박스에 오류가 발생했습니다. 다시 시도해 주세요.',
    silent: '상자는 여전히 침묵합니다...',
    rateLimited: '블랙 박스가 과열되었습니다. 잠시 후 다시 시도해 주세요.',
    shareMissing: '이 공유 결과를 찾을 수 없거나 링크가 만료되었습니다.',
    appTitle: '블랙 박스 — 생각을 던져 넣어 보세요',
    languageButton: '언어',
    languageMenuLabel: '언어 선택',
  },
};

export const FOOTER_TRANSLATIONS: Record<Lang, { privacy: string; copy: string }> = {
  en: { privacy: 'Privacy Policy', copy: `© ${new Date().getFullYear()} The Black Box` },
  zh: { privacy: '隐私政策', copy: `© ${new Date().getFullYear()} 神秘黑箱` },
  fr: { privacy: 'Politique de confidentialité', copy: `© ${new Date().getFullYear()} La Boîte Noire` },
  es: { privacy: 'Política de privacidad', copy: `© ${new Date().getFullYear()} La Caja Negra` },
  ja: { privacy: 'プライバシーポリシー', copy: `© ${new Date().getFullYear()} ブラックボックス` },
  ko: { privacy: '개인정보 처리방침', copy: `© ${new Date().getFullYear()} 블랙 박스` },
};


export type { Persona } from './personas';
export { PERSONAS } from './personas';

export const MAX_INPUT_LENGTH = 2000;

export type BoxState = 'idle' | 'processing' | 'revealed';
export type Translations = Translation;
