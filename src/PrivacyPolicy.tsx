import { useState, useEffect } from 'react';
import { Globe, Box, ArrowLeft } from 'lucide-react';
import Footer from './Footer';

type Lang = 'en' | 'zh';

const CONTENT = {
  en: {
    backHome: 'Back to Home',
    title: 'Privacy Policy',
    updated: 'Last updated: March 2025',
    sections: [
      {
        heading: 'Overview',
        body: 'The Black Box ("we", "us", "our") is a fun, experimental text transformation tool. We take your privacy seriously and collect as little data as possible. This policy explains what information we handle and how.',
      },
      {
        heading: 'Information We Process',
        body: `When you use The Black Box, the text you submit is sent to Google's Gemini AI API to generate a response. We do not store your input or the AI-generated output unless you explicitly use the Share feature.

If you choose to share a result, the input text and the AI-generated response are stored on Cloudflare's infrastructure and are accessible via a unique link for up to 90 days, after which they are automatically deleted.

To prevent abuse, your IP address is used for rate limiting. This data is held in memory only and is not written to any persistent storage.`,
      },
      {
        heading: 'What We Do Not Collect',
        body: `We do not collect:
- Personal identification information (name, email, phone number)
- Cookies or browser tracking data
- Device identifiers or usage analytics
- Any information beyond what is described above`,
      },
      {
        heading: 'Third-Party Services',
        body: `We use the following third-party services:

**Google Gemini AI** – Your submitted text is sent to Google's Gemini API for processing. Google's privacy policy applies to this data. We recommend you avoid submitting sensitive personal information.

**Cloudflare** – The application is hosted on Cloudflare Workers and Cloudflare KV. Cloudflare may process request metadata (such as IP addresses) according to their own privacy policy.`,
      },
      {
        heading: 'Children\'s Privacy',
        body: 'This service is not directed at children under the age of 13. We do not knowingly collect information from children.',
      },
      {
        heading: 'Changes to This Policy',
        body: 'We may update this privacy policy from time to time. The "last updated" date at the top of this page will reflect any changes.',
      },
      {
        heading: 'Contact',
        body: 'If you have questions about this privacy policy, please open an issue on our GitHub repository.',
      },
    ],
  },
  zh: {
    backHome: '返回首页',
    title: '隐私政策',
    updated: '最后更新：2025年3月',
    sections: [
      {
        heading: '概述',
        body: '神秘黑箱（"我们"）是一款有趣的实验性文字转化工具。我们重视您的隐私，并尽可能少地收集数据。本政策说明我们处理的信息及其方式。',
      },
      {
        heading: '我们处理的信息',
        body: `当您使用神秘黑箱时，您提交的文字将被发送至 Google Gemini AI API 以生成回应。除非您主动使用"分享"功能，否则我们不会存储您的输入内容或 AI 生成的输出内容。

如果您选择分享结果，输入文字和 AI 生成的回应将存储在 Cloudflare 的基础设施中，并可通过唯一链接访问，最长保留 90 天，之后将自动删除。

为防止滥用，我们使用您的 IP 地址进行频率限制。该数据仅保存在内存中，不会写入任何持久存储。`,
      },
      {
        heading: '我们不收集的信息',
        body: `我们不收集：
- 个人身份信息（姓名、电子邮件、电话号码）
- Cookie 或浏览器追踪数据
- 设备标识符或使用分析数据
- 上述描述以外的任何信息`,
      },
      {
        heading: '第三方服务',
        body: `我们使用以下第三方服务：

**Google Gemini AI** – 您提交的文字将发送至 Google 的 Gemini API 进行处理。Google 的隐私政策适用于此数据。我们建议您避免提交敏感个人信息。

**Cloudflare** – 本应用托管在 Cloudflare Workers 和 Cloudflare KV 上。Cloudflare 可能会根据其自身的隐私政策处理请求元数据（例如 IP 地址）。`,
      },
      {
        heading: '儿童隐私',
        body: '本服务不面向 13 岁以下的儿童。我们不会故意收集儿童的信息。',
      },
      {
        heading: '政策变更',
        body: '我们可能会不时更新本隐私政策。本页顶部的"最后更新"日期将反映任何变更。',
      },
      {
        heading: '联系方式',
        body: '如果您对本隐私政策有任何疑问，请在我们的 GitHub 仓库中提交 issue。',
      },
    ],
  },
};

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<Lang>(() =>
    navigator.language.startsWith('zh') ? 'zh' : 'en'
  );

  const t = CONTENT[lang];

  useEffect(() => {
    document.title = lang === 'zh'
      ? '隐私政策 — 神秘黑箱'
      : 'Privacy Policy — The Black Box';
    document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
  }, [lang]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800">

      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 md:px-6 md:pt-6">
        <a
          href="/"
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          {t.backHome}
        </a>
        <button
          onClick={() => setLang(l => l === 'en' ? 'zh' : 'en')}
          aria-label={lang === 'en' ? 'Switch to Chinese' : 'Switch to English'}
          className="flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 text-zinc-300 px-3 py-2 md:px-4 md:py-2 rounded-full hover:text-white hover:bg-zinc-800 transition-colors text-xs md:text-sm font-medium shadow-lg"
        >
          <Globe size={16} />
          {lang === 'en' ? '中文' : 'English'}
        </button>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 py-10 md:px-6 md:py-16 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-2">
          <Box size={20} className="text-zinc-500" />
          <span className="text-zinc-500 text-sm font-mono uppercase tracking-wider">The Black Box</span>
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
