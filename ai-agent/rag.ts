import type { RetrievedMemory } from './types'

const STOP = new Set(['the','a','an','and','or','to','of','in','on','for','is','it','i','me','my','you','your','was','were','am','are','be','been','with','that','this','at','as','but','so','because'])

function tokens(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(x => x.length > 2 && !STOP.has(x))
}

function vector(text: string) {
  const v = new Map<string, number>()
  for (const token of tokens(text)) v.set(token, (v.get(token) || 0) + 1)
  return v
}

function cosine(a: Map<string, number>, b: Map<string, number>) {
  let dot = 0, aa = 0, bb = 0
  for (const n of a.values()) aa += n * n
  for (const n of b.values()) bb += n * n
  for (const [k, n] of a) dot += n * (b.get(k) || 0)
  return aa && bb ? dot / Math.sqrt(aa * bb) : 0
}

/**
 * Lightweight local RAG retrieval. It deliberately avoids an embedding API so
 * LittleWins can keep its long-term memory on-device. Relevant memories are
 * retrieved locally, then only the top matches are sent to the LLM.
 */
export function retrieveMemories(query: string, memories: RetrievedMemory[], limit = 6) {
  const q = vector(query)
  return memories
    .map(memory => {
      const semantic = cosine(q, vector(`${memory.objectiveTitle || ''} ${memory.text} ${memory.tags.join(' ')}`))
      const importanceBoost = Math.min(0.15, memory.importance * 0.03)
      return { ...memory, score: semantic + importanceBoost }
    })
    .filter(m => (m.score || 0) > 0.04)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, limit)
}
