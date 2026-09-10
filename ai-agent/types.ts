import type { Objective } from '@/lib/db'

export type MemoryKind = 'failure' | 'success' | 'preference' | 'pattern' | 'reflection'

export type RetrievedMemory = {
  id?: number
  kind: MemoryKind
  objectiveId?: number
  objectiveTitle?: string
  text: string
  tags: string[]
  createdAt: string
  importance: number
  score?: number
}

export type CoachContext = {
  userName?: string
  userGoals?: string[]
  today: string
  todayCompletion: number
  objectives: Array<Pick<Objective, 'id' | 'title' | 'category' | 'type' | 'target' | 'unit' | 'why'>>
  todayProgress: Array<{ objectiveId: number; value: number; completed: boolean }>
  recentCompletion?: Array<{ date: string; percentage: number }>
  retrievedMemories?: RetrievedMemory[]
}

export type AgentAction =
  | { type: 'suggest_goal_change'; objectiveId: number; objectiveTitle: string; currentTarget: number; suggestedTarget: number; reason: string }
  | { type: 'suggest_new_goal'; title: string; icon: string; category: string; trackingType: 'boolean' | 'counter' | 'duration' | 'quantity'; target: number; unit: string; why: string; reason: string }
  | { type: 'none' }

export type AgentResponse = {
  message: string
  quote?: string
  action?: AgentAction
  memoryToSave?: { kind: MemoryKind; objectiveId?: number; objectiveTitle?: string; text: string; tags: string[]; importance: number }
}
