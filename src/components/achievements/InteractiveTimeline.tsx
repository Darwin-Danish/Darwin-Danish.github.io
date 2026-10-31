import { useState } from 'react'
import {
  GraduationCap,
  Award,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Trophy,
} from 'lucide-react'

interface AcademicDetail {
  label: string
  value: string
}

interface Milestone {
  id: string
  date: string
  badge: string
  title: string
  subtitle: string
  summary: string
  details: AcademicDetail[]
  icon: 'school' | 'award'
}

const MILESTONES: Milestone[] = [
  {
    id: 'biicc-2026',
    date: '2026',
    badge: 'BIICC 2026',
    title:
      'Borneo International Innovation Creativity Competition (BIICC) 2026',
    subtitle: 'Gold Award Winner • International Innovation & Engineering',
    summary:
      'Awarded the prestigious Gold Award at the Borneo International Innovation Creativity Competition (BIICC) 2026, recognizing technical ingenuity, creative design thinking, and high-impact innovation in engineering and computing.',
    details: [
      {
        label: 'Competition',
        value:
          'Borneo International Innovation Creativity Competition (BIICC) 2026',
      },
      {
        label: 'Award Level',
        value: 'Gold Award',
      },
      {
        label: 'Scope',
        value: 'International Innovation & Creativity',
      },
      {
        label: 'Focus Domains',
        value:
          'IoT Systems, Embedded Computing, Machine Learning, Systems Architecture',
      },
      {
        label: 'Location',
        value: 'Sarawak, Borneo, Malaysia',
      },
    ],
    icon: 'award',
  },
  {
    id: 'smk-kapit-foundations',
    date: 'Academic Foundations',
    badge: 'SMK KAPIT',
    title: 'Foundations at SMK Kapit (Kapit National Secondary School)',
    subtitle: 'Science Stream • Pure Sciences & Advanced Mathematics',
    summary:
      'Currently undertaking secondary education at SMK Kapit (Kapit National Secondary School) in Sarawak, pursuing the Science Stream with dedicated coursework in Physics, Chemistry, Biology, and Additional Mathematics. Alongside core scientific academics, actively building self-directed engineering initiatives in computer science, robotics, and machine learning.',
    details: [
      {
        label: 'Institution',
        value: 'SMK Kapit (Kapit National Secondary School)',
      },
      {
        label: 'Location',
        value: 'Kapit, Sarawak, Malaysia',
      },
      {
        label: 'Academic Stream',
        value: 'Science Stream',
      },
      {
        label: 'Core Subjects',
        value: 'Physics, Chemistry, Biology, Additional Mathematics',
      },
      {
        label: 'Applied Interests',
        value:
          'Computer Engineering, IoT Prototyping, Machine Learning, Applied Algorithms',
      },
    ],
    icon: 'school',
  },
]

export default function InteractiveTimeline() {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'biicc-2026': true,
    'smk-kapit-foundations': false,
  })

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="w-full">
      <div className="relative space-y-8 pl-6 sm:pl-8">
        {/* Continuous Spine Line */}
        <div
          className="bg-border absolute top-3 bottom-3 left-2.5 w-px sm:left-3"
          aria-hidden="true"
        />

        {MILESTONES.map((milestone) => {
          const isExpanded = !!expandedIds[milestone.id]

          return (
            <div key={milestone.id} className="relative">
              {/* Node Marker centered on spine */}
              <div
                className="border-foreground bg-background text-foreground absolute top-4 left-[-18px] z-10 flex size-5 items-center justify-center rounded-full border-2 shadow-sm sm:left-[-22px] sm:size-6"
                aria-hidden="true"
              >
                {milestone.icon === 'award' ? (
                  <Award className="text-foreground size-3 sm:size-3.5" />
                ) : (
                  <GraduationCap className="text-foreground size-3 sm:size-3.5" />
                )}
              </div>

              {/* Node Card */}
              <div className="border-border bg-muted/15 hover:border-foreground/30 rounded-lg border transition-all duration-200">
                <div className="p-4 sm:p-5">
                  {/* Header Info */}
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="border-border bg-muted/40 text-foreground inline-flex items-center gap-1.5 rounded border px-2 py-0.5 font-mono text-[11px] font-semibold">
                      {milestone.icon === 'award' ? (
                        <Trophy className="text-foreground size-3" />
                      ) : (
                        <BookOpen className="text-foreground size-3" />
                      )}
                      <span>{milestone.badge}</span>
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {milestone.date}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-foreground text-base font-bold tracking-tight sm:text-lg">
                    {milestone.title}
                  </h3>
                  <p className="text-muted-foreground mb-3 font-mono text-xs sm:text-sm">
                    {milestone.subtitle}
                  </p>

                  {/* Narrative Summary */}
                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                    {milestone.summary}
                  </p>

                  {/* Bottom Action */}
                  <div className="border-border/50 mt-4 flex items-center justify-between border-t pt-3">
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      onClick={() => toggleExpand(milestone.id)}
                      className="text-foreground hover:text-muted-foreground flex cursor-pointer items-center gap-1.5 font-mono text-xs transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="size-3.5" />
                          <span>Hide Details</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-3.5" />
                          <span>View Details</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Expandable Academic Details Drawer */}
                {isExpanded && (
                  <div className="border-border/60 bg-background/60 border-t p-4 sm:p-5">
                    <div className="grid grid-cols-1 gap-2.5 font-mono text-xs sm:grid-cols-2">
                      {milestone.details.map((detail, idx) => (
                        <div
                          key={idx}
                          className="border-border/30 flex flex-col justify-between border-b pb-2"
                        >
                          <span className="text-muted-foreground text-[11px]">
                            {detail.label}
                          </span>
                          <span className="text-foreground mt-0.5 font-medium">
                            {detail.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
