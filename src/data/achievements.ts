/**
 * ============================================================================
 * Darwin Danish Portfolio — Achievements, Competitions & Certifications Data
 * ============================================================================
 *
 * How to add a past or new competition:
 * 1. Add an object to the `competitions` array below.
 * 2. Put award or event photos in `/public/uploads/` or `/public/images/` and
 *    list them in `images: [{ src: '/uploads/...', alt: '...', caption: '...' }]`.
 * 3. Specify both `eventDate` (display text e.g. "November 2024") and
 *    `isoEventDate` (ISO string e.g. "2024-11-09"). The page structured data
 *    preserves the historical event date while serving an updated `dateModified`
 *    so search engines (Google) know the post is fresh and actively indexed.
 *
 * How to add a certification:
 * 1. Add an object to the `certifications` array below.
 * 2. Optionally attach a certificate image via `image: '/uploads/certificate.jpg'`.
 * ============================================================================
 */

export interface CompetitionImage {
  src: string
  alt: string
  caption?: string
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
      },
      {
        src: '/uploads/df6e92ef-8212-4847-9aac-cf5bdbdfe473.jpg',
        alt: 'Team with Project Lumina prototype, trophy, and mentor Mdm Victoria',
        caption: 'Project Lumina prototype with trophy and faculty mentor Mdm Victoria',
      },
    ],
    link: '/blog/posts/lumina-journey/',
    linkLabel: 'Read Full Lumina Technical Build & Story',
    category: 'IoT & Conversational AI',
  },
  {
    id: 'sarawak-stem-robotics-2023',
    title: 'Sarawak State STEM Robotics Challenge',
    award: 'Division Finalist & Technical Merit',
    organizer: 'Sarawak State Education Department (JPNS)',
    eventDate: 'November 2023',
    isoEventDate: '2023-11-15',
    location: 'Sarawak, Malaysia',
    featured: false,
    projectName: 'Autonomous Corridor Navigation Rover',
    description:
      'Engineered an autonomous differential-drive navigation rover equipped with dual ultrasonic rangefinders and an infrared line-tracker array. Implemented PID steering compensation on an Arduino Nano to navigate obstacle-strewn corridors without relying on GPS or cloud connectivity.',
    technologies: [
      'Arduino C++',
      'L298N Motor Driver',
      'HC-SR04 Sensors',
      'TCRT5000 IR Array',
    ],
    specs: [
      { label: 'Platform', value: 'Arduino Nano & Embedded C++' },
      { label: 'Locomotion', value: 'Twin DC Geared Motors with Dual H-Bridge' },
      { label: 'Sensory Array', value: 'Dual Ultrasonic + 5-Channel Infrared Reflective' },
      { label: 'Navigation', value: 'Closed-loop PID steering compensation' },
    ],
    category: 'Autonomous Robotics',
  },
  {
    id: 'karnival-stem-kebangsaan-2023',
    title: 'Karnival STEM Kebangsaan (National Science Fair)',
    award: 'State High Distinction',
    organizer: 'Ministry of Education Malaysia (KPM)',
    eventDate: 'July 2023',
    isoEventDate: '2023-07-20',
    location: 'Sarawak Division',
    featured: false,
    projectName: 'Automated Micro-Waste Sorting Prototype',
    description:
      'Showcased an automated micro-waste sorting prototype utilizing capacitive proximity sensing and high-torque servo deflection gates. Evaluated across criteria including material durability, energy efficiency, and feasibility of integration into municipal recycling streams.',
    technologies: [
      'ESP32',
      'MG996R Servos',
      'Capacitive Sensors',
      'I2C OLED Display',
    ],
    specs: [
      { label: 'Microcontroller', value: 'ESP32 Dual-Core Tensilica Xtensa' },
      { label: 'Actuation', value: 'Metal-Gear High-Torque Servos' },
      { label: 'Sensing Principle', value: 'Dielectric Capacitive Sensing' },
      { label: 'Display', value: '0.96-inch Monochrome I2C OLED' },
    ],
    category: 'Sustainable Engineering',
  },
  {
    id: 'nasa-space-apps-2024',
    title: 'NASA Space Apps Challenge (Sarawak Hub)',
    award: 'Global Nominee Contender',
    organizer: 'NASA Space Apps Global & Regional Partners',
    eventDate: 'October 2024',
    isoEventDate: '2024-10-06',
    location: 'Sarawak Virtual Hub',
    featured: false,
    projectName: 'Astronomical Exoplanet Transit Classifier',
    description:
      'Tackled astronomical big data by architecting an automated exoplanet candidate screening model using light-curve folding and stacked classification. Addressed heavy observational noise and class imbalance, culminating in an open-source pipeline published on Hugging Face.',
    technologies: [
      'Python 3.10',
      'Scikit-Learn',
      'LightGBM',
      'Random Forest',
      'Matplotlib',
    ],
    specs: [
      { label: 'Architecture', value: 'Heterogeneous Ensemble Model Stacking' },
      { label: 'Dataset', value: 'NASA Kepler Transit Photometry Archive' },
      { label: 'Primary Metric', value: 'High Recall on Low-SNR Transit Dips' },
      { label: 'Distribution', value: 'Hugging Face Hub Open Weights' },
    ],
    link: 'https://huggingface.co/DarwinDanish/exoplanet-classifier-stacking',
    linkLabel: 'View Model on Hugging Face',
    category: 'Machine Learning & Space Science',
  },
]

export const certifications: Certification[] = [
  {
    id: 'ml-stacking',
    name: 'Machine Learning & Model Stacking Specialization',
    issuer: 'DeepLearning / Kaggle Academy',
    credentialId: 'KAG-ML-STACK-8924',
    issueDate: '2025',
    isoDate: '2025-11-01',
    status: 'Verified',
    icon: 'lucide:binary',
    skills: [
      'Scikit-Learn',
      'Ensemble Methods',
      'Data Pipelines',
      'Model Stacking',
    ],
    verificationUrl: 'https://huggingface.co/DarwinDanish',
  },
  {
    id: 'embedded-linux-rpi',
    name: 'Embedded Linux & Physical Computing (Raspberry Pi)',
    issuer: 'Raspberry Pi Foundation / STEM Academy',
    credentialId: 'RPF-EMB-2024-551',
    issueDate: '2024',
    isoDate: '2024-08-15',
    status: 'Verified',
    icon: 'lucide:cpu',
    skills: [
      'Raspberry Pi OS',
      'GPIO Interfacing',
      'Python Daemons',
      'I2S / UART',
    ],
    verificationUrl: 'https://github.com/Darwin-Danish',
  },
  {
    id: 'git-software-engineering',
    name: 'Distributed Version Control & Software Engineering',
    issuer: 'GitHub Campus / Linux Foundation',
    credentialId: 'GH-DEV-0921-VERIFIED',
    issueDate: '2023',
    isoDate: '2023-09-21',
    status: 'Verified',
    icon: 'lucide:git-branch',
    skills: [
      'Git CLI',
      'GitHub Actions CI/CD',
      'Automated Builds',
      'Semantic Release',
    ],
    verificationUrl: 'https://github.com/Darwin-Danish',
  },
  {
    id: 'fullstack-web-architecture',
    name: 'Full-Stack Web Architecture & Real-Time APIs',
    issuer: 'FreeCodeCamp / Open Web Standards',
    credentialId: 'FCC-JS-FULLSTACK-338',
    issueDate: '2024',
    isoDate: '2024-05-10',
    status: 'Verified',
    icon: 'lucide:globe',
    skills: ['React', 'Astro', 'WebSockets', 'Node.js REST', 'Tailwind CSS'],
    verificationUrl: 'https://darwindanish.github.io',
  },
]

export const pressArticles: PressArticle[] = [
  {
    id: 'utusan-borneo-2024',
    publisher: 'Utusan Borneo',
    publisherBadge: 'Regional Daily',
    date: 'November 2024',
    title:
      "Inovasi Mini Inno Waste 2.0: Pasukan SMK Kapit Cipta Tong Sampah Pintar 'Lumina'",
    excerpt:
      'Pasukan inovasi SMK Kapit yang diketuai oleh Darwin Danish bersama Nigel Sibat dan Dexter Sangin di bawah bimbingan Cikgu Victoria dinobatkan sebagai Juara Pertandingan Reka Cipta Mini Inno Waste 2.0. Reka cipta tong sampah pintar bertemakan arnab ini menggabungkan tayar terpakai, mikrokomputer Raspberry Pi, dan sistem kecerdasan buatan bagi memupuk kesedaran kitar semula.',
    link: 'https://www.utusanborneo.com.my',
    category: 'State Innovation & Education',
    readTime: '3 min read',
  },
  {
    id: 'borneo-post-2024',
    publisher: 'The Borneo Post',
    publisherBadge: 'Sarawak English Press',
    date: 'November 2024',
    title:
      'Kapit Youths Champion Smart Waste Management Through AI-Powered Eco-Bin',
    excerpt:
      "High school innovators from Kapit National Secondary School bagged 1st place with 'Lumina'. The project transforms discarded tires into an interactive, conversational waste station equipped with real-time mobile app monitoring, speech recognition, and instant WhatsApp emergency alerts when full.",
    link: 'https://www.theborneopost.com',
    category: 'STEM & Youth Tech',
    readTime: '4 min read',
  },
  {
    id: 'huggingface-stacking-2025',
    publisher: 'Hugging Face Hub',
    publisherBadge: 'ML Open Source',
    date: 'November 2025',
    title:
      'Community Release: Astronomical Exoplanet Classifier with Model Stacking',
    excerpt:
      'DarwinDanish published a production-grade machine learning stacking pipeline trained on NASA Kepler transit light curve observations, utilizing heterogeneous base estimators to discern genuine planetary transits with elevated precision.',
    link: 'https://huggingface.co/DarwinDanish/exoplanet-classifier-stacking',
    category: 'AI & Astrophysics',
    readTime: '2 min read',
  },
  {
    id: 'sarawak-stem-gazette-2024',
    publisher: 'Sarawak STEM Gazette',
    publisherBadge: 'Education Bulletin',
    date: 'December 2024',
    title:
      'Empowering Rural Talents: The Rising Wave of Young Computer Engineers in Kapit',
    excerpt:
      'Spotlight feature on Darwin Danish and student engineers in Sarawak demonstrating that high-tech innovations—spanning embedded IoT, WebSocket communications, and AI agents—can emerge directly from school laboratories in Kapit.',
    link: 'https://sarawak.gov.my',
    category: 'Community Feature',
    readTime: '5 min read',
  },
]
