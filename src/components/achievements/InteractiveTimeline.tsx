import { useState } from 'react'
import {
  Trophy,
  Cpu,
  Bot,
  GraduationCap,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  Filter,
  Terminal,
  RotateCcw,
} from 'lucide-react'

type Category =
  | 'ALL'
  | 'COMPETITIONS'
  | 'EMBEDDED & HARDWARE'
  | 'AI & ML'
  | 'EDUCATION'

interface Milestone {
  id: string
  year: string
  date: string
  category: 'COMPETITIONS' | 'EMBEDDED & HARDWARE' | 'AI & ML' | 'EDUCATION'
  status: string
  title: string
  subtitle: string
  summary: string
  journeyStep: string
  specs: { label: string; value: string }[]
  problem: string
  solution: string
  breakthrough: string
  link?: string
  linkLabel?: string
  featured?: boolean
  icon: 'trophy' | 'cpu' | 'bot' | 'school' | 'layers'
}

const MILESTONES: Milestone[] = [
  {
    id: 'embedded-systems-future',
    year: '2026+',
    date: 'Active & Future Research',
    category: 'EMBEDDED & HARDWARE',
    status: 'Active Focus',
    title: 'High-Performance Embedded Systems & Edge Computing',
    subtitle: 'Real-Time Operating Systems (RTOS) & Low-Latency Edge Intelligence',
    summary:
      'Advancing research into deterministic embedded computing, real-time operating systems (RTOS), and executing lightweight neural network models directly on constrained microcontrollers.',
    journeyStep: 'AI Systems → Real-Time Embedded Systems & Edge Computing',
    problem:
      'Constrained edge environments have strict power, memory, and timing requirements where cloud round-trip latency and network instability make remote inference non-viable.',
    solution:
      'Designing deterministic firmware architectures using FreeRTOS, memory-optimized data structures, and deploying INT8 quantized neural network inference via TensorFlow Lite for Microcontrollers.',
    specs: [
      { label: 'Domain', value: 'Embedded Systems & Edge Intelligence' },
      { label: 'Target Platforms', value: 'ARM Cortex-M, ESP32, RISC-V' },
      { label: 'Firmware Stack', value: 'FreeRTOS, Bare-Metal Embedded C++' },
      { label: 'Protocols', value: 'SPI, I2C, UART, CAN Bus' },
    ],
    breakthrough:
      'Coupling low-level bare-metal hardware control with quantized machine learning models to enable reliable split-second edge inference without cloud dependency.',
    icon: 'cpu',
    featured: false,
  },
  {
    id: 'exoplanet-stacking-2025',
    year: '2025',
    date: 'November 2025',
    category: 'AI & ML',
    status: 'Research Publication',
    title: 'Exoplanet Transit Classifier Pipeline via Stacking Ensembles',
    subtitle: 'Open-Source Machine Learning Pipeline on Hugging Face',
    summary:
      'Engineered an automated machine learning stacking ensemble pipeline that classifies Kepler space telescope light curves to distinguish genuine exoplanets from astrophysical false positives.',
    journeyStep: 'Lumina Smart IoT → Astronomical Machine Learning & Stacking',
    problem:
      'Individual ML estimators struggle on astronomical light curves due to severe class imbalance, stellar flare noise, and instrumental transit artifacts.',
    solution:
      'Synthesized a multi-tier stacking meta-classifier uniting Random Forests, Gradient Boosters, and Logistic Regression meta-learners to achieve elevated recall on faint transit signatures.',
    specs: [
      { label: 'Model Architecture', value: 'Scikit-Learn StackingClassifier' },
      { label: 'Dataset', value: 'Kepler Exoplanet Transit Photometry' },
      { label: 'Ecosystem', value: 'Python 3.10, Scikit-Learn, Pandas' },
      { label: 'Distribution', value: 'Hugging Face Hub Open Weights' },
    ],
    breakthrough:
      'Stacking heterogeneous model families mitigated individual inductive biases, significantly decreasing the false-alarm rate on faint planetary transit candidates.',
    link: 'https://huggingface.co/DarwinDanish/exoplanet-classifier-stacking',
    linkLabel: 'View Model on Hugging Face',
    icon: 'bot',
    featured: true,
  },
  {
    id: 'lumina-championship-2024',
    year: '2024',
    date: 'November 2024',
    category: 'COMPETITIONS',
    status: 'Championship',
    title: '1st Place Champion: Pertandingan Reka Cipta Mini Inno Waste 2.0',
    subtitle: 'Grand Prize (RM 1,000) for Project Lumina — Smart Interactive Eco-Bin',
    summary:
      'Won 1st Place (Juara Pertama) with teammates Nigel Sibat and Dexter Sangin under mentor Mdm Victoria. Engineered an AI-powered conversational waste station from repurposed vehicle tires with voice interaction and automated WhatsApp alerts.',
    journeyStep:
      'Robotics Prototypes → State Innovation Champion (Project Lumina)',
    problem:
      'Standard recycling bins suffer from low engagement, lack of fill-level visibility, and discarded vehicle tires represent a severe environmental recycling challenge.',
    solution:
      'Built an interactive bin using repurposed tires, Raspberry Pi 4 compute core, Picovoice offline wake-word detection, OpenAI Whisper speech transcription, conversational logic, and automated WhatsApp alert dispatch.',
    specs: [
      { label: 'Award', value: '1st Place Champion (Juara Pertama)' },
      { label: 'Prize', value: 'RM 1,000 Cash Prize' },
      { label: 'Chassis', value: 'Repurposed Vehicle Tires & 3D Printed PETG' },
      { label: 'Compute Core', value: 'Raspberry Pi 4 Model B, I2S DAC, USB Mic' },
      { label: 'Networking', value: 'Dual Stack (Local WebSockets + WhatsApp API)' },
      { label: 'Team', value: 'Darwin Danish, Nigel Sibat, Dexter Sangin' },
    ],
    breakthrough:
      'Proved that combining sustainable physical repurposing with intuitive voice AI makes community waste sorting engaging, accessible, and operationally transparent.',
    link: '/blog/posts/lumina-journey/',
    linkLabel: 'Read Full Lumina Technical Case Study',
    icon: 'trophy',
    featured: true,
  },
  {
    id: 'robotics-systems-2023',
    year: '2023',
    date: 'Mid 2023',
    category: 'EMBEDDED & HARDWARE',
    status: 'Systems Engineering',
    title: 'Autonomous Robotics & Sensor Integration',
    subtitle: 'Motor H-Bridges, Closed-Loop Guidance & Wireless Dashboards',
    summary:
      'Progressed from basic microcontrollers to integrated robotics systems. Built autonomous sensor rovers and programmed real-time mobile monitoring dashboards using local WebSocket bridges.',
    journeyStep: 'SMK Kapit Electronics Club → Autonomous Mobile Prototyping',
    problem:
      'Wireless data transfer between microcontrollers and host devices in low-connectivity rural environments was unstable and prone to connection drops.',
    solution:
      'Architected a direct local Wi-Fi communication bridge over WebSockets and JSON payloads, achieving reliable bi-directional data transmission without requiring external cloud access.',
    specs: [
      { label: 'Platforms', value: 'ESP32 & Raspberry Pi Zero' },
      { label: 'Protocol', value: 'Local WebSockets & JSON Payloads' },
      { label: 'App Engine', value: 'Kodular Mobile Companion App' },
      { label: 'Sensory Array', value: 'HC-SR04 Ultrasonic, DHT22, IR Reflective' },
    ],
    breakthrough:
      'Decoupled the local real-time control loop from external internet dependencies, ensuring total reliability during live field demonstrations.',
    icon: 'cpu',
    featured: false,
  },
  {
    id: 'arduino-prototyping-2022',
    year: '2022',
    date: 'Late 2022',
    category: 'EMBEDDED & HARDWARE',
    status: 'Hardware Prototyping',
    title: 'Embedded Microcontrollers & Physical Circuit Design',
    subtitle: 'Circuit Prototyping, GPIO Logic & Sensor Interfacing in Kapit',
    summary:
      'Sourced components, constructed custom breadboard prototypes, and programmed embedded C++ on Arduino boards to build automated environmental monitors and digital displays.',
    journeyStep: 'SMK Kapit Classroom → Physical Breadboarding & C++',
    problem:
      'Living in Kapit, Sarawak meant long turnaround times for replacement components, requiring rigorous schematic planning before soldering.',
    solution:
      'Simulated circuits thoroughly prior to physical assembly, salvaged components from unused electronics, and developed meticulous soldering and testing habits.',
    specs: [
      { label: 'Microcontroller', value: 'ATmega328P / Arduino Uno' },
      { label: 'Programming', value: 'Embedded C++, Arduino Toolchain' },
      { label: 'Components', value: 'Relays, 16x2 Character LCDs, Shift Registers' },
      { label: 'Key Focus', value: 'Power regulation, pull-up resistors & safety' },
    ],
    breakthrough:
      'Connected software logic directly to physical hardware behaviors, establishing the foundation for a career in computer engineering.',
    icon: 'cpu',
    featured: false,
  },
  {
    id: 'smk-kapit-roots-2021',
    year: '2021',
    date: 'Early 2021',
    category: 'EDUCATION',
    status: 'Academic Foundations',
    title: 'Foundations at SMK Kapit (Kapit National Secondary School)',
    subtitle: 'Academic Foundations, Discrete Logic & Algorithm Development',
    summary:
      'Commenced secondary school at SMK Kapit in Sarawak, focusing deeply on mathematics, physics, and computer science. Self-taught computer algorithms and fundamental programming.',
    journeyStep: 'Origin: Kapit National Secondary School (SMK Kapit)',
    problem:
      'Standard curriculum had limited practical computer engineering and robotics exposure in rural Sarawak.',
    solution:
      'Studied computer architectures, absorbed open educational materials, and wrote custom scripts to automate tasks and build logic simulations.',
    specs: [
      { label: 'Institution', value: 'SMK Kapit (Kapit National Secondary School)' },
      { label: 'Location', value: 'Kapit, Sarawak, Malaysia' },
      { label: 'Primary Language', value: 'Python 3' },
      { label: 'Core Topics', value: 'Boolean Algebra, Algorithms, Linux Basics' },
    ],
    breakthrough:
      'Proved that curiosity and disciplined self-study can bridge any geographic distance between remote Sarawak and global technology innovation.',
    icon: 'school',
    featured: false,
  },
]

export default function InteractiveTimeline() {
  const [activeFilter, setActiveFilter] = useState<Category>('ALL')
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'lumina-championship-2024': true,
    'exoplanet-stacking-2025': true,
  })

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {}
    MILESTONES.forEach((m) => {
      allExpanded[m.id] = true
    })
    setExpandedIds(allExpanded)
  }

  const collapseAll = () => {
    setExpandedIds({})
  }

  const filteredMilestones =
    activeFilter === 'ALL'
      ? MILESTONES
      : MILESTONES.filter((m) => m.category === activeFilter)

  const renderIcon = (icon: Milestone['icon']) => {
    switch (icon) {
      case 'trophy':
        return <Trophy className="size-3.5 text-foreground/80 sm:size-4" />
      case 'bot':
        return <Bot className="size-3.5 text-foreground/80 sm:size-4" />
      case 'cpu':
        return <Cpu className="size-3.5 text-foreground/80 sm:size-4" />
      case 'school':
        return <GraduationCap className="size-3.5 text-foreground/80 sm:size-4" />
      default:
        return <Layers className="size-3.5 text-foreground/80 sm:size-4" />
    }
  }

  const filterOptions: { key: Category; label: string }[] = [
    { key: 'ALL', label: 'All Milestones' },
    { key: 'COMPETITIONS', label: 'Competitions' },
    { key: 'AI & ML', label: 'AI & Machine Learning' },
    { key: 'EMBEDDED & HARDWARE', label: 'Embedded Systems & Hardware' },
    { key: 'EDUCATION', label: 'Academic Foundations' },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Interactive Controls Bar */}
      <div className="border-border bg-muted/20 flex flex-col gap-3 rounded-lg border p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
            <Filter className="text-foreground size-3.5" />
            <span className="text-foreground font-semibold">Filter Timeline:</span>
            <span>
              Showing {filteredMilestones.length} of {MILESTONES.length} milestones
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={expandAll}
              aria-label="Expand all specifications"
              className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground rounded border px-2.5 py-1 transition active:scale-95 cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              aria-label="Collapse all specifications"
              className="border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground rounded border px-2.5 py-1 transition active:scale-95 cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div
          className="flex flex-wrap gap-1.5 pt-1"
          role="group"
          aria-label="Timeline Category Filters"
        >
          {filterOptions.map((opt) => {
            const count =
              opt.key === 'ALL'
                ? MILESTONES.length
                : MILESTONES.filter((m) => m.category === opt.key).length
            const isSelected = activeFilter === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveFilter(opt.key)}
                className={`flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs transition-all duration-150 ${
                  isSelected
                    ? 'border-foreground/60 bg-foreground/10 text-foreground border font-semibold'
                    : 'border-border bg-background text-muted-foreground hover:border-border hover:text-foreground border'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`rounded px-1.5 py-0.2 text-[10px] ${
                    isSelected
                      ? 'bg-foreground/20 text-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Vertical Spine Timeline */}
      <div className="relative pl-8 sm:pl-10">
        {/* Continuous Spine Line */}
        <div className="bg-border absolute top-3 bottom-3 left-3 w-[1px] sm:left-4" />

        {/* Empty State Fallback */}
        {filteredMilestones.length === 0 ? (
          <div className="border-border bg-muted/15 flex flex-col items-center justify-center gap-3 rounded-lg border p-8 text-center">
            <span className="text-muted-foreground font-mono text-xs">
              No milestones found in this category.
            </span>
            <p className="text-foreground text-sm font-semibold">
              No milestone entries match the selected filter.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className="border-border bg-muted text-foreground hover:bg-muted/80 inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Filter to All</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredMilestones.map((milestone) => {
              const isExpanded = !!expandedIds[milestone.id]
              const isFeatured = milestone.featured
              const drawerId = `spec-${milestone.id}`

              return (
                <div key={milestone.id} className="group relative">
                  {/* Spine Node Marker */}
                  <div
                    className={`bg-background absolute top-4 left-[-32px] z-10 flex size-6 items-center justify-center rounded-full border transition-colors sm:left-[-38px] sm:size-7 ${
                      isFeatured
                        ? 'border-foreground/60'
                        : 'border-border group-hover:border-foreground/40'
                    }`}
                  >
                    {renderIcon(milestone.icon)}
                  </div>

                  {/* Horizontal Trace Line */}
                  <div className="border-border/60 absolute top-[27px] left-[-8px] h-[1px] w-2 border-t sm:left-[-10px] sm:w-2.5" />

                  {/* Milestone Card */}
                  <div
                    className={`rounded-lg border transition-all duration-200 ${
                      isFeatured
                        ? 'border-border/80 bg-muted/20 hover:border-foreground/40'
                        : 'border-border bg-muted/10 hover:border-border hover:bg-muted/20'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-4 sm:p-5">
                      {/* Meta Bar */}
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-foreground font-mono text-xs font-semibold">
                            {milestone.date}
                          </span>
                          <span className="border-border bg-muted/40 text-muted-foreground rounded border px-2 py-0.5 font-mono text-[10px] uppercase">
                            {milestone.category}
                          </span>
                          <span className="border-border bg-background text-muted-foreground rounded border px-2 py-0.5 font-mono text-[10px]">
                            {milestone.status}
                          </span>
                        </div>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-foreground mb-1 text-base font-semibold tracking-tight sm:text-lg">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground mb-2 font-mono text-xs sm:text-sm">
                        {milestone.subtitle}
                      </p>

                      {/* Progression Step */}
                      <div className="text-muted-foreground border-border/60 bg-background/50 mb-3 flex w-fit items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px]">
                        <Terminal className="text-muted-foreground size-3 shrink-0" />
                        <span>{milestone.journeyStep}</span>
                      </div>

                      {/* Summary */}
                      <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                        {milestone.summary}
                      </p>

                      {/* Bottom Action */}
                      <div className="border-border/50 mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-controls={drawerId}
                          onClick={() => toggleExpand(milestone.id)}
                          className="text-foreground/80 hover:text-foreground flex cursor-pointer items-center gap-1.5 font-mono text-xs transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="size-3.5" />
                              <span>Hide Technical Specifications</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-3.5" />
                              <span>View Technical Specifications</span>
                            </>
                          )}
                        </button>

                        {milestone.link && (
                          <a
                            href={milestone.link}
                            target={
                              milestone.link.startsWith('http') ? '_blank' : '_self'
                            }
                            rel={
                              milestone.link.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className="text-foreground/80 hover:text-foreground flex items-center gap-1 font-mono text-xs hover:underline"
                          >
                            <span>{milestone.linkLabel || 'View Details'}</span>
                            {milestone.link.startsWith('http') ? (
                              <ExternalLink className="size-3" />
                            ) : (
                              <ArrowRight className="size-3" />
                            )}
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Expandable Specifications Drawer */}
                    {isExpanded && (
                      <div
                        id={drawerId}
                        className="border-border/60 bg-background/60 space-y-4 border-t p-4 sm:p-5"
                      >
                        {/* Constraints & Architecture Grid */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="border-border/70 bg-muted/20 space-y-1 rounded border p-3">
                            <div className="text-foreground flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase">
                              <span className="bg-muted-foreground size-1.5 rounded-full" />
                              Challenge & Constraints
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {milestone.problem}
                            </p>
                          </div>
                          <div className="border-border/70 bg-muted/20 space-y-1 rounded border p-3">
                            <div className="text-foreground flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase">
                              <span className="bg-foreground size-1.5 rounded-full" />
                              Architectural Solution
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {milestone.solution}
                            </p>
                          </div>
                        </div>

                        {/* System Specifications */}
                        <div className="border-border/60 bg-muted/10 rounded border p-3">
                          <div className="text-foreground mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-wider uppercase">
                            <Cpu className="text-foreground size-3" />
                            <span>System Specifications</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 font-mono text-xs sm:grid-cols-2">
                            {milestone.specs.map((spec, sIdx) => (
                              <div
                                key={sIdx}
                                className="border-border/30 flex items-start justify-between gap-2 border-b pb-1"
                              >
                                <span className="text-muted-foreground shrink-0">
                                  {spec.label}:
                                </span>
                                <span className="text-foreground text-right">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Key Technical Milestone */}
                        <div className="border-border/80 bg-muted/20 rounded border-l-2 border-l-foreground p-3 text-xs">
                          <div className="text-foreground mb-1 flex items-center gap-1.5 font-mono font-semibold">
                            <CheckCircle2 className="size-3.5" />
                            <span>Key Technical Milestone</span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {milestone.breakthrough}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
