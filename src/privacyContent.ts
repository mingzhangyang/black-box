import type { Lang } from './i18n';

type PrivacySection = {
  heading: string;
  body: string;
};

type PrivacyTranslation = {
  backHome: string;
  title: string;
  updated: string;
  pageTitle: string;
  siteName: string;
  languageButton: string;
  languageMenuLabel: string;
  sections: PrivacySection[];
};

export const PRIVACY_CONTENT: Record<Lang, PrivacyTranslation> = {
  en: {
    backHome: 'Back to Home',
    title: 'Privacy Policy',
    updated: 'Last updated: March 2025',
    pageTitle: 'Privacy Policy — The Black Box',
    siteName: 'The Black Box',
    languageButton: 'Language',
    languageMenuLabel: 'Choose language',
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

**Google Gemini AI** - Your submitted text is sent to Google's Gemini API for processing. Google's privacy policy applies to this data. We recommend you avoid submitting sensitive personal information.

**Cloudflare** - The application is hosted on Cloudflare Workers and Cloudflare KV. Cloudflare may process request metadata (such as IP addresses) according to their own privacy policy.`,
      },
      {
        heading: "Children's Privacy",
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
    pageTitle: '隐私政策 — 神秘黑箱',
    siteName: '神秘黑箱',
    languageButton: '语言',
    languageMenuLabel: '选择语言',
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

**Google Gemini AI** - 您提交的文字将发送至 Google 的 Gemini API 进行处理。Google 的隐私政策适用于此数据。我们建议您避免提交敏感个人信息。

**Cloudflare** - 本应用托管在 Cloudflare Workers 和 Cloudflare KV 上。Cloudflare 可能会根据其自身的隐私政策处理请求元数据（例如 IP 地址）。`,
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
  fr: {
    backHome: "Retour à l'accueil",
    title: 'Politique de confidentialité',
    updated: 'Dernière mise à jour : mars 2025',
    pageTitle: 'Politique de confidentialité — La Boîte Noire',
    siteName: 'La Boîte Noire',
    languageButton: 'Langue',
    languageMenuLabel: 'Choisir la langue',
    sections: [
      {
        heading: 'Vue d’ensemble',
        body: "La Boîte Noire (\"nous\", \"notre\", \"nos\") est un outil expérimental et ludique de transformation de texte. Nous prenons votre vie privée au sérieux et collectons le moins de données possible. Cette politique explique quelles informations nous traitons et comment.",
      },
      {
        heading: 'Informations que nous traitons',
        body: `Lorsque vous utilisez La Boîte Noire, le texte que vous soumettez est envoyé à l'API Gemini AI de Google afin de générer une réponse. Nous ne stockons ni votre saisie ni la réponse générée par l'IA, sauf si vous utilisez explicitement la fonction de partage.

Si vous choisissez de partager un résultat, le texte saisi et la réponse générée par l'IA sont stockés sur l'infrastructure de Cloudflare et accessibles via un lien unique pendant 90 jours maximum, puis supprimés automatiquement.

Pour prévenir les abus, votre adresse IP est utilisée pour la limitation de débit. Ces données sont conservées uniquement en mémoire et ne sont écrites dans aucun stockage persistant.`,
      },
      {
        heading: 'Ce que nous ne collectons pas',
        body: `Nous ne collectons pas :
- Des informations d'identification personnelle (nom, email, numéro de téléphone)
- Des cookies ou des données de suivi du navigateur
- Des identifiants d'appareil ou des analyses d'utilisation
- Toute information au-delà de ce qui est décrit ci-dessus`,
      },
      {
        heading: 'Services tiers',
        body: `Nous utilisons les services tiers suivants :

**Google Gemini AI** - Le texte que vous soumettez est envoyé à l'API Gemini de Google pour traitement. La politique de confidentialité de Google s'applique à ces données. Nous vous recommandons d'éviter de soumettre des informations personnelles sensibles.

**Cloudflare** - L'application est hébergée sur Cloudflare Workers et Cloudflare KV. Cloudflare peut traiter des métadonnées de requête (comme les adresses IP) conformément à sa propre politique de confidentialité.`,
      },
      {
        heading: 'Protection des enfants',
        body: "Ce service n'est pas destiné aux enfants de moins de 13 ans. Nous ne collectons pas sciemment d'informations concernant des enfants.",
      },
      {
        heading: 'Modifications de cette politique',
        body: 'Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. La date de "dernière mise à jour" en haut de cette page reflète toute modification.',
      },
      {
        heading: 'Contact',
        body: 'Si vous avez des questions concernant cette politique de confidentialité, veuillez ouvrir une issue sur notre dépôt GitHub.',
      },
    ],
  },
  es: {
    backHome: 'Volver al inicio',
    title: 'Política de privacidad',
    updated: 'Última actualización: marzo de 2025',
    pageTitle: 'Política de privacidad — La Caja Negra',
    siteName: 'La Caja Negra',
    languageButton: 'Idioma',
    languageMenuLabel: 'Elegir idioma',
    sections: [
      {
        heading: 'Resumen',
        body: 'La Caja Negra ("nosotros", "nuestro") es una herramienta experimental y divertida de transformación de texto. Nos tomamos en serio tu privacidad y recopilamos la menor cantidad de datos posible. Esta política explica qué información manejamos y cómo lo hacemos.',
      },
      {
        heading: 'Información que procesamos',
        body: `Cuando usas La Caja Negra, el texto que envías se manda a la API de Gemini AI de Google para generar una respuesta. No almacenamos tu entrada ni la salida generada por la IA, a menos que uses de forma explícita la función Compartir.

Si decides compartir un resultado, el texto de entrada y la respuesta generada por la IA se almacenan en la infraestructura de Cloudflare y son accesibles mediante un enlace único durante un máximo de 90 días, tras lo cual se eliminan automáticamente.

Para evitar abusos, usamos tu dirección IP para limitar la tasa de solicitudes. Estos datos solo se mantienen en memoria y no se escriben en ningún almacenamiento persistente.`,
      },
      {
        heading: 'Lo que no recopilamos',
        body: `No recopilamos:
- Información de identificación personal (nombre, correo electrónico, número de teléfono)
- Cookies ni datos de seguimiento del navegador
- Identificadores de dispositivos ni analíticas de uso
- Ninguna información más allá de lo descrito arriba`,
      },
      {
        heading: 'Servicios de terceros',
        body: `Usamos los siguientes servicios de terceros:

**Google Gemini AI** - El texto que envías se remite a la API Gemini de Google para su procesamiento. La política de privacidad de Google se aplica a estos datos. Te recomendamos no enviar información personal sensible.

**Cloudflare** - La aplicación está alojada en Cloudflare Workers y Cloudflare KV. Cloudflare puede procesar metadatos de la solicitud (como direcciones IP) de acuerdo con su propia política de privacidad.`,
      },
      {
        heading: 'Privacidad infantil',
        body: 'Este servicio no está dirigido a menores de 13 años. No recopilamos intencionalmente información de niños.',
      },
      {
        heading: 'Cambios en esta politica',
        body: 'Podemos actualizar esta política de privacidad de vez en cuando. La fecha de "última actualización" en la parte superior de esta página reflejará cualquier cambio.',
      },
      {
        heading: 'Contacto',
        body: 'Si tienes preguntas sobre esta política de privacidad, abre un issue en nuestro repositorio de GitHub.',
      },
    ],
  },
  ja: {
    backHome: 'ホームに戻る',
    title: 'プライバシーポリシー',
    updated: '最終更新: 2025年3月',
    pageTitle: 'プライバシーポリシー — ブラックボックス',
    siteName: 'ブラックボックス',
    languageButton: '言語',
    languageMenuLabel: '言語を選択',
    sections: [
      {
        heading: '概要',
        body: 'ブラックボックス（以下「当サービス」）は、文章を変換して遊ぶための実験的なツールです。私たちはプライバシーを重視し、できる限り少ないデータだけを扱います。このポリシーでは、どのような情報をどのように扱うかを説明します。',
      },
      {
        heading: '当サービスが処理する情報',
        body: `ブラックボックスを利用すると、入力した文章は応答を生成するために Google の Gemini AI API に送信されます。共有機能を明示的に使わない限り、入力内容や AI が生成した出力を保存することはありません。

共有を選択した場合、入力文と AI の生成結果は Cloudflare のインフラに保存され、一意のリンクから最長 90 日間アクセスできます。その後、自動的に削除されます。

不正利用を防ぐため、IP アドレスをレート制限に使用します。このデータはメモリ上でのみ保持され、永続ストレージには書き込まれません。`,
      },
      {
        heading: '収集しない情報',
        body: `当サービスは次の情報を収集しません。
- 個人を特定できる情報（氏名、メールアドレス、電話番号）
- Cookie やブラウザ追跡データ
- 端末識別子や利用分析データ
- 上記以外の情報`,
      },
      {
        heading: '第三者サービス',
        body: `当サービスでは、次の第三者サービスを利用しています。

**Google Gemini AI** - 入力された文章は処理のために Google の Gemini API に送信されます。このデータには Google のプライバシーポリシーが適用されます。機密性の高い個人情報は入力しないことを推奨します。

**Cloudflare** - 本アプリケーションは Cloudflare Workers と Cloudflare KV 上で稼働しています。Cloudflare は独自のプライバシーポリシーに従って、リクエストメタデータ（IP アドレスなど）を処理する場合があります。`,
      },
      {
        heading: '子どものプライバシー',
        body: 'このサービスは 13 歳未満の子どもを対象としていません。子どもに関する情報を意図的に収集することはありません。',
      },
      {
        heading: '本ポリシーの変更',
        body: 'このプライバシーポリシーは随時更新される場合があります。変更があった場合は、このページ上部の「最終更新」日付に反映されます。',
      },
      {
        heading: 'お問い合わせ',
        body: 'このプライバシーポリシーについて質問がある場合は、GitHub リポジトリで issue を作成してください。',
      },
    ],
  },
  ko: {
    backHome: '홈으로 돌아가기',
    title: '개인정보 처리방침',
    updated: '최종 업데이트: 2025년 3월',
    pageTitle: '개인정보 처리방침 — 블랙 박스',
    siteName: '블랙 박스',
    languageButton: '언어',
    languageMenuLabel: '언어 선택',
    sections: [
      {
        heading: '개요',
        body: '블랙 박스(이하 "당사")는 재미를 위한 실험적인 텍스트 변환 도구입니다. 당사는 개인정보를 중요하게 여기며 가능한 한 적은 데이터만 수집합니다. 이 문서는 어떤 정보를 어떻게 처리하는지 설명합니다.',
      },
      {
        heading: '당사가 처리하는 정보',
        body: `블랙 박스를 사용할 때 입력한 텍스트는 응답 생성을 위해 Google Gemini AI API로 전송됩니다. 사용자가 명시적으로 공유 기능을 사용하지 않는 한, 입력 내용이나 AI가 생성한 출력은 저장하지 않습니다.

결과를 공유하기로 선택하면 입력 텍스트와 AI 생성 응답은 Cloudflare 인프라에 저장되며, 고유 링크를 통해 최대 90일 동안 접근할 수 있습니다. 그 이후에는 자동으로 삭제됩니다.

남용을 방지하기 위해 IP 주소를 속도 제한에 사용합니다. 이 데이터는 메모리에만 보관되며 어떤 영구 저장소에도 기록되지 않습니다.`,
      },
      {
        heading: '수집하지 않는 정보',
        body: `당사는 다음 정보를 수집하지 않습니다.
- 개인 식별 정보(이름, 이메일, 전화번호)
- 쿠키 또는 브라우저 추적 데이터
- 기기 식별자 또는 사용 분석 데이터
- 위에 설명된 범위를 벗어나는 모든 정보`,
      },
      {
        heading: '제3자 서비스',
        body: `당사는 다음 제3자 서비스를 사용합니다.

**Google Gemini AI** - 사용자가 제출한 텍스트는 처리를 위해 Google Gemini API로 전송됩니다. 이 데이터에는 Google의 개인정보 처리방침이 적용됩니다. 민감한 개인정보는 입력하지 않는 것을 권장합니다.

**Cloudflare** - 이 애플리케이션은 Cloudflare Workers와 Cloudflare KV에서 호스팅됩니다. Cloudflare는 자체 개인정보 처리방침에 따라 요청 메타데이터(IP 주소 등)를 처리할 수 있습니다.`,
      },
      {
        heading: '아동의 개인정보',
        body: '이 서비스는 13세 미만의 아동을 대상으로 하지 않습니다. 당사는 아동의 정보를 고의로 수집하지 않습니다.',
      },
      {
        heading: '정책 변경',
        body: '당사는 이 개인정보 처리방침을 수시로 업데이트할 수 있습니다. 변경 사항이 있으면 이 페이지 상단의 "최종 업데이트" 날짜에 반영됩니다.',
      },
      {
        heading: '문의',
        body: '이 개인정보 처리방침에 관한 질문이 있다면 GitHub 저장소에 issue를 등록해 주세요.',
      },
    ],
  },
};
