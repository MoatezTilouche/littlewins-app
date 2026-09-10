'use client'

import {
  useEffect,
  useState,
} from 'react'

import {
  useLiveQuery,
} from 'dexie-react-hooks'

import {
  AnimatePresence,
  motion,
} from 'framer-motion'

import {
  Toaster,
  toast,
} from 'sonner'

import {
  db,
  defaultObjectives,
  greeting,
  seedDatabase,
  todayKey,
  type Category,
  type Objective,
  type ObjectiveType,
} from '@/lib/db'

import {
  CoachPage,
} from '@/components/ai/CoachPage'

import { Navigation as DashboardNavigation } from '@/components/dashboard/Navigation'
import { Today as DashboardToday } from '@/components/dashboard/Today'
import { Objectives as DashboardObjectives } from '@/components/dashboard/Objectives'
import { ProgressView as DashboardProgressView } from '@/components/dashboard/ProgressView'
import { Motivation as DashboardMotivation } from '@/components/dashboard/Motivation'
import { Profile as DashboardProfile } from '@/components/dashboard/Profile'
import { SettingsView as DashboardSettingsView } from '@/components/dashboard/SettingsView'
import { ObjectiveForm as DashboardObjectiveForm } from '@/components/dashboard/ObjectiveForm'
import { Onboarding as DashboardOnboarding } from '@/components/dashboard/Onboarding'

const initialForm = {
  title: '',

  icon: '✨',

  category:
    'Health' as Category,

  type:
    'boolean' as ObjectiveType,

  target: 1,

  unit: '',

  frequency:
    'Every day',

  why: '',
}

function calculateStreak(
  history: Array<{
    completionPercentage: number
  }>,
) {
  let streak = 0

  for (
    let index = history.length - 1;
    index >= 0;
    index--
  ) {
    if (
      history[index]
        .completionPercentage === 100
    ) {
      streak++
    } else {
      break
    }
  }

  return streak
}

export default function Page() {
  const [
    page,
    setPage,
  ] = useState('today')

  const [
    showForm,
    setShowForm,
  ] = useState(false)

  const [
    editing,
    setEditing,
  ] =
    useState<Objective | null>(
      null,
    )

  const [
    form,
    setForm,
  ] = useState(initialForm)

  const [
    showOnboarding,
    setShowOnboarding,
  ] = useState(false)

  const [
    onboardingStep,
    setOnboardingStep,
  ] = useState(1)

  const [
    selectedStarter,
    setSelectedStarter,
  ] =
    useState<string[]>([])

  const [
    dark,
    setDark,
  ] = useState(false)

  const objectives =
    useLiveQuery(
      () =>
        db.objectives
          .orderBy('order')
          .toArray(),

      [],
    ) || []

  const progress =
    useLiveQuery(
      () =>
        db.dailyProgress
          .where('date')
          .equals(todayKey())
          .toArray(),

      [],
    ) || []

  const history =
    useLiveQuery(
      () =>
        db.summaries
          .orderBy('date')
          .toArray(),

      [],
    ) || []

  const allProgress =
    useLiveQuery(
      () =>
        db.dailyProgress.toArray(),

      [],
    ) || []

  const savedQuotes =
    useLiveQuery(
      () =>
        db.quotes.toArray(),

      [],
    ) || []

  const settings =
    useLiveQuery(
      () =>
        db.settings.get(1),

      [],
    )

  /**
   * Database initialization.
   *
   * seedDatabase is now safe
   * even when React Strict Mode
   * calls this twice.
   */
  useEffect(() => {
    let mounted = true

    async function initialize() {
      try {
        await seedDatabase()

        const count =
          await db.objectives.count()

        const settings =
          await db.settings.get(1)

        if (
          mounted &&
          !count &&
          !settings?.onboardingComplete
        ) {
          setShowOnboarding(
            true,
          )
        }
      } catch (error) {
        console.error(
          'LittleWins initialization error:',
          error,
        )
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!settings) return

    let shouldBeDark = false

    if (
      settings.theme ===
      'dark'
    ) {
      shouldBeDark = true
    } else if (
      settings.theme ===
      'system'
    ) {
      shouldBeDark =
        window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches
    }

    setDark(shouldBeDark)

    document.documentElement
      .classList.toggle(
        'dark',
        shouldBeDark,
      )
  }, [settings])

  const active =
    objectives.filter(
      objective =>
        objective.active,
    )

  function getValue(
    objective: Objective,
  ) {
    return (
      progress.find(
        item =>
          item.objectiveId ===
          objective.id,
      )?.value || 0
    )
  }

  const completed =
    active.filter(
      objective =>
        progress.find(
          item =>
            item.objectiveId ===
              objective.id &&
            item.completed,
        ),
    ).length

  const percent =
    active.length > 0
      ? Math.round(
          (completed /
            active.length) *
            100,
        )
      : 0

  const profileName =
    settings?.nickname ||
    settings?.name ||
    'friend'

  const avatar =
    settings?.avatar ||
    '🌱'

  async function updateProgress(
    objective: Objective,
    value: number,
  ) {
    if (
      !objective.id
    ) {
      return
    }

    const nextValue =
      Math.max(
        0,

        Math.min(
          objective.target,
          value,
        ),
      )

    const done =
      objective.type ===
      'boolean'
        ? nextValue > 0
        : nextValue >=
          objective.target

    const existing =
      await db.dailyProgress
        .where(
          '[objectiveId+date]',
        )
        .equals([
          objective.id,
          todayKey(),
        ])
        .first()

    if (
      existing?.id
    ) {
      await db.dailyProgress.update(
        existing.id,

        {
          value:
            nextValue,

          completed:
            done,
        },
      )
    } else {
      await db.dailyProgress.add({
        objectiveId:
          objective.id,

        date:
          todayKey(),

        value:
          nextValue,

        completed:
          done,
      })
    }

    const latest =
      await db.dailyProgress
        .where('date')
        .equals(todayKey())
        .toArray()

    const completedNow =
      active.filter(item =>
        latest.find(
          current =>
            current.objectiveId ===
              item.id &&
            current.completed,
        ),
      ).length

    const existingSummary =
      await db.summaries
        .where('date')
        .equals(todayKey())
        .first()

    const summary = {
      date:
        todayKey(),

      completedObjectives:
        completedNow,

      totalObjectives:
        active.length,

      completionPercentage:
        active.length
          ? Math.round(
              (completedNow /
                active.length) *
                100,
            )
          : 0,
    }

    if (
      existingSummary?.id
    ) {
      await db.summaries.update(
        existingSummary.id,
        summary,
      )
    } else {
      await db.summaries.add(
        summary,
      )
    }

    if (
      done &&
      !existing?.completed
    ) {
      const messages = [
        'Nice work!',
        'Another little win.',
        'You’re doing great!',
      ]

      toast.success(
        messages[
          Math.floor(
            Math.random() *
              messages.length,
          )
        ],
      )
    }
  }

  function openCreate() {
    setEditing(null)

    setForm(initialForm)

    setShowForm(true)
  }

  function openEdit(
    objective: Objective,
  ) {
    setEditing(objective)

    setForm({
      title:
        objective.title,

      icon:
        objective.icon,

      category:
        objective.category,

      type:
        objective.type,

      target:
        objective.target,

      unit:
        objective.unit,

      frequency:
        objective.frequency,

      why:
        objective.why || '',
    })

    setShowForm(true)
  }

  async function saveObjective(
    event:
      React.FormEvent,
  ) {
    event.preventDefault()

    if (
      !form.title.trim()
    ) {
      return
    }

    if (
      editing?.id
    ) {
      await db.objectives.update(
        editing.id,

        {
          ...form,
        },
      )

      toast.success(
        'Objective updated',
      )
    } else {
      await db.objectives.add({
        ...form,

        active: true,

        activeDays: [
          0,
          1,
          2,
          3,
          4,
          5,
          6,
        ],

        order:
          objectives.length,

        createdAt:
          new Date()
            .toISOString(),
      })

      toast.success(
        'A new little win added',
      )
    }

    setShowForm(false)
  }

  /**
   * Important fix.
   *
   * React or a double click should
   * never create the starter
   * objectives twice.
   */
  async function finishOnboarding() {
    const chosen =
      defaultObjectives.filter(
        objective =>
          selectedStarter.includes(
            objective.title,
          ),
      )

    const starters =
      (
        chosen.length
          ? chosen
          : defaultObjectives
      ).map(
        ({
          id,
          ...objective
        }) => objective,
      )

    await db.transaction(
      'rw',

      db.objectives,

      db.settings,

      async () => {
        const objectiveCount =
          await db.objectives.count()

        if (
          objectiveCount === 0
        ) {
          await db.objectives.bulkAdd(
            starters,
          )
        }

        await db.settings.put({
          ...(await db.settings.get(
            1,
          )),

          id: 1,

          onboardingComplete:
            true,

          theme:
            (
              await db.settings.get(
                1,
              )
            )?.theme ||
            'light',

          accent:
            (
              await db.settings.get(
                1,
              )
            )?.accent ||
            'lavender',
        })
      },
    )

    setShowOnboarding(false)

    setPage('today')
  }

  async function toggleTheme() {
    const nextDark =
      !dark

    setDark(nextDark)

    document.documentElement
      .classList.toggle(
        'dark',
        nextDark,
      )

    await db.settings.update(
      1,

      {
        theme:
          nextDark
            ? 'dark'
            : 'light',
      },
    )
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#fbfaf8]
        text-foreground
        dark:bg-[#151617]
      "
    >
      <Toaster
        position="top-center"
        richColors
      />

      <DashboardNavigation
        page={page}
        setPage={setPage}
        dark={dark}
        avatar={avatar}
        toggleTheme={toggleTheme}
      />

      <main
        className="
          pb-24
          lg:pl-64
          lg:pb-8
        "
      >
        <div
          className="
            mx-auto
            max-w-7xl
            px-5
            py-8
            lg:px-12
            lg:py-12
          "
        >
          <AnimatePresence
            mode="wait"
          >
            <motion.div
              key={page}
              initial={{
                opacity:
                  0,

                y: 10,
              }}
              animate={{
                opacity:
                  1,

                y: 0,
              }}
            >
              {page ===
                'today' && (
                <DashboardToday
                  active={
                    active
                  }
                  percent={
                    percent
                  }
                  completed={
                    completed
                  }
                  getValue={
                    getValue
                  }
                  updateProgress={
                    updateProgress
                  }
                  onAdd={
                    openCreate
                  }
                  nickname={
                    profileName
                  }
                  streak={calculateStreak(
                    history,
                  )}
                />
              )}

              {page ===
                'coach' && (
                <CoachPage />
              )}

              {page ===
                'objectives' && (
                <DashboardObjectives
                  objectives={
                    objectives
                  }
                  onAdd={
                    openCreate
                  }
                  onEdit={
                    openEdit
                  }
                  onDelete={async (
                    id:
                      number,
                  ) => {
                    await db.objectives.delete(
                      id,
                    )

                    toast.success(
                      'Objective removed',
                    )
                  }}
                />
              )}

              {page ===
                'progress' && (
                <DashboardProgressView
                  history={
                    history
                  }
                  allProgress={
                    allProgress
                  }
                  objectives={
                    objectives
                  }
                />
              )}

              {page ===
                'motivation' && (
                <DashboardMotivation
                  nickname={
                    profileName
                  }
                  quotes={
                    savedQuotes
                  }
                />
              )}

              {page ===
                'profile' && (
                <DashboardProfile
                  settings={
                    settings
                  }
                  avatar={
                    avatar
                  }
                />
              )}

              {page ===
                'settings' && (
                <DashboardSettingsView
                  dark={
                    dark
                  }
                  setDark={
                    setDark
                  }
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <AnimatePresence>
        {showForm && (
          <DashboardObjectiveForm
            form={form}
            setForm={
              setForm
            }
            editing={
              editing
            }
            onClose={() =>
              setShowForm(
                false,
              )
            }
            onSave={
              saveObjective
            }
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOnboarding && (
          <DashboardOnboarding
            step={
              onboardingStep
            }
            setStep={
              setOnboardingStep
            }
            selected={
              selectedStarter
            }
            setSelected={
              setSelectedStarter
            }
            finish={
              finishOnboarding
            }
          />
        )}
      </AnimatePresence>
    </div>
  )
}

