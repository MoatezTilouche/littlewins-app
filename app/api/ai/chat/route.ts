import { NextResponse } from 'next/server'
import { buildContextPrompt, LITTLEWINS_SYSTEM_PROMPT } from '@/ai-agent/prompts'
import type { CoachContext } from '@/ai-agent/types'

export const runtime = 'nodejs'

function stripFences(text: string) {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    if (!apiKey) return NextResponse.json({ error: 'Missing GEMINI_API_KEY. Add it to .env.local.' }, { status: 503 })

    const body = (await request.json()) as { message?: string; context?: CoachContext }
    if (!body.message?.trim() || !body.context) return NextResponse.json({ error: 'Message and context are required.' }, { status: 400 })

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: LITTLEWINS_SYSTEM_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: buildContextPrompt(body.context, body.message) }] }],
        generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
      }),
    })

    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data?.error?.message || 'LLM request failed.' }, { status: res.status })
    const text = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('')
    if (!text) return NextResponse.json({ error: 'The model returned an empty response.' }, { status: 502 })

    return NextResponse.json(JSON.parse(stripFences(text)))
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected AI error.' }, { status: 500 })
  }
}
