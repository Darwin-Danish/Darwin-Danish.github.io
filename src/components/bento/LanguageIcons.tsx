import { type IconType } from 'react-icons/lib'
import {
  SiAstro,
  SiC,
  SiCplusplus,
  // SiCsharp,
  SiDart,
  SiCss3,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiKotlin,
  SiLatex,
  SiMarkdown,
  SiMdx,
  SiOpenjdk,
  SiPython,
  SiRust,
  SiSwift,
  SiTypescript,
  SiYaml,
  SiGnubash,
} from 'react-icons/si'

export const languageIcons: { [key: string]: IconType } = {
  astro: SiAstro,
  html: SiHtml5,
  css: SiCss3,
  javascript: SiJavascript,
  python: SiPython,
  dart: SiDart,
  rust: SiRust,
  go: SiGo,
  java: SiOpenjdk,
  kotlin: SiKotlin,
  swift: SiSwift,
  bash: SiGnubash,
  shell: SiGnubash,
  sh: SiGnubash,
  zsh: SiGnubash,
  c: SiC,
  'c++': SiCplusplus,
  // 'c#': SiCsharp,
  typescript: SiTypescript,
  markdown: SiMarkdown,
  mdx: SiMdx,
  json: SiJson,
  yaml: SiYaml,
  tex: SiLatex,
}

export const getLanguageIcon = (language: string): React.ReactNode | null => {
  const normalized = language.trim().toLowerCase()
  const Icon = languageIcons[normalized]
  return Icon ? <Icon /> : null
}
