# 🌱 LittleWins

<div align="center">

## Small steps. Real progress. A kinder way to grow.

**LittleWins is an AI-powered wellbeing and habit companion that learns from your daily progress, understands your obstacles, and helps you build realistic routines over time.**

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![Gemini](https://img.shields.io/badge/AI-Gemini-8E75B2?style=for-the-badge\&logo=google)
![IndexedDB](https://img.shields.io/badge/Storage-IndexedDB-FFCA28?style=for-the-badge)

</div>

---

## ✨ What is LittleWins?

LittleWins helps users transform broad intentions like:

> “I want to become healthier.”

into small, achievable actions such as:

* 💧 Drink 8 glasses of water
* 📖 Read for 15 minutes
* 🏃 Move for 20 minutes
* ❤️ Show appreciation to someone
* 🌿 Take time for yourself
* 🍽️ Eat your important meals

But LittleWins goes further than a traditional habit tracker.

It includes an **AI Coach** that can learn from progress, ask why goals were missed, detect recurring obstacles, suggest easier or harder challenges, and generate personalized motivation based on the user's real behavior.

---

# 🤖 Meet the LittleWins AI Coach

The AI Coach is designed to behave like a supportive personal growth companion rather than a generic chatbot.

### 🧠 Understand the user

When the user starts using LittleWins, the Coach can ask questions to understand:

* what they want to improve
* their current habits
* their preferred difficulty
* what usually prevents them from reaching their goals
* what motivates them
* what kind of routine fits their lifestyle

The Coach can then recommend suitable starting objectives.

---

### 🎯 Adaptive goals

LittleWins analyzes performance over time.

If a goal becomes too easy:

```text
📖 Reading

Goal: 10 minutes

Last 7 days:
✅ ✅ ✅ ✅ ✅ ✅ ✅

LittleWins:
"You've completed this every day.
Would you like to try 15 minutes next week?"
```

If a goal is too difficult:

```text
🏃 Exercise

Goal: 30 minutes

Completion this week: 28%

LittleWins:
"This goal seems difficult right now.
Would you like to try a 10-minute version first?"
```

The AI never silently modifies objectives.

Every change is presented to the user for approval first.

---

### 💬 Understand why goals fail

When an objective is missed, LittleWins can ask:

> “What got in the way today?”

Possible answers:

* 😴 Too tired
* ⏰ No time
* 🧠 Forgot
* 😕 No motivation
* 🤒 Didn't feel well
* ✍️ Something else

These answers can be stored as important AI memories.

Over time, LittleWins can detect patterns.

Example:

```text
Pattern detected:

Exercise missed 4 times.

3 failures were related to:
"Too tired after work"

AI recommendation:

"Evening workouts may not fit your routine.
Would you like to try a shorter morning session instead?"
```

---

# 🧠 Local RAG Memory

LittleWins uses a lightweight **local RAG-style memory system**.

Instead of sending the user's entire history to the AI every time, the app retrieves only the most relevant memories.

Example:

```text
User message
     ↓
Local progress
     ↓
Relevant memory retrieval
     ↓
Past failures / preferences / successes
     ↓
Selected context
     ↓
Gemini
     ↓
Personalized response
```

Useful memories can include:

```text
"User often skips exercise because they are tired after work."

"Reading goals are completed consistently."

"Short goals work better during weekdays."

"User prefers encouraging rather than strict coaching."
```

This helps the AI provide more relevant suggestions while keeping the system lightweight.

---

# ✨ Personalized Motivation

LittleWins can generate motivation based on the user's actual progress.

Instead of generic quotes like:

> “Never give up!”

LittleWins can generate something more personal:

> “You have shown that consistency comes naturally to you with reading. Bring the same small-step approach to movement this week.”

Personalized motivation can be generated:

* 🌅 daily
* 📅 weekly
* 🗓️ monthly
* 🎯 after reaching a milestone
* 💭 after understanding why a goal was missed

---

# 🏠 Product Experience

| Area              | What it does                                           |
| ----------------- | ------------------------------------------------------ |
| 🏠 **Today**      | Complete daily objectives and see overall progress     |
| 🤖 **AI Coach**   | Talk about obstacles, goals, routines, and next steps  |
| 🎯 **Objectives** | Create, edit, organize, and remove habits              |
| 📊 **Progress**   | View streaks, averages, completion history, and trends |
| ✨ **Motivation**  | Read encouraging and personalized messages             |
| 👤 **Profile**    | Personalize name, nickname, age, and avatar            |
| ⚙️ **Settings**   | Appearance, export, reset, and privacy controls        |

---

# 🎯 Objective Types

LittleWins supports several kinds of goals.

### ✅ Boolean

```text
Express appreciation ❤️

[ Mark as done ]
```

### 🔢 Counter

```text
Drink water 💧

5 / 8 glasses

[-]     [+]
```

### ⏱️ Duration

```text
Read 📖

15 / 30 min

+5 min
```

### 📏 Quantity

```text
Drink water

1.4 / 2 L
```

---

# 🎨 UI Philosophy

LittleWins is intentionally designed to feel:

* 🌿 calm
* 💜 encouraging
* ✨ playful
* 🧘 low-pressure
* 🎯 focused
* 📱 mobile-friendly

The interface avoids aggressive productivity language.

Instead of:

```text
❌ You failed your goal.
```

LittleWins prefers:

```text
🌱 Today didn't go as planned.

What made this objective difficult?
```

The goal is to help users understand themselves rather than punish them.

---

# 🎞️ Animations & Microinteractions

LittleWins uses **Framer Motion** to make the interface feel responsive and alive.

Examples include:

* animated progress rings
* animated progress bars
* smooth page transitions
* completion animations
* onboarding transitions
* AI message appearance
* goal suggestion cards
* success feedback
* subtle hover and tap interactions

You can add a preview GIF here:

```md
![LittleWins Demo](public/demo.gif)
```

Recommended README assets:

```text
public/
├── screenshots/
│   ├── today.png
│   ├── ai-coach.png
│   ├── progress.png
│   └── objectives.png
│
└── demo.gif
```

Then display them like:

```md
![LittleWins Today](public/screenshots/today.png)
```

---

# 🛠️ Tech Stack

### Frontend

* ⚡ Next.js 16
* ⚛️ React 19
* 🔷 TypeScript
* 🎨 Tailwind CSS 4
* 🎞️ Framer Motion
* 📊 Recharts
* 🧩 Lucide React

### Local persistence

* 🗃️ Dexie
* 🌐 IndexedDB

### Artificial Intelligence

* 🤖 Google Gemini
* 🧠 Local RAG-style memory retrieval
* 💬 Conversational coaching
* 🎯 Adaptive objective suggestions
* 📊 Behavioral pattern analysis

---

# 🔐 Privacy-first architecture

LittleWins does **not require a server-side application database**.

User data remains inside the browser using IndexedDB.

Stored locally:

```text
Objectives
Daily progress
History
Profile
Settings
Chat history
AI memories
Failure reasons
Patterns
```

When the AI Coach is called:

```text
Browser
   ↓
Relevant local context
   ↓
/api/ai/chat
   ↓
Gemini API
   ↓
AI response
```

Only relevant selected context is sent to the AI.

The Gemini API key remains server-side.

---

# 📁 Project Structure

```text
LittleWins/
│
├── app/
│   ├── api/
│   │   └── ai/
│   │       └── chat/
│   │           └── route.ts
│   │
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── ai/
│   │   └── CoachPage.tsx
│   │
│   └── littlewins/
│       ├── Today.tsx
│       ├── Objectives.tsx
│       ├── ProgressView.tsx
│       ├── Motivation.tsx
│       ├── Profile.tsx
│       ├── SettingsView.tsx
│       ├── ObjectiveCard.tsx
│       ├── ObjectiveForm.tsx
│       ├── ProgressRing.tsx
│       └── Onboarding.tsx
│
├── ai-agent/
│   ├── client.ts
│   ├── rag.ts
│   ├── prompts.ts
│   └── types.ts
│
├── lib/
│   └── db.ts
│
├── public/
│
├── package.json
└── README.md
```

---

# 🤖 AI Architecture

The AI system is separated into several responsibilities.

```text
                    LittleWins AI
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼

   Goal Planner    Progress Analyzer    Coach

        │                │                │
        ▼                ▼                ▼

 Adaptive Goals    Pattern Detection   Conversation

        │                │
        ▼                ▼

 Failure Analysis   Motivation Generator
```

These are logical responsibilities and can all use the same Gemini model.

---

# 🧠 AI Memory Types

LittleWins can store important memories such as:

```ts
type AIMemory = {
  kind:
    | "failure"
    | "success"
    | "preference"
    | "pattern"
    | "reflection"

  objectiveId?: number

  objectiveTitle?: string

  text: string

  tags: string[]

  importance: number

  createdAt: string
}
```

Example memory:

```json
{
  "kind": "failure",
  "objectiveTitle": "Exercise",
  "text": "User often feels too tired after work to exercise.",
  "tags": [
    "exercise",
    "evening",
    "fatigue"
  ],
  "importance": 8
}
```

The retrieval layer can use these memories to provide better future recommendations.

---

# 🚀 Run locally

### 1. Clone the project

```bash
git clone YOUR_REPOSITORY_URL
cd littlewins
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Gemini

Create:

```text
.env.local
```

Then add:

```env
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

Never expose the Gemini key using:

```env
NEXT_PUBLIC_GEMINI_API_KEY
```

The API key must remain server-side.

### 4. Start LittleWins

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# ☁️ Deploy on Vercel

LittleWins works well with Vercel because the Next.js AI route can run as a serverless endpoint.

After importing the repository into Vercel, create these environment variables:

```text
GEMINI_API_KEY
GEMINI_MODEL
```

Example:

```text
GEMINI_MODEL=gemini-2.5-flash
```

Then redeploy the project.

---

# 💾 Backups

Because user data is local to the browser, users can export their LittleWins data.

The JSON backup can contain:

```text
Objectives
Progress
History
Profile
Settings
AI memories
AI conversation history
```

This makes it possible to preserve progress before clearing browser storage or switching devices.

---

# 🗺️ Future Ideas

Some possible next steps:

* 🔔 Smart reminders
* 📅 Weekly AI planning
* 🧠 Better semantic RAG with embeddings
* 📈 AI-generated progress reports
* 🌤️ Mood tracking
* 💤 Sleep tracking
* 🏆 Challenges and achievements
* 👥 Shared challenges with friends
* 📱 Progressive Web App support
* 🎙️ Voice conversations with LittleWins
* 🔄 Optional cloud synchronization
* 🎨 Custom themes
* 🧩 AI-generated objectives
* 🧠 Long-term behavioral insights

---

# 💜 Philosophy

LittleWins is built around one simple idea:

> **Improvement should feel encouraging, not exhausting.**

You don't need to transform your whole life today.

Drink one glass.

Read one page.

Move for five minutes.

Tell someone you love them.

Then do another little thing tomorrow.

## 🌱 Small steps. Real progress. LittleWins.
