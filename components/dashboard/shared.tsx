'use client'

import { motion } from 'framer-motion'
import { Check, Leaf, Plus } from 'lucide-react'
import { progressPercent, type Objective } from '@/lib/db'

export const categoryStyles: Record<string, string> = {
  Health: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
  Nutrition: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  Mind: 'bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300',
  Fitness: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300',
  Relationships: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
  'Self-care': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  Learning: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
  Custom: 'bg-muted text-muted-foreground',
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle: string; action?: () => void }) {
  return <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h1 className="text-4xl font-semibold tracking-tight">{title}</h1><p className="mt-2 text-muted-foreground">{subtitle}</p></div>{action && <button onClick={action} className="flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"><Plus className="size-4" />Add objective</button>}</div>
}

export function ProgressRing({ value }: { value: number }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
  const offset = circumference - circumference * safeValue / 100
  return <svg className="size-28 -rotate-90" viewBox="0 0 112 112"><circle cx="56" cy="56" r={radius} fill="none" stroke="white" strokeOpacity={0.2} strokeWidth="8" /><motion.circle cx="56" cy="56" r={radius} fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 0.6, ease: 'easeOut' }} /></svg>
}

export function ObjectiveCard({ objective, value, update }: { objective: Objective; value: number; update: (objective: Objective, value: number) => void }) {
  const percent = progressPercent(value, objective.target)
  const done = percent >= 100
  const step = objective.type === 'duration' ? 5 : 1
  return <motion.div layout whileTap={{ scale: 0.98 }} className={`rounded-[1.65rem] border border-border/60 bg-background p-5 shadow-sm ${done ? 'ring-2 ring-violet-200 dark:ring-violet-900' : ''}`}><div className="flex items-start justify-between"><div className={`flex size-12 items-center justify-center rounded-2xl text-2xl ${categoryStyles[objective.category]}`}>{objective.icon}</div>{done ? <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500 text-white"><Check className="size-4" /></div> : <span className="text-xs font-semibold text-muted-foreground">{objective.category}</span>}</div><h3 className="mt-4 font-semibold">{objective.title}</h3><p className="mt-1 min-h-5 text-sm text-muted-foreground">{objective.description || objective.why || 'A small choice for a better day.'}</p>{objective.type !== 'boolean' ? <><div className="mt-5 flex items-end justify-between"><span className="text-2xl font-semibold">{value}<span className="text-sm font-normal text-muted-foreground"> / {objective.target} {objective.unit}</span></span><span className="text-sm font-bold text-violet-600">{percent}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" /></div><div className="mt-4 flex gap-2"><button onClick={() => update(objective, value - step)} className="flex size-10 items-center justify-center rounded-xl bg-muted text-lg font-medium">−</button><button onClick={() => update(objective, value + step)} className="flex-1 rounded-xl bg-foreground text-sm font-semibold text-background">+ {step} {objective.unit}</button></div></> : <button onClick={() => update(objective, done ? 0 : 1)} className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold ${done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-foreground text-background'}`}>{done ? 'Completed today' : 'Mark as done'}</button>}</motion.div>
}

export function EmptyState({ onAdd }: { onAdd: () => void }) { return <div className="mt-5 rounded-[2rem] border border-dashed border-border p-12 text-center"><Leaf className="mx-auto mb-4 text-emerald-500" /><h3 className="text-xl font-semibold">Your day is a blank canvas.</h3><button onClick={onAdd} className="mt-5 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background">Create objective</button></div> }

export function Stat({ label, value, icon }: { label: string; value: string | number; icon: string }) { return <div className="rounded-3xl border border-border/60 bg-background p-5"><span className="text-2xl">{icon}</span><p className="mt-5 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div> }

export function calculateStreak(history: Array<{ completionPercentage: number }>) { let streak = 0; for (let index = history.length - 1; index >= 0; index--) { if (history[index].completionPercentage === 100) streak++; else break } return streak }
