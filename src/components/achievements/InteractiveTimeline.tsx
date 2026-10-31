import { useState } from 'react'
import {
  Trophy,
  Cpu,
  Bot,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Layers,
  ArrowRight,
  CheckCircle2,
  Filter,
  Terminal,
  RotateCcw,
} from 'lucide-react'

type Category =
  | 'ALL'
  | 'COMPETITIONS'
  | 'HARDWARE & IOT'
  | 'AI & ML'
  | 'EDUCATION'

interface Milestone {
  id: string
  nodeNumber: string
  year: string
  date: string
  category: 'COMPETITIONS' | 'HARDWARE & IOT' | 'AI & ML' | 'EDUCATION'
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
  icon: 'trophy' | 'cpu' | 'bot' | 'school' | 'sparkles'
}

const MILESTONES: Milestone[] = [
  {
    id: 'motorsport-future',
    nodeNumber: '06',
    year: '2026+',
    date: 'Present & Beyond',
    category: 'HARDWARE & IOT',
    status: 'ACTIVE_HORIZON',
    title: 'Motorsport Tech & High-Rate Telemetry Systems',
    subtitle: 'Autonomous Systems & Edge AI for High-Performance Mobility',
    summary:
      'Pursuing high-frequency sensor fusion, CAN bus telemetry analysis, and low-latency edge computing with aspirations toward Formula 1 technology and automotive innovation.',
    journeyStep: 'AI Research → Real-Time Telemetry & Motorsport Engineering',
    problem:
      'High-speed automotive systems produce millions of sensor telemetry signals per second where network latency makes cloud compute infeasible.',
    solution:
      'Investigating deterministic microcontrollers, real-time operating systems (RTOS), and lightweight neural network inference on constrained embedded hardware.',
    specs: [
      { label: 'Domain', value: 'Automotive Telemetry & Sensor Fusion' },
      { label: 'Protocols', value: 'CAN Bus, SPI, I2C, MQTT' },
      { label: 'Target', value: 'Motorsport Tech & Innovation' },
      { label: 'Inspiration', value: 'Scuderia Ferrari / Carlos Sainz #55' },
    ],
    breakthrough:
      'Bridging low-level embedded hardware design with high-level machine learning models to enable split-second decision-making at the edge.',
    icon: 'sparkles',
    featured: false,
  },
  {
    id: 'exoplanet-stacking-2025',
    nodeNumber: '05',
    year: '2025',
    date: 'November 2025',
    category: 'AI & ML',
    status: 'AI_RESEARCH',
    title: 'Exoplanet Classifier Pipeline via Stacking Ensembles',
    subtitle: 'Published Open-Source Model on Hugging Face Hub',
    summary:
      'Engineered an automated machine learning stacking ensemble pipeline that classifies Kepler space telescope light curves to distinguish genuine exoplanets from astrophysical false positives.',
    journeyStep: 'Lumina Smart IoT → Astronomical Machine Learning & Stacking',
    problem:
      'Single ML estimators frequently stumble on planetary transit light curves due to extreme class imbalance and stellar flare noise.',
    solution:
      'Synthesized a multi-tier stacking meta-classifier uniting Random Forests, Gradient Boosters, and Logistic Regression meta-learners to achieve high recall on faint transit dips.',
    specs: [
      { label: 'Model Architecture', value: 'Scikit-Learn StackingClassifier' },
      { label: 'Dataset', value: 'Kepler Exoplanet Transit Light Curves' },
      { label: 'Ecosystem', value: 'Python, Pandas, Scikit-Learn' },
      { label: 'Hosting', value: 'Hugging Face Hub Open Weights' },
    ],
    breakthrough:
      'Stacking heterogeneous model families mitigated individual inductive biases, substantially decreasing the false-alarm rate on complex planetary candidates.',
    link: 'https://huggingface.co/DarwinDanish/exoplanet-classifier-stacking',
    linkLabel: 'View Model on Hugging Face',
    icon: 'bot',
    featured: true,
  },
  {
    id: 'lumina-championship-2024',
    nodeNumber: '04',
    year: '2024',
    date: 'November 2024',
    category: 'COMPETITIONS',
    status: 'CHAMPION_JUARA',
    title: '1st Place Champion: Pertandingan Reka Cipta Mini Inno Waste 2.0',
    subtitle: 'Grand Prize (RM 1,000) for Project Lumina — Smart Bunny Eco-Bin',
    summary:
      'Won 1st Place (Juara Pertama) with teammates Nigel Sibat and Dexter Sangin under mentor Mdm Victoria. Transformed discarded rubber tires into an AI-powered conversational bin with real-time app telemetry and WhatsApp emergency alerts.',
    journeyStep:
      'Robotics Prototypes → State Innovation Champion (Project Lumina)',
    problem:
      'Standard public waste bins suffer from lack of user engagement, overflow without warning, and discarded tires create severe environmental disposal issues.',
    solution:
      'Engineered an interactive bunny-themed recycling bin using stacked repurposed tires, Raspberry Pi brain, Picovoice offline wake-words, OpenAI Whisper speech transcription, GPT conversational logic, and WhatsApp automated alerts.',
    specs: [
      { label: 'Award', value: '1st Place Champion (Juara Pertama)' },
      { label: 'Prize', value: 'RM 1,000 Cash Prize' },
      {
        label: 'Chassis',
        value: 'Repurposed vehicle tires + 3D printed PETG ears',
      },
      { label: 'Compute & Audio', value: 'Raspberry Pi 4, I2S DAC, Mic array' },
      {
        label: 'Networking',
        value: 'Dual stack (Local WebSockets + Cloud REST)',
      },
      { label: 'Team', value: 'Darwin Danish, Nigel Sibat, Dexter Sangin' },
      { label: 'Mentor', value: 'Mdm Victoria' },
    ],
    breakthrough:
      'Demonstrated that sustainable hardware recycling combined with intuitive voice conversational AI makes community waste segregation both engaging and operationally efficient.',
    link: '/blog/posts/lumina-journey/',
    linkLabel: 'Read Full Lumina Journey & Story',
    icon: 'trophy',
    featured: true,
  },
  {
    id: 'robotics-telemetry-2023',
    nodeNumber: '03',
    year: '2023',
    date: 'Mid 2023',
    category: 'HARDWARE & IOT',
    status: 'SYSTEMS_DEV',
    title: 'Autonomous Robotics & Mobile Companion Interfaces',
    subtitle: 'Sensor Integration, Dual Motor H-Bridges & App Prototyping',
    summary:
      'Stepped up from simple microcontrollers to full-stack IoT devices. Built autonomous sensor rovers and programmed real-time mobile telemetry dashboards using Kodular and WebSocket bridges.',
    journeyStep: 'SMK Kapit Electronics Club → Autonomous Mobile Prototyping',
    problem:
      'Wireless telemetry between microcontrollers and smartphones in low-connectivity areas was erratic and difficult to debug.',
    solution:
      'Created custom communication protocols running over local Wi-Fi hotspots, establishing bi-directional real-time telemetry without requiring external cloud servers.',
    specs: [
      { label: 'Platform', value: 'ESP32 & Raspberry Pi Zero' },
      { label: 'Telemetry', value: 'Local WebSockets & JSON payloads' },
      { label: 'App Engine', value: 'Kodular Visual Mobile Framework' },
      { label: 'Sensors', value: 'HC-SR04, DHT22, IR Reflex arrays' },
    ],
    breakthrough:
      'Decoupling the local control loop from external internet access ensured total system reliability during live field demonstrations.',
    icon: 'cpu',
    featured: false,
  },
  {
    id: 'arduino-prototyping-2022',
    nodeNumber: '02',
    year: '2022',
    date: 'Late 2022',
    category: 'HARDWARE & IOT',
    status: 'PROTOTYPING',
    title: 'First Embedded Microcontrollers & Physical Circuits',
    subtitle: 'Circuit Soldering, GPIO Logic & Sensor Interfacing in Kapit',
    summary:
      'Sourced components, constructed custom breadboard prototypes, and programmed embedded C++ on Arduino boards to build automated environmental sensors and digital displays.',
    journeyStep: 'SMK Kapit Classroom → Physical Breadboarding & C++',
    problem:
      'Living in Kapit, Sarawak meant long shipping turnaround for electronics parts, demanding careful schematic planning with zero tolerance for short-circuited components.',
    solution:
      'Mastered circuit simulation in TinkerCAD before physical assembly, salvaged components from old consumer appliances, and developed robust soldering habits.',
    specs: [
      { label: 'Microcontroller', value: 'ATmega328P / Arduino Uno' },
      { label: 'Languages', value: 'C++, Arduino Wiring' },
      { label: 'Components', value: 'Relays, 16x2 LCDs, Shift Registers' },
      { label: 'Focus', value: 'Power regulation & electrical safety' },
    ],
    breakthrough:
      'Realized how code transcends software to manipulate physical hardware, igniting a lifelong dedication to computer engineering.',
    icon: 'cpu',
    featured: false,
  },
  {
    id: 'smk-kapit-roots-2021',
    nodeNumber: '01',
    year: '2021',
    date: 'Early 2021',
    category: 'EDUCATION',
    status: 'FOUNDATION_ROOTS',
    title: 'Genesis at SMK Kapit (Kapit National Secondary School)',
    subtitle: 'Academic Foundations, Logic Design & First Lines of Python',
    summary:
      'Began high school journey at SMK Kapit in Sarawak, diving passionately into mathematics, physics, and computer science. Self-taught computer algorithms and fundamental programming.',
    journeyStep: 'Origin: Kapit National Secondary School (SMK Kapit)',
    problem:
      'Traditional school curriculum had limited practical computer engineering and robotics exposure.',
    solution:
      'Proactively researched computer architectures, absorbed open educational materials, and started writing custom scripts to automate daily tasks and simple logic games.',
    specs: [
      {
        label: 'Institution',
        value: 'Kapit National Secondary School (SMK Kapit)',
      },
      { label: 'Location', value: 'Kapit, Sarawak, Malaysia' },
      { label: 'First Language', value: 'Python 3' },
      {
        label: 'Core Topics',
        value: 'Boolean Logic, Algorithms, Linux Basics',
      },
    ],
    breakthrough:
      'Discovered that curiosity and disciplined online self-study could conquer any geographical divide between remote Sarawak and global tech innovation.',
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
        return <Trophy className="size-3.5 text-amber-400 sm:size-4" />
      case 'bot':
        return <Bot className="size-3.5 text-sky-400 sm:size-4" />
      case 'cpu':
        return <Cpu className="size-3.5 text-emerald-400 sm:size-4" />
      case 'school':
        return <GraduationCap className="size-3.5 text-orange-400 sm:size-4" />
      case 'sparkles':
        return <Sparkles className="size-3.5 text-purple-400 sm:size-4" />
      default:
        return <Layers className="text-primary size-3.5 sm:size-4" />
    }
  }

  const getCategoryBadgeClass = (category: Milestone['category']) => {
    switch (category) {
      case 'COMPETITIONS':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      case 'AI & ML':
        return 'bg-sky-500/10 text-sky-400 border-sky-500/30'
      case 'HARDWARE & IOT':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'EDUCATION':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/30'
      default:
        return 'bg-muted text-muted-foreground border-border'
    }
  }

  const filterOptions: { key: Category; label: string }[] = [
    { key: 'ALL', label: 'All Milestones' },
    { key: 'COMPETITIONS', label: 'Competitions' },
    { key: 'AI & ML', label: 'AI & Machine Learning' },
    { key: 'HARDWARE & IOT', label: 'Robotics & IoT' },
    { key: 'EDUCATION', label: 'Education & Roots' },
  ]

  return (
    <div className="w-full space-y-6">
      {/* Interactive Controls Bar */}
      <div className="border-border bg-muted/20 flex flex-col gap-3 rounded-lg border p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
            <Filter className="text-primary size-3.5" />
            <span className="text-foreground font-semibold">
              FILTER TIMELINE:
            </span>
            <span>
              Showing {filteredMilestones.length} of {MILESTONES.length}{' '}
              milestones
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={expandAll}
              aria-label="Expand all technical blueprints"
              className="border-border text-muted-foreground hover:border-primary hover:text-foreground rounded border px-2.5 py-1 transition active:scale-95"
            >
              [+ Expand All]
            </button>
            <button
              type="button"
              onClick={collapseAll}
              aria-label="Collapse all technical blueprints"
              className="border-border text-muted-foreground hover:border-primary hover:text-foreground rounded border px-2.5 py-1 transition active:scale-95"
            >
              [- Collapse All]
            </button>
          </div>
        </div>

        {/* Filter Pills */}
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
                    ? 'border-primary bg-primary/10 text-primary border font-semibold shadow-sm'
                    : 'border-border/70 bg-background/50 text-muted-foreground hover:border-border hover:text-foreground border'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    isSelected
                      ? 'bg-primary/20 text-primary'
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
        {/* Continuous Circuit Spine Line */}
        <div className="from-primary/70 via-border/80 to-primary/30 absolute top-3 bottom-3 left-3 w-[2px] bg-gradient-to-b sm:left-4" />

        {/* Empty State Fallback */}
        {filteredMilestones.length === 0 ? (
          <div className="border-border bg-muted/15 flex flex-col items-center justify-center gap-3 rounded-lg border p-8 text-center">
            <span className="text-muted-foreground font-mono text-xs">
              [NO_MILESTONES_FOUND_IN_SELECTED_DOMAIN]
            </span>
            <p className="text-foreground text-sm font-semibold">
              No milestone entries match this domain filter.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className="border-primary bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors"
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
              const drawerId = `blueprint-${milestone.id}`

              return (
                <div key={milestone.id} className="group relative">
                  {/* Circuit Node Marker directly on the spine */}
                  <div
                    className={`bg-background absolute top-4 left-[-26px] z-10 flex size-6 items-center justify-center rounded-full border transition-transform duration-200 group-hover:scale-110 sm:left-[-32px] sm:size-7 ${
                      isFeatured
                        ? 'border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.35)] ring-2 ring-amber-400/20'
                        : 'border-border group-hover:border-primary'
                    }`}
                  >
                    {renderIcon(milestone.icon)}
                  </div>

                  {/* Horizontal Circuit Branch Trace connecting node to card */}
                  <div className="border-border/60 group-hover:border-primary/50 absolute top-[27px] left-[-2px] h-[1px] w-2 border-t border-dashed transition-colors sm:left-[-4px] sm:w-4" />

                  {/* Milestone Content Card */}
                  <div
                    className={`rounded-lg border transition-all duration-200 ${
                      isFeatured
                        ? 'border-amber-500/30 bg-amber-500/[0.03] hover:border-amber-500/50'
                        : 'border-border bg-muted/15 hover:border-primary/40 hover:bg-muted/25'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="p-4 sm:p-5">
                      {/* Meta Bar */}
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-primary font-mono text-xs font-bold">
                            {milestone.date}
                          </span>
                          <span
                            className={`rounded border px-2 py-0.5 font-mono text-[10px] tracking-wider uppercase ${getCategoryBadgeClass(
                              milestone.category,
                            )}`}
                          >
                            {milestone.category}
                          </span>
                          <span className="border-border/80 bg-background/80 text-muted-foreground rounded border px-2 py-0.5 font-mono text-[10px]">
                            [{milestone.status}]
                          </span>
                        </div>
                        {/* Persistent Node Sequence Identifier (Fixed across filters) */}
                        <span className="text-muted-foreground/70 font-mono text-[11px]">
                          NODE #{milestone.nodeNumber}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="text-foreground mb-1 text-base font-semibold tracking-tight sm:text-lg">
                        {milestone.title}
                      </h3>
                      <p className="text-primary/80 mb-2 font-mono text-xs sm:text-sm">
                        {milestone.subtitle}
                      </p>

                      {/* Journey Breadcrumb */}
                      <div className="text-muted-foreground/80 bg-background/40 border-border/40 mb-3 flex w-fit items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px]">
                        <Terminal className="text-primary size-3 shrink-0" />
                        <span>{milestone.journeyStep}</span>
                      </div>

                      {/* Summary */}
                      <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                        {milestone.summary}
                      </p>

                      {/* Bottom Action / Expansion Trigger */}
                      <div className="border-border/50 mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                        <button
                          type="button"
                          aria-expanded={isExpanded}
                          aria-controls={drawerId}
                          onClick={() => toggleExpand(milestone.id)}
                          className="text-primary hover:text-foreground flex cursor-pointer items-center gap-1.5 font-mono text-xs transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="size-3.5" />
                              <span>[- Hide Technical Blueprint]</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="size-3.5" />
                              <span>
                                [+ Inspect Technical Blueprint & Specs]
                              </span>
                            </>
                          )}
                        </button>

                        {milestone.link && (
                          <a
                            href={milestone.link}
                            target={
                              milestone.link.startsWith('http')
                                ? '_blank'
                                : '_self'
                            }
                            rel={
                              milestone.link.startsWith('http')
                                ? 'noopener noreferrer'
                                : undefined
                            }
                            className="text-primary flex items-center gap-1 font-mono text-xs hover:underline"
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

                    {/* Expandable Technical Blueprint Drawer */}
                    {isExpanded && (
                      <div
                        id={drawerId}
                        className="border-border/60 bg-background/60 space-y-4 border-t p-4 sm:p-5"
                      >
                        {/* Problem & Solution Grid */}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div className="border-border/70 bg-muted/20 space-y-1 rounded border p-3">
                            <div className="text-destructive flex items-center gap-1 font-mono text-[11px] tracking-wider uppercase">
                              <span className="bg-destructive size-1.5 rounded-full" />
                              The Constraint / Challenge
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {milestone.problem}
                            </p>
                          </div>
                          <div className="border-border/70 bg-muted/20 space-y-1 rounded border p-3">
                            <div className="flex items-center gap-1 font-mono text-[11px] tracking-wider text-emerald-400 uppercase">
                              <span className="size-1.5 rounded-full bg-emerald-400" />
                              Engineered Architecture
                            </div>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {milestone.solution}
                            </p>
                          </div>
                        </div>

                        {/* Technical Specs Table */}
                        <div className="border-border/60 bg-muted/10 rounded border p-3">
                          <div className="text-foreground mb-2 flex items-center gap-1.5 font-mono text-[11px] tracking-wider uppercase">
                            <Cpu className="text-primary size-3" />
                            <span>Hardware & Stack Telemetry</span>
                          </div>
                          <div className="grid grid-cols-1 gap-2 font-mono text-xs sm:grid-cols-2">
                            {milestone.specs.map((spec, sIdx) => (
                              <div
                                key={sIdx}
                                className="border-border/30 flex items-start justify-between gap-2 border-b pb-1"
                              >
                                <span className="text-muted-foreground/70 shrink-0">
                                  {spec.label}:
                                </span>
                                <span className="text-foreground text-right">
                                  {spec.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Engineering Breakthrough Callout */}
                        <div className="border-l-primary bg-primary/5 rounded border-l-2 p-3 text-xs">
                          <div className="text-primary mb-1 flex items-center gap-1.5 font-mono font-semibold">
                            <CheckCircle2 className="size-3.5" />
                            <span>Key Technical Breakthrough</span>
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
