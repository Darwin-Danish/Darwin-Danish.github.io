import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Darwin Danish',
  description:
    'A young computer engineering student and tech enthusiast passionate about IoT, machine learning, software development, and Formula 1',
  href: 'https://darwindanish.dev',
  author: 'Darwin',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 4,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/blog',
    label: 'Blog',
  },
  {
    href: '/work',
    label: 'Work',
  },
  {
    href: '/about',
    label: 'About',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://www.instagram.com/darwin.danish29',
    label: 'Instagram',
  },
  {
    href: 'https://gravatar.com/darwindanish',
    label: 'Gravatar',
  },
  {
    href: 'mailto:lumina.ai.devs@gmail.com',
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
  Gravatar: 'gravatar',
  LinkedIn: 'lucide:linkedin',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
