import Dexie, { type Table } from 'dexie'

export type ObjectiveType =
  | 'boolean'
  | 'counter'
  | 'duration'
  | 'quantity'

export type Category =
  | 'Health'
  | 'Nutrition'
  | 'Mind'
  | 'Fitness'
  | 'Relationships'
  | 'Self-care'
  | 'Learning'
  | 'Custom'

export type Objective = {
  id?: number
  title: string
  icon: string
  description?: string
  category: Category
  type: ObjectiveType
  target: number
  unit: string
  frequency: string
  activeDays: number[]
  why?: string
  active: boolean
  order: number
  createdAt: string
}

export type DailyProgress = {
  id?: number
  objectiveId: number
  date: string
  value: number
  completed: boolean
}

export type DaySummary = {
  id?: number
  date: string
  completedObjectives: number
  totalObjectives: number
  completionPercentage: number
}

export type AppSettings = {
  id?: number
  onboardingComplete: boolean
  theme: 'light' | 'dark' | 'system'
  accent: string
  name?: string
  nickname?: string
  age?: number
  avatar?: string
}

export type Quote = {
  id?: number
  text: string
  category: string
}

export type AIMemory = {
  id?: number
  kind:
    | 'failure'
    | 'success'
    | 'preference'
    | 'pattern'
    | 'reflection'

  objectiveId?: number
  objectiveTitle?: string

  text: string
  tags: string[]
  importance: number
  createdAt: string
}

export type AIChatMessage = {
  id?: number
  role: 'user' | 'assistant'
  text: string
  quote?: string
  createdAt: string
}

export const quotes: Quote[] = [
  ['Small progress is still progress.', 'Keep going'],

  [
    'You don’t need a perfect day. Just make one good choice.',
    'Morning motivation',
  ],

  [
    'You’re already halfway there. Keep going.',
    'Halfway there',
  ],

  [
    'Take care of yourself like someone you love.',
    'Self-care',
  ],

  [
    'Today you kept the promises you made to yourself.',
    'Completed day',
  ],

  [
    'One small action is enough to begin.',
    'Morning motivation',
  ],

  [
    'Your future self is cheering for today’s tiny choice.',
    'Keep going',
  ],

  [
    'Gentle consistency beats intense perfection.',
    'Keep going',
  ],

  [
    'You are allowed to grow at your own pace.',
    'Self-care',
  ],

  [
    'A little care can change the shape of a whole day.',
    'Self-care',
  ],

  [
    'You can do hard things in small steps.',
    'Keep going',
  ],

  [
    'Pause. Breathe. Begin again.',
    'Self-care',
  ],

  [
    'The kindest thing you can do is keep showing up.',
    'Keep going',
  ],

  [
    'Your effort counts, even when nobody sees it.',
    'Keep going',
  ],

  [
    'Make room for what makes you feel alive.',
    'Morning motivation',
  ],

  [
    'Connection is a form of nourishment.',
    'Relationships',
  ],

  [
    'Today is another opportunity to be on your own side.',
    'Morning motivation',
  ],

  [
    'Progress has many quiet shapes.',
    'Keep going',
  ],

  [
    'You are building a life from ordinary moments.',
    'Completed day',
  ],

  [
    'Celebrate the choice, not just the outcome.',
    'Completed day',
  ],

  [
    'A slower pace can still take you somewhere beautiful.',
    'Self-care',
  ],

  [
    'Your attention is a gift. Spend it with care.',
    'Relationships',
  ],

  [
    'There is no wrong way to begin again.',
    'Morning motivation',
  ],

  [
    'Tiny rituals become trusted anchors.',
    'Keep going',
  ],

  [
    'You deserve the same encouragement you give others.',
    'Self-care',
  ],

  [
    'One glass, one page, one breath at a time.',
    'Keep going',
  ],

  [
    'Let today be simple and meaningful.',
    'Morning motivation',
  ],

  [
    'You are closer than you think.',
    'Almost finished',
  ],

  [
    'Keep a little room for joy.',
    'Relationships',
  ],

  [
    'Done is a beautiful place to arrive.',
    'Completed day',
  ],

  [
    'Your little wins are adding up.',
    'Completed day',
  ],
].map(([text, category], index) => ({
  id: index + 1,
  text,
  category,
}))

export const defaultObjectives: Objective[] = [
  [
    'Drink water',
    '💧',
    'Health',
    'counter',
    8,
    'glasses',
    'Stay hydrated for steady energy.',
  ],

  [
    'Eat breakfast',
    '🍳',
    'Nutrition',
    'boolean',
    1,
    '',
    'Start the day with care.',
  ],

  [
    'Eat lunch',
    '🥗',
    'Nutrition',
    'boolean',
    1,
    '',
    'A nourishing pause in the middle of your day.',
  ],

  [
    'Eat dinner',
    '🍲',
    'Nutrition',
    'boolean',
    1,
    '',
    'Close the day with something nourishing.',
  ],

  [
    'Read a book',
    '📖',
    'Learning',
    'duration',
    30,
    'min',
    'I want to learn something every day.',
  ],

  [
    'Move your body',
    '🏃',
    'Fitness',
    'duration',
    20,
    'min',
    'Feel strong and present in my body.',
  ],

  [
    'Quality time',
    '🌿',
    'Relationships',
    'duration',
    30,
    'min',
    'Be more present with the people I love.',
  ],

  [
    'Express appreciation',
    '❤️',
    'Relationships',
    'boolean',
    1,
    '',
    'Tell someone I appreciate them today.',
  ],

  [
    'Relax / self-care',
    '🫧',
    'Self-care',
    'duration',
    15,
    'min',
    'Make space to come back to myself.',
  ],
].map(
  (
    [title, icon, category, type, target, unit, why],
    index,
  ) => ({
    id: index + 1,

    title: title as string,
    icon: icon as string,

    category: category as Category,

    type: type as ObjectiveType,

    target: target as number,
    unit: unit as string,

    frequency: 'Every day',

    activeDays: [0, 1, 2, 3, 4, 5, 6],

    why: why as string,

    active: true,

    order: index,

    createdAt: new Date().toISOString(),
  }),
)

class LittleWinsDB extends Dexie {
  objectives!: Table<Objective, number>

  dailyProgress!: Table<DailyProgress, number>

  summaries!: Table<DaySummary, number>

  settings!: Table<AppSettings, number>

  quotes!: Table<Quote, number>

  aiMemories!: Table<AIMemory, number>

  aiChat!: Table<AIChatMessage, number>

  constructor() {
    super('littlewins')

    this.version(1).stores({
      objectives: '++id, active, order',

      dailyProgress:
        '++id, objectiveId, date, [objectiveId+date]',

      summaries:
        '++id, date',

      settings:
        '++id',

      quotes:
        '++id, category',
    })

    this.version(2).stores({
      objectives:
        '++id, active, order',

      dailyProgress:
        '++id, objectiveId, date, [objectiveId+date]',

      summaries:
        '++id, date',

      settings:
        '++id',

      quotes:
        '++id, category',

      aiMemories:
        '++id, kind, objectiveId, createdAt, importance',

      aiChat:
        '++id, role, createdAt',
    })
  }
}

export const db = new LittleWinsDB()

export function todayKey() {
  const now = new Date()

  const year = now.getFullYear()

  const month = String(
    now.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    now.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * IMPORTANT:
 *
 * React Strict Mode runs some effects twice during development.
 *
 * Using add() here can therefore produce:
 *
 * ConstraintError:
 * Key already exists in the object store.
 *
 * put() and bulkPut() make this initialization safe.
 */
export async function seedDatabase() {
  await db.transaction(
    'rw',

    db.settings,

    db.quotes,

    async () => {
      const settings =
        await db.settings.get(1)

      if (!settings) {
        await db.settings.put({
          id: 1,

          onboardingComplete: false,

          theme: 'light',

          accent: 'lavender',
        })
      }

      const quoteCount =
        await db.quotes.count()

      if (quoteCount === 0) {
        await db.quotes.bulkPut(quotes)
      }
    },
  )
}

export function progressPercent(
  value: number,
  target: number,
) {
  if (!Number.isFinite(value)) {
    return 0
  }

  if (!Number.isFinite(target)) {
    return 0
  }

  if (target <= 0) {
    return 0
  }

  return Math.min(
    100,

    Math.max(
      0,

      Math.round(
        (value / target) * 100,
      ),
    ),
  )
}

export function greeting() {
  const hour =
    new Date().getHours()

  if (hour < 12) {
    return 'Good morning'
  }

  if (hour < 18) {
    return 'Good afternoon'
  }

  return 'Good evening'
}