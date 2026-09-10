# littlewins

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_GTY8lopsc3zh2O7xEIdSTz1y9dQR)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

## AI Coach integration

LittleWins now includes an adaptive AI Coach while preserving the existing frontend design.

### Setup

1. Copy `.env.example` to `.env.local`.
2. Create a Gemini API key in Google AI Studio.
3. Set `GEMINI_API_KEY` in `.env.local`.
4. Install dependencies and run the app:

```bash
npm install
npm run dev
```

### Privacy and storage

There is no application database on the server. Objectives, progress, chat history and AI memories are stored in the user's browser through the existing Dexie/IndexedDB layer. For an AI request, LittleWins retrieves only the most relevant memories and recent progress, then sends that selected context through the stateless `/api/ai/chat` route.

### AI features added

- AI Coach chat page matching the current LittleWins visual style.
- First-conversation discovery flow so the coach can learn what the user wants to achieve.
- Failure check-ins for incomplete objectives.
- Local RAG memory for obstacles, preferences, patterns, successes and reflections.
- Adaptive easier/harder goal suggestions that require user approval.
- Personalized progress reflections and motivational quotes.
- Agent-memory visibility and separate "clear chat / keep memories" behavior.
- AI memory included in export/import and full-data reset.

See `ai-agent/README.md` for the agent architecture.
