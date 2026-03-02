export const TRANSLATIONS = {
  en: {
    title: "The Black Box",
    subtitle: "Drop your thoughts inside. You never know what will come out.",
    placeholder: "Type anything here... a sentence, a complaint, a random thought.",
    dropBtn: "Drop into the Box",
    complete: "Transformation Complete",
    errorBadge: "Something Went Wrong",
    tryAnother: "Try another",
    share: "Share",
    copied: "Copied!",
    shareError: "Failed",
    copyLink: "Copy Link",
    shareText: "Look what The Black Box transformed my text into!",
    warning: "Warning: Results may be highly unpredictable. This is just a game for fun, please don't take it seriously.",
    error: "The black box malfunctioned. Please try again.",
    silent: "The box remains silent..."
  },
  zh: {
    title: "神秘黑箱",
    subtitle: "把你的想法丢进去。你永远不知道会出来什么。",
    placeholder: "在这里输入任何内容……一句话、一句抱怨、一个随机的想法。",
    dropBtn: "丢入黑箱",
    complete: "转化完成",
    errorBadge: "发生错误",
    tryAnother: "再试一次",
    share: "分享",
    copied: "已复制！",
    shareError: "失败",
    copyLink: "复制链接",
    shareText: "看看神秘黑箱把我的文字变成了什么！",
    warning: "警告：结果可能极具不可预测性。这只是一个供娱乐的文字游戏，请勿当真。",
    error: "黑箱发生故障，请重试。",
    silent: "黑箱保持沉默……"
  }
};

// Only UI display data lives on the client; instructions are kept server-side
export const PERSONAS = [
  { id: 'conspiracy', processingText: { en: 'Uncovering the hidden truth...', zh: '正在揭开隐藏的真相...' } },
  { id: 'cat', processingText: { en: 'Judging you silently...', zh: '正在默默地评判你...' } },
  { id: 'trailer', processingText: { en: 'Adding dramatic explosions...', zh: '正在添加戏剧性的爆炸效果...' } },
  { id: 'robot', processingText: { en: 'Analyzing logical fallacies...', zh: '正在分析逻辑谬误...' } },
  { id: 'bard', processingText: { en: 'Tuning the lute...', zh: '正在调音鲁特琴...' } },
  { id: 'fortune', processingText: { en: 'Gazing into the cloudy crystal ball...', zh: '正在凝视浑浊的水晶球...' } },
  { id: 'creation', processingText: { en: 'Weaving a new reality...', zh: '正在编织新的现实...' } },
  { id: 'deep_analysis', processingText: { en: 'Psychoanalyzing your soul...', zh: '正在对你的灵魂进行精神分析...' } },
  { id: 'reconstruction', processingText: { en: 'Drafting legal paperwork...', zh: '正在起草法律文件...' } },
  { id: 'multiverse', processingText: { en: 'Scanning alternate dimensions...', zh: '正在扫描平行维度...' } },
  { id: 'future_deduction', processingText: { en: 'Calculating the butterfly effect...', zh: '正在计算蝴蝶效应...' } },
  { id: 'noir', processingText: { en: 'Lighting a cheap cigarette...', zh: '正在点燃一根廉价香烟...' } },
  { id: 'alien', processingText: { en: 'Translating human nonsense...', zh: '正在翻译人类的胡言乱语...' } },
  { id: 'zen', processingText: { en: 'Meditating on the void...', zh: '正在虚空中冥想...' } },
];

export const MAX_INPUT_LENGTH = 2000;

export type Lang = 'en' | 'zh';
export type BoxState = 'idle' | 'processing' | 'revealed';
export type Translations = typeof TRANSLATIONS.en;
export type Persona = typeof PERSONAS[number];
