# The Black Box

A fun web app where you drop in any thought and a random AI persona transforms it into something unexpected. Built with React + Vite on the frontend and Cloudflare Workers on the backend.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   ```
   cp .dev.vars.example .dev.vars
   ```
   Then edit `.dev.vars` and replace `your_key_here` with your [Gemini API key](https://aistudio.google.com/apikey).

3. In one terminal, start the worker:
   ```
   npm run dev:worker
   ```

4. In another terminal, start the frontend:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy

```
npm run deploy
```

Set `GEMINI_API_KEY` as a secret in your Cloudflare Workers dashboard before deploying:

```
wrangler secret put GEMINI_API_KEY
```
