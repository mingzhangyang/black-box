# The Black Box

The Black Box is a playful AI web app that takes any short piece of text and rewrites it through a randomly chosen absurd persona. The frontend is a React + Vite single-page app, and the backend is a Cloudflare Worker that calls Gemini, serves localized routes, and stores shareable results in Cloudflare KV.

## What It Does

- Accepts freeform user input and transforms it with a random persona such as a conspiracy theorist, noir detective, cat, bard, or alien anthropologist
- Supports 6 languages: English, Chinese, French, Spanish, Japanese, and Korean
- Generates localized home, privacy, and share routes
- Lets users create shareable result links backed by Cloudflare KV
- Adds SEO metadata and localized canonical/alternate tags at the worker layer

## Tech Stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS 4
- Motion
- Cloudflare Workers
- Cloudflare KV
- Gemini API

## Local Development

### Prerequisites

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Configure local secrets

Create a local worker secrets file:

```bash
cp .dev.vars.example .dev.vars
```

Then set at least:

```dotenv
GEMINI_API_KEY=your_key_here
```

Optional:

- `GEMINI_MODEL` is already set in [`wrangler.toml`](/mnt/c/Users/mingz/Codes/black-box/wrangler.toml) and defaults to `gemini-2.5-flash`

### Start the app

Run the worker in one terminal:

```bash
npm run dev:worker
```

Run the frontend in another:

```bash
npm run dev
```

Open `http://localhost:3000`.

Vite proxies `/api/*` requests to the worker on `http://localhost:8787`, so both processes are required for the full app.

## Available Scripts

- `npm run dev` starts the Vite frontend on port `3000`
- `npm run dev:worker` starts the Cloudflare Worker on port `8787`
- `npm run build` builds the frontend into `dist/`
- `npm run deploy` builds the frontend and deploys the worker
- `npm run preview` previews the production frontend build
- `npm run lint` runs TypeScript type-checking with `tsc --noEmit`

## Deployment

Before the first deploy, make sure the Cloudflare resources and secrets are configured correctly.

### 1. Configure KV for shared results

The worker expects a KV namespace bound as `BLACK-BOX-SHARE`. The current binding is declared in [`wrangler.toml`](/mnt/c/Users/mingz/Codes/black-box/wrangler.toml).

If you need a new namespace for your account/environment, create one and update the namespace `id` in [`wrangler.toml`](/mnt/c/Users/mingz/Codes/black-box/wrangler.toml):

```bash
npx wrangler kv namespace create BLACK-BOX-SHARE
```

### 2. Set the Gemini secret

```bash
wrangler secret put GEMINI_API_KEY
```

### 3. Deploy

```bash
npm run deploy
```

## Project Structure

```text
src/              React app, localized UI, route helpers, components
worker/index.ts   Cloudflare Worker entrypoint and API/SEO logic
public/           Static assets
wrangler.toml     Worker config, KV binding, assets binding, runtime vars
```

## Runtime Notes

- Maximum input length is `2000` characters
- Share links are stored in KV with a 90-day TTL
- The worker includes a simple in-memory IP rate limiter of `10` requests per minute per worker instance
- Share pages are intentionally marked `noindex`
- Persona prompt instructions are kept server-side; the client only sends a `personaId`

## Architecture Summary

- The React app handles input, loading states, result rendering, sharing, and language switching
- The worker exposes:
  - `POST /api/generate`
  - `POST /api/share`
  - `GET /api/share/:id`
- The worker also serves localized route redirects, robots/sitemap responses, and SEO metadata rewriting for HTML pages
