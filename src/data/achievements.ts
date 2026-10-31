/**
 * ============================================================================
 * Darwin Danish Portfolio — Achievements & Competitions Data
 * ============================================================================
 *
 * How to add a past or new competition:
 * 1. Add an object to the `competitions` array below.
 * 2. Put award or event photos in `/public/uploads/` or `/public/images/` and
 *    list them in `images: [{ src: '/uploads/...', alt: '...', caption: '...' }]`
 *    or simply `image: '/uploads/award.jpg'`.
 * 3. Specify both `eventDate` (display text e.g. "9 November 2024") and
 *    `isoEventDate` (ISO string e.g. "2024-11-09").
 *
 * How to add a certification:
 * 1. Add an object to the `certifications` array below.
 * 2. Optionally attach a certificate image via `image: '/uploads/certificate.jpg'`.
 *
 * How to add press/media mentions:
 * 1. Add an object to the `pressArticles` array below.
 * ============================================================================
 */

export interface CompetitionImage {
  src: string
  alt: string
  caption?: string
  width?: number
  height?: number
}

export interface CompetitionTeamMember {
  name: string
  role: string
}

export interface CompetitionSpec {
  label: string
  value: string
}

export interface Competition {
  id: string
  title: string
  award: string
  organizer: string
  eventDate: string
  isoEventDate: string
  location?: string
  description: string
  prize?: string
  projectName?: string
  projectSubtitle?: string
  team?: CompetitionTeamMember[]
  technologies?: string[]
  specs?: CompetitionSpec[]
  images?: CompetitionImage[]
  image?: string // Direct path to certificate or award photo e.g. "/uploads/award.jpg"
  link?: string
  linkLabel?: string
  featured?: boolean
  category?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  isoDate?: string
  credentialId?: string
  verificationUrl?: string
  skills?: string[]
  image?: string // Path to certificate image e.g. "/uploads/cert.png"
  status?: string
  icon?: string
}

export interface PressArticle {
  id: string
  publisher: string
  publisherBadge: string
  date: string
  title: string
  excerpt: string
  link: string
  category?: string
  readTime?: string
}

export const competitions: Competition[] = [
  {
    id: 'mini-inno-waste-2',
    title: 'Pertandingan Reka Cipta Mini Inno Waste 2.0',
    award: '1st Place Champion (Juara Pertama)',
    prize: 'RM 1,000 Grand Prize',
    organizer:
      'Pejabat Pendidikan Daerah (PPD) Kapit & Environmental Education Council',
    eventDate: '9 November 2024',
    isoEventDate: '2024-11-09',
    location: 'Kapit, Sarawak',
    featured: true,
    projectName: 'Project Lumina',
    projectSubtitle: 'The Intelligent, AI-Powered Interactive Eco-Bin',
    description:
      'Secured 1st Place out of all participating institutions in Kapit, Sarawak. Conceived and engineered an interactive waste segregation station constructed from discarded vehicle tires. Integrated an onboard Raspberry Pi 4, offline Picovoice wake-word recognition, OpenAI Whisper speech transcription, conversational intelligence, and automated emergency WhatsApp notifications to administrators when storage capacity is reached.',
    team: [
      {
        name: 'Darwin Danish',
        role: 'Lead Architect & Software (Raspberry Pi, Speech AI, WebSockets, Mobile App)',
      },
      {
        name: 'Mdm Victoria',
        role: 'Faculty Mentor (Supervision & Technical Review)',
      },
      {
        name: 'Nigel Sibat',
        role: 'Mechanical Builder (Tire Chassis & Wheelbase Fabrication)',
      },
      {
        name: 'Dexter Sangin',
        role: 'Structural Builder (Carpentry, 3D Print Finish & Enclosure)',
      },
    ],
    technologies: [
      'Raspberry Pi 4',
      'OpenAI Whisper',
      'Picovoice Porcupine',
      'WhatsApp Cloud API',
      'WebSockets',
      'Python 3.10',
    ],
    specs: [
      { label: 'Compute Architecture', value: 'Raspberry Pi 4 Model B (Quad Core Cortex-A72)' },
      { label: 'Chassis Material', value: 'Repurposed Vehicle Tires + 3D Printed PETG Accents' },
      { label: 'Audio Hardware', value: 'I2S DAC, USB Noise-Cancelling Array Microphone' },
      { label: 'Networking', value: 'Dual Stack (Local WebSockets Bridge + HTTPS Webhooks)' },
    ],
    images: [
      {
        src: '/uploads/cc7c7aaf-b7aa-4ded-a0d8-8ceb4e59b01d.jpg',
        alt: 'Darwin Danish and team holding the RM 1,000 championship mock check on stage',
        caption: 'Award Ceremony: Championship check presentation on stage',
        width: 1280,
        height: 960,
      },
      {
        src: '/uploads/df6e92ef-8212-4847-9aac-cf5bdbdfe473.jpg',
        alt: 'Team with Project Lumina prototype, trophy, and mentor Mdm Victoria',
        caption: 'Project Lumina prototype with trophy and faculty mentor Mdm Victoria',
        width: 960,
        height: 1280,
      },
    ],
    link: '/blog/posts/lumina-journey/',
    linkLabel: 'Read Full Lumina Technical Build & Story',
    category: 'IoT & Conversational AI',
  },
]

export const certifications: Certification[] = []

export const pressArticles: PressArticle[] = []
