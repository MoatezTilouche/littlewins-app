'use client'

import { useState } from 'react'
import { Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { type Quote as QuoteType } from '@/lib/db'

export function Motivation({ nickname, quotes }: { nickname: string; quotes: QuoteType[] }) { const [index, setIndex] = useState(0); const list = quotes.length ? quotes : [{ text: 'Small progress is still progress.', category: '' }]; return <div className="mx-auto max-w-3xl py-8 text-center"><p className="font-medium text-violet-600">A note for {nickname}</p><h1 className="mt-3 text-4xl font-semibold md:text-6xl">Keep your spark <span className="font-serif italic text-violet-500">close.</span></h1><motion.div key={index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-12 rounded-[2.5rem] bg-gradient-to-br from-violet-500 to-fuchsia-500 px-7 py-16 text-white"><Quote className="mx-auto mb-8 size-10 opacity-60" /><p className="font-serif text-3xl md:text-5xl">“{list[index].text}”</p></motion.div><button onClick={() => setIndex((index + 1) % list.length)} className="mt-8 rounded-full border border-border px-5 py-3 text-sm font-semibold">Give me another quote</button></div> }
