import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Darwin Danish',
  description:
    'Computer engineering student and systems builder passionate about IoT architectures, machine learning, software engineering, and motorsport tech & innovation.',
  href: 'https://darwindanish.github.io',
  author: 'Darwin Danish',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 4,
  keywords: [
    'Darwin Danish',
    'Darwin Danish Anak Geramong',
    'Computer Science',
    'Computer Engineering',
    'IoT',
    'Machine Learning',
    'Artificial Intelligence',
    'Software Development',
    'Formula 1',
    'Kapit Sarawak',
    'Portfolio',
  ],
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/blog/',
    label: 'Blog',
  },
  {
    href: '/work/',
    label: 'Work',
  },
  {
    href: '/achievements/',
    label: 'Achievements',
  },
  {
    href: '/about/',
    label: 'About',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/darwindanish',
    label: 'GitHub',
  },
  {
    href: 'https://linkedin.com/in/darwin-danish',
    label: 'LinkedIn',
  },
  {
    href: 'https://orcid.org/0009-0000-1047-4320',
    label: 'ORCID',
  },
  {
    href: 'https://www.instagram.com/darwin.danish29',
    label: 'Instagram',
  },
  {
    href: 'https://www.threads.net/@darwin.danish29',
    label: 'Threads',
  },
  {
    href: 'https://huggingface.co/DarwinDanish',
    label: 'Hugging Face',
  },
  {
    href: 'https://pypi.org/user/DarwinDanish/',
    label: 'PyPI',
  },
  {
    href: 'https://gravatar.com/darwindanish',
    label: 'Gravatar',
  },
  {
    href: 'mailto:darwindanish.work@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  Instagram: 'lucide:instagram',
  Threads: 'simple-icons:threads',
  Gravatar: 'simple-icons:gravatar',
  LinkedIn: 'simple-icons:linkedin',
  GitHub: 'simple-icons:github',
  Discord: 'simple-icons:discord',
  'Hugging Face': 'simple-icons:huggingface',
  PyPI: 'simple-icons:pypi',
  ORCID: 'simple-icons:orcid',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
