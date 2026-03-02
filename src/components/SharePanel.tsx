import { useState } from 'react';
import { motion } from 'motion/react';
import { Twitter, Facebook, Check, Copy } from 'lucide-react';

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
    </svg>
  );
}

function TelegramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

const PLATFORMS = [
  { id: 'twitter',  label: 'X / Twitter', Icon: ({ size }: { size: number }) => <Twitter size={size} /> },
  { id: 'facebook', label: 'Facebook',    Icon: ({ size }: { size: number }) => <Facebook size={size} /> },
  { id: 'whatsapp', label: 'WhatsApp',    Icon: ({ size }: { size: number }) => <WhatsAppIcon size={size} /> },
  { id: 'telegram', label: 'Telegram',    Icon: ({ size }: { size: number }) => <TelegramIcon size={size} /> },
] as const;

type PlatformId = typeof PLATFORMS[number]['id'];

interface Props {
  shareUrl: string;
  shareText: string;
  copyLabel: string;
  copiedLabel: string;
}

export default function SharePanel({ shareUrl, shareText, copyLabel, copiedLabel }: Props) {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const openSocial = (platform: PlatformId) => {
    const url = encodeURIComponent(shareUrl);
    const text = encodeURIComponent(shareText);
    const targets: Record<PlatformId, string> = {
      twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
    };
    window.open(targets[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap justify-center items-center gap-2"
    >
      {PLATFORMS.map(({ id, label, Icon }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.08, backgroundColor: 'rgba(39, 39, 42, 1)' }}
          whileTap={{ scale: 0.94 }}
          onClick={() => openSocial(id)}
          aria-label={`Share on ${label}`}
          title={label}
          className="flex items-center justify-center w-10 h-10 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full bg-zinc-800/50 border border-zinc-700/50"
        >
          <Icon size={16} />
        </motion.button>
      ))}

      <div className="w-px h-6 bg-zinc-700/50 mx-1 hidden sm:block" />

      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(39, 39, 42, 1)' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCopyLink}
        className="flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-sm"
      >
        {linkCopied ? <><Check size={14} /> {copiedLabel}</> : <><Copy size={14} /> {copyLabel}</>}
      </motion.button>
    </motion.div>
  );
}
