'use client'

import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Brain, Check, ChevronRight, Loader2, MessageCircleHeart, Quote, RefreshCw, Sparkles, Target } from 'lucide-react'
import { askLittleWins } from '@/ai-agent/client'
import type { AgentAction, AgentResponse } from '@/ai-agent/types'
import { db, todayKey, type Category, type ObjectiveType } from '@/lib/db'
import { toast } from 'sonner'

const starterQuestions = [
  'What do you want to improve in your life right now?',
  'What usually makes it hardest for you to stay consistent?',
  'Do you prefer very easy daily goals first, or goals that challenge you a little?',
]

export function CoachPage() {
  const messages = useLiveQuery(() => db.aiChat.orderBy('createdAt').toArray(), []) || []
  const memories = useLiveQuery(() => db.aiMemories.orderBy('createdAt').reverse().limit(12).toArray(), []) || []
  const objectives = useLiveQuery(() => db.objectives.where('active').equals(1).toArray(), []) || []
  const progress = useLiveQuery(() => db.dailyProgress.where('date').equals(todayKey()).toArray(), []) || []
  const summaries = useLiveQuery(() => db.summaries.orderBy('date').reverse().limit(7).toArray(), []) || []
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [pendingAction, setPendingAction] = useState<AgentAction | null>(null)

  const incomplete = useMemo(() => objectives.filter(o => !progress.find(p => p.objectiveId === o.id)?.completed), [objectives, progress])
  const weekAverage = summaries.length ? Math.round(summaries.reduce((a, b) => a + b.completionPercentage, 0) / summaries.length) : 0

  async function send(message = input, retrieval = '') {
    const text = message.trim()
    if (!text || loading) return
    setInput('')
    setLoading(true)
    await db.aiChat.add({ role: 'user', text, createdAt: new Date().toISOString() })
    try {
      const result = await askLittleWins(text, retrieval)
      await db.aiChat.add({ role: 'assistant', text: result.message, quote: result.quote, createdAt: new Date().toISOString() })
      if (result.action && result.action.type !== 'none') setPendingAction(result.action)
    } catch (error) {
      const text = error instanceof Error ? error.message : 'LittleWins AI is unavailable.'
      await db.aiChat.add({ role: 'assistant', text: `I couldn't reach my AI brain just now. ${text}`, createdAt: new Date().toISOString() })
    } finally {
      setLoading(false)
    }
  }

  async function acceptAction(action: AgentAction) {
    if (action.type === 'suggest_goal_change') {
      await db.objectives.update(action.objectiveId, { target: action.suggestedTarget })
      toast.success('Goal adjusted for your next little win')
    }
    if (action.type === 'suggest_new_goal') {
      const count = await db.objectives.count()
      await db.objectives.add({
        title: action.title,
        icon: action.icon,
        category: action.category as Category,
        type: action.trackingType as ObjectiveType,
        target: action.target,
        unit: action.unit,
        why: action.why,
        frequency: 'Every day',
        activeDays: [0,1,2,3,4,5,6],
        active: true,
        order: count,
        createdAt: new Date().toISOString(),
      })
      toast.success('New objective added')
    }
    setPendingAction(null)
  }

  const firstQuestion = starterQuestions[Math.min(messages.filter(m => m.role === 'user').length, starterQuestions.length - 1)]

  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
    <section className="overflow-hidden rounded-[2rem] border border-border/60 bg-background shadow-sm">
      <div className="border-b border-border/60 bg-gradient-to-r from-violet-50 via-fuchsia-50/60 to-amber-50 px-6 py-6 dark:from-violet-950/35 dark:via-fuchsia-950/20 dark:to-amber-950/20">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 text-2xl shadow-lg shadow-violet-500/15">🌱</div>
          <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h1 className="text-xl font-semibold">LittleWins Coach</h1><span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">AI</span></div><p className="mt-1 text-sm text-muted-foreground">Learns from your wins, obstacles and routines.</p></div>
          <Brain className="hidden size-6 text-violet-500 sm:block" />
        </div>
      </div>

      <div className="flex min-h-[560px] flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-5 sm:p-6">
          {messages.length === 0 && <div className="mx-auto max-w-lg py-12 text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-violet-100 text-3xl dark:bg-violet-950">✨</div><h2 className="mt-5 text-2xl font-semibold">Let’s understand what matters to you.</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">I’ll ask a few natural questions, then use your answers and daily progress to suggest goals that fit your real life.</p><button onClick={() => send(firstQuestion === starterQuestions[0] ? 'I am ready. Ask me what I want to improve.' : firstQuestion)} className="mt-6 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">Start the conversation</button></div>}

          {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[86%] rounded-[1.5rem] px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${message.role === 'user' ? 'rounded-br-md bg-foreground text-background' : 'rounded-bl-md bg-muted/70'}`}><p>{message.text}</p>{message.quote && <div className="mt-3 flex gap-2 rounded-xl bg-background/70 p-3 text-foreground"><Quote className="mt-0.5 size-4 shrink-0 text-violet-500"/><p className="font-serif italic">“{message.quote}”</p></div>}</div></div>)}

          {loading && <div className="flex justify-start"><div className="flex items-center gap-2 rounded-[1.5rem] rounded-bl-md bg-muted/70 px-4 py-3 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin"/>LittleWins is thinking with your recent patterns…</div></div>}

          <AnimatePresence>{pendingAction && pendingAction.type !== 'none' && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mx-auto max-w-xl rounded-[1.75rem] border border-violet-200 bg-violet-50/70 p-5 dark:border-violet-900 dark:bg-violet-950/30"><div className="flex items-center gap-2 text-violet-700 dark:text-violet-300"><Sparkles className="size-4"/><span className="text-xs font-bold uppercase tracking-wider">Suggested adjustment</span></div>{pendingAction.type === 'suggest_goal_change' ? <><h3 className="mt-3 text-lg font-semibold">{pendingAction.objectiveTitle}</h3><p className="mt-1 text-sm text-muted-foreground"><span className="line-through">{pendingAction.currentTarget}</span> → <strong className="text-foreground">{pendingAction.suggestedTarget}</strong></p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pendingAction.reason}</p></> : <><h3 className="mt-3 text-lg font-semibold">{pendingAction.icon} {pendingAction.title}</h3><p className="mt-2 text-sm text-muted-foreground">Target: {pendingAction.target} {pendingAction.unit}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{pendingAction.reason}</p></>}<div className="mt-5 flex gap-2"><button onClick={() => acceptAction(pendingAction)} className="flex-1 rounded-xl bg-foreground py-3 text-sm font-semibold text-background"><Check className="mr-1 inline size-4"/>Accept</button><button onClick={() => setPendingAction(null)} className="flex-1 rounded-xl border border-border bg-background py-3 text-sm font-semibold">Keep current plan</button></div></motion.div>}</AnimatePresence>
        </div>

        <div className="border-t border-border/60 p-4 sm:p-5">
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1 text-xs">
            <button onClick={() => send('Based on my progress, what is my easiest useful next little win today?')} className="whitespace-nowrap rounded-full border border-border px-3 py-2 hover:bg-muted">What should I do next?</button>
            <button onClick={() => send('Analyze my recent progress. Is any objective too easy or too hard?')} className="whitespace-nowrap rounded-full border border-border px-3 py-2 hover:bg-muted">Adapt my goals</button>
            <button onClick={() => send('Give me a personalized reflection and motivational quote based only on my actual recent progress.')} className="whitespace-nowrap rounded-full border border-border px-3 py-2 hover:bg-muted">Reflect on my week</button>
          </div>
          <form onSubmit={e => { e.preventDefault(); send() }} className="flex items-end gap-2 rounded-[1.5rem] border border-input bg-muted/30 p-2 focus-within:ring-2 focus-within:ring-violet-300"><textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} rows={1} placeholder="Tell LittleWins what’s on your mind…" className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none"/><button disabled={!input.trim() || loading} className="flex size-11 shrink-0 items-center justify-center rounded-full bg-foreground text-background disabled:opacity-40"><ArrowUp className="size-5"/></button></form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">Relevant memories are retrieved locally; only selected context is sent to the AI.</p>
        </div>
      </div>
    </section>

    <aside className="space-y-4">
      <section className="rounded-[2rem] border border-border/60 bg-background p-5"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">This week</p><p className="mt-2 text-3xl font-semibold">{weekAverage}%</p></div><div className="flex size-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-950"><Target/></div></div><p className="mt-3 text-sm text-muted-foreground">Average daily completion from your recent history.</p></section>

      {incomplete.length > 0 && <section className="rounded-[2rem] border border-amber-200/70 bg-amber-50/60 p-5 dark:border-amber-900 dark:bg-amber-950/20"><div className="flex items-center gap-2"><MessageCircleHeart className="size-5 text-amber-600"/><h2 className="font-semibold">What got in the way?</h2></div><p className="mt-2 text-sm leading-relaxed text-muted-foreground">If a goal didn’t happen, tell me why. The reason can become useful memory for future advice.</p><div className="mt-4 space-y-2">{incomplete.slice(0,4).map(o => <button key={o.id} onClick={() => send(`I did not complete my objective "${o.title}". Ask me why, one question at a time, and use my answer to help adapt this goal without judging me.`, `${o.title} failure obstacle reason`)} className="flex w-full items-center justify-between rounded-xl bg-background px-3 py-3 text-left text-sm font-medium shadow-sm"><span>{o.icon} {o.title}</span><ChevronRight className="size-4 text-muted-foreground"/></button>)}</div></section>}

      <section className="rounded-[2rem] border border-border/60 bg-background p-5"><div className="flex items-center gap-2"><Brain className="size-5 text-violet-500"/><h2 className="font-semibold">Agent memory</h2></div><p className="mt-2 text-sm text-muted-foreground">Important patterns saved on this device.</p>{memories.length ? <div className="mt-4 space-y-3">{memories.slice(0,4).map(m => <div key={m.id} className="rounded-xl bg-muted/50 p-3"><div className="flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">{m.kind}</span><span className="text-[10px] text-muted-foreground">importance {m.importance}/5</span></div><p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{m.text}</p></div>)}</div> : <div className="mt-4 rounded-xl bg-muted/40 p-4 text-center text-xs text-muted-foreground">No patterns yet. They’ll appear as LittleWins learns what helps or blocks you.</div>}</section>

      <button onClick={async () => { await db.aiChat.clear(); setPendingAction(null); toast.success('Coach conversation cleared. Learned memories were kept.') }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-xs font-semibold text-muted-foreground hover:bg-muted"><RefreshCw className="size-3.5"/>Clear chat, keep learned patterns</button>
    </aside>
  </div>
}
