/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: { fetch(r: Request): Promise<Response> };
  GEMINI_API_KEY: string;
  'BLACK-BOX-SHARE': KVNamespace;
}

type ShareData = { input: string; output: string; personaId: string };

function generateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => chars[b % chars.length]).join('');
}

const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const MAX_INPUT_LENGTH = 2000;
const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

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

    if (request.method === 'POST' && url.pathname === '/api/generate') {
      return handleGenerate(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/api/share') {
      return handleCreateShare(request, env);
    }
    if (request.method === 'GET' && url.pathname.startsWith('/api/share/')) {
      return handleGetShare(request, env);
    }

    // SPA fallback: serve index.html for unknown paths
    const response = await env.ASSETS.fetch(request);
    if (response.status === 404) {
      return env.ASSETS.fetch(new Request(new URL('/', request.url).toString()));
    }
    return response;
  },
};

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

  const geminiRes = await fetch(`${GEMINI_URL}?key=${env.GEMINI_API_KEY}`, {
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
