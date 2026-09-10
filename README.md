# LittleWins

### Small steps. Real progress. A kinder way to grow.

LittleWins is a calm, personal habit and wellbeing companion. It helps you turn intentions into manageable daily objectives, notice the progress you are already making, and reflect with an AI coach that adapts to your real life.

The interface is intentionally gentle and practical: a focused Today view, simple progress controls, encouraging feedback, and enough history to see patterns without turning self-care into a performance dashboard.

## What you can do

- Create objectives for health, nutrition, movement, learning, relationships, and self-care.
- Track one-tap habits, counters, quantities, and durations.
- See daily completion, streaks, weekly progress, and your most consistent objectives.
- Add a personal reason behind an objective so the motivation stays visible.
- Ask the LittleWins Coach for reflections, next steps, and goal adjustments.
- Approve suggested goal changes or new objectives before they affect your plan.
- Keep chat history and learned coaching patterns separate, so you can clear a conversation without losing useful memories.
- Export your local data as a JSON backup or clear it permanently from Settings.
- Switch between light and dark appearance.

## Product tour

| Area | Purpose |
| --- | --- |
| **Today** | Complete objectives and see how the day is going. |
| **AI Coach** | Talk through obstacles, progress, and realistic next steps. |
| **Objectives** | Create, edit, filter, and remove daily objectives. |
| **Progress** | Review streaks, averages, wins, and the weekly chart. |
| **Motivation** | Browse short, supportive reminders. |
| **Profile** | Personalize your name, nickname, age, and avatar. |
| **Settings** | Change appearance, export data, or clear local data. |

## Built with

- [Next.js](https://nextjs.org/) 16 with the App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Dexie for browser-based IndexedDB storage
- Framer Motion for lightweight transitions
- Recharts for progress visualization
- Lucide React for interface icons
- Gemini through the server-side AI route

## Run locally

### 1. Install dependencies

```bash
npm install
```

The repository also includes a `pnpm-lock.yaml` if you prefer pnpm.

### 2. Configure the AI Coach

Copy the example environment file:

```bash
cp .env.example .env.local
```

Then add a Gemini API key to `.env.local`:

```env
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Create a key in [Google AI Studio](https://aistudio.google.com/apikey). Keep the key server-side; do not rename it to a `NEXT_PUBLIC_*` variable.

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For a production build:

```bash
npm run build
npm run start
```

## Privacy and data model

LittleWins has no application database on the server. Objectives, daily progress, summaries, profile settings, chat messages, and AI memories are stored locally in the browser using Dexie and IndexedDB.

When the Coach needs context, the app retrieves relevant local memories and recent progress before sending a selected context to the stateless `/api/ai/chat` route. The Gemini API key is used only by the server route and is never exposed to the browser.

Local data is tied to the browser profile. Clearing browser storage or using another browser does not carry the data over, so use the Settings export before moving or resetting a profile.

## AI architecture

The agent code lives in [`ai-agent/`](ai-agent/):

- [`client.ts`](ai-agent/client.ts) builds the request context from local app data.
- [`rag.ts`](ai-agent/rag.ts) performs lightweight local retrieval over saved memories.
- [`prompts.ts`](ai-agent/prompts.ts) defines the coach behavior and response contract.
- [`types.ts`](ai-agent/types.ts) defines messages, memories, and suggested actions.
- [`app/api/ai/chat/route.ts`](app/api/ai/chat/route.ts) proxies requests to Gemini without exposing the API key.

The coach can save durable memories about obstacles, preferences, successful strategies, and reflections. Suggested goal changes are always presented for approval first.

## Project structure

```text
app/
	api/ai/chat/       Secure AI proxy route
	page.tsx           App shell and data orchestration
components/
	ai/                LittleWins Coach interface
	dashboard/         Today, progress, profile, settings, and shared UI
ai-agent/             Retrieval, prompts, client, and agent types
lib/db.ts             Dexie schema, seed data, and progress helpers
public/               Static assets
```

## Notes for contributors

- Keep user data operations in the Dexie layer and treat the browser as the source of truth.
- Never place API keys in client components or `NEXT_PUBLIC_*` variables.
- Preserve the app's low-pressure language: supportive, specific, and non-judgmental.
- Run `npm run build` before shipping changes that affect routes, types, or the AI integration.
