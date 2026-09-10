import { db, todayKey } from '@/lib/db'
import { retrieveMemories } from './rag'
import type { AgentResponse, CoachContext } from './types'

export async function buildCoachContext(): Promise<CoachContext> {
  const [objectives, progress, summaries, settings, memories] = await Promise.all([
    db.objectives.where('active').equals(1).toArray(),
    db.dailyProgress.where('date').equals(todayKey()).toArray(),
    db.summaries.orderBy('date').reverse().limit(14).toArray(),
    db.settings.get(1),
    db.aiMemories.orderBy('createdAt').reverse().limit(150).toArray(),
  ])

  return {
    userName: settings?.nickname || settings?.name,
    today: todayKey(),
    todayCompletion: summaries.find(s => s.date === todayKey())?.completionPercentage || 0,
    objectives: objectives.map(o => ({ id: o.id, title: o.title, category: o.category, type: o.type, target: o.target, unit: o.unit, why: o.why })),
    todayProgress: progress.map(p => ({ objectiveId: p.objectiveId, value: p.value, completed: p.completed })),
    recentCompletion: summaries.map(s => ({ date: s.date, percentage: s.completionPercentage })),
    retrievedMemories: retrieveMemories(
      [...objectives.map(o => `${o.title} ${o.why || ''}`), ...progress.filter(p => !p.completed).map(p => objectives.find(o => o.id === p.objectiveId)?.title || '')].join(' '),
      memories,
    ),
  }
}

export async function askLittleWins(userMessage: string, extraRetrievalText = ''): Promise<AgentResponse> {
  const [context, allMemories] = await Promise.all([
    buildCoachContext(),
    db.aiMemories.orderBy('createdAt').reverse().limit(200).toArray(),
  ])
  context.retrievedMemories = retrieveMemories(`${userMessage} ${extraRetrievalText}`, allMemories)

  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage, context }),
  })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || 'LittleWins AI is unavailable.')
  const result = (await response.json()) as AgentResponse
  if (result.memoryToSave) {
    await db.aiMemories.add({ ...result.memoryToSave, createdAt: new Date().toISOString() })
  }
  return result
}
