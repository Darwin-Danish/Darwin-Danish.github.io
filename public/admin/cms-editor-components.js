/**
 * Decap CMS Custom Editor Components
 * Registers toolbar widgets so editors can insert MDX components
 * (Callout, Challenge, etc.) without typing raw MDX syntax.
 */

/* ── Callout ─────────────────────────────────────────────── */
CMS.registerEditorComponent({
  id: 'callout',
  label: 'Callout',
  fields: [
    {
      name: 'variant',
      label: 'Variant',
      widget: 'select',
      default: 'note',
      options: [
        'note', 'tip', 'warning', 'danger', 'important',
        'definition', 'theorem', 'lemma', 'proof', 'corollary',
        'proposition', 'axiom', 'conjecture', 'notation', 'remark',
        'intuition', 'recall', 'explanation', 'example', 'exercise',
        'problem', 'answer', 'solution', 'summary',
      ],
    },
    { name: 'title', label: 'Title (optional)', widget: 'string', required: false },
    {
      name: 'defaultOpen',
      label: 'Open by default',
      widget: 'boolean',
      default: true,
    },
    { name: 'body', label: 'Content', widget: 'text' },
  ],
  pattern: /^<Callout\s+variant="([^"]*)"(?:\s+title="([^"]*)")?(?:\s+defaultOpen=\{(true|false)\})?\s*>\n([\s\S]*?)\n<\/Callout>$/,
  fromBlock(match) {
    return {
      variant: match[1],
      title: match[2] || '',
      defaultOpen: match[3] !== 'false',
      body: match[4],
    }
  },
  toBlock(data) {
    const titleAttr = data.title ? ` title="${data.title}"` : ''
    const openAttr = data.defaultOpen === false ? ' defaultOpen={false}' : ''
    return `<Callout variant="${data.variant}"${titleAttr}${openAttr}>\n${data.body}\n</Callout>`
  },
  toPreview(data) {
    const colors = {
      note: '#3b82f6', tip: '#22c55e', warning: '#f59e0b',
      danger: '#ef4444', important: '#a855f7',
    }
    const color = colors[data.variant] || '#6b7280'
    return `<div style="border-left:4px solid ${color};padding:12px 16px;margin:8px 0;background:${color}11">
      <strong style="color:${color}">${data.variant.charAt(0).toUpperCase() + data.variant.slice(1)}${data.title ? ' (' + data.title + ')' : ''}</strong>
      <div style="margin-top:4px">${data.body}</div></div>`
  },
})

/* ── Challenge ───────────────────────────────────────────── */
CMS.registerEditorComponent({
  id: 'challenge',
  label: 'Challenge',
  fields: [
    { name: 'title', label: 'Title', widget: 'string' },
    { name: 'category', label: 'Category', widget: 'string' },
    { name: 'points', label: 'Points', widget: 'number', required: false },
    { name: 'solves', label: 'Solves', widget: 'number', required: false },
    { name: 'flag', label: 'Flag', widget: 'string', required: false },
    { name: 'remote', label: 'Remote', widget: 'string', required: false },
    { name: 'body', label: 'Description', widget: 'text' },
  ],
  pattern: /^<Challenge\s+title="([^"]*)"(?:\s+category="([^"]*)")?(?:\s+points=\{(\d+)\})?(?:\s+solves=\{(\d+)\})?(?:\s+flag="([^"]*)")?(?:\s+remote="([^"]*)")?\s*>\n([\s\S]*?)\n<\/Challenge>$/,
  fromBlock(match) {
    return {
      title: match[1],
      category: match[2] || '',
      points: match[3] ? parseInt(match[3]) : '',
      solves: match[4] ? parseInt(match[4]) : '',
      flag: match[5] || '',
      remote: match[6] || '',
      body: match[7],
    }
  },
  toBlock(data) {
    let attrs = `title="${data.title}"`
    if (data.category) attrs += ` category="${data.category}"`
    if (data.points) attrs += ` points={${data.points}}`
    if (data.solves) attrs += ` solves={${data.solves}}`
    if (data.flag) attrs += ` flag="${data.flag}"`
    if (data.remote) attrs += ` remote="${data.remote}"`
    return `<Challenge ${attrs}>\n${data.body}\n</Challenge>`
  },
  toPreview(data) {
    return `<div style="border:1px solid #374151;border-radius:8px;padding:16px;margin:8px 0;background:#111827;color:#f9fafb">
      <div style="font-weight:bold;font-size:1.1em;margin-bottom:8px">${data.title}</div>
      <div style="display:flex;gap:16px;font-size:0.85em;color:#9ca3af;margin-bottom:8px">
        ${data.category ? '<span>Category: ' + data.category + '</span>' : ''}
        ${data.points ? '<span>Points: ' + data.points + '</span>' : ''}
        ${data.solves ? '<span>Solves: ' + data.solves + '</span>' : ''}
      </div>
      <div>${data.body}</div>
      ${data.flag ? '<div style="margin-top:8px;font-family:monospace;background:#1f2937;padding:4px 8px;border-radius:4px">Flag: ' + data.flag + '</div>' : ''}
    </div>`
  },
})

/* ── CountryFlag ─────────────────────────────────────────── */
CMS.registerEditorComponent({
  id: 'countryflag',
  label: 'Country Flag',
  fields: [
    { name: 'country', label: 'Country Code (2-letter)', widget: 'string' },
  ],
  pattern: /^<CountryFlag\s+country="([^"]*)" \/>$/,
  fromBlock(match) {
    return { country: match[1] }
  },
  toBlock(data) {
    return `<CountryFlag country="${data.country}" />`
  },
  toPreview(data) {
    return `<span>🏳️ ${data.country.toUpperCase()}</span>`
  },
})

/* ── FirstSubpost ────────────────────────────────────────── */
CMS.registerEditorComponent({
  id: 'firstsubpost',
  label: 'First Subpost Link',
  fields: [
    { name: 'title', label: 'Title', widget: 'string' },
    { name: 'href', label: 'URL', widget: 'string' },
  ],
  pattern: /^<FirstSubpost\s+title="([^"]*)"\s+href="([^"]*)" \/>$/,
  fromBlock(match) {
    return { title: match[1], href: match[2] }
  },
  toBlock(data) {
    return `<FirstSubpost title="${data.title}" href="${data.href}" />`
  },
  toPreview(data) {
    return `<a href="${data.href}" style="display:block;padding:12px;border:1px solid #3b82f6;border-radius:8px;text-decoration:none;color:#3b82f6">
      <small>First Subpost</small><br><strong>${data.title}</strong></a>`
  },
})

/* ── StaticTweet ─────────────────────────────────────────── */
CMS.registerEditorComponent({
  id: 'statictweet',
  label: 'Static Tweet',
  fields: [
    { name: 'avatar', label: 'Avatar URL', widget: 'string' },
    { name: 'username', label: 'Display Name', widget: 'string' },
    { name: 'handle', label: 'Handle (without @)', widget: 'string' },
    { name: 'date', label: 'Date', widget: 'string' },
    { name: 'src', label: 'Tweet URL', widget: 'string' },
    { name: 'body', label: 'Tweet Content', widget: 'text' },
  ],
  pattern: /^<StaticTweet\s+avatar="([^"]*)"\s+username="([^"]*)"\s+handle="([^"]*)"\s+date="([^"]*)"\s+src="([^"]*)"\s*>\n([\s\S]*?)\n<\/StaticTweet>$/,
  fromBlock(match) {
    return {
      avatar: match[1], username: match[2], handle: match[3],
      date: match[4], src: match[5], body: match[6],
    }
  },
  toBlock(data) {
    return `<StaticTweet avatar="${data.avatar}" username="${data.username}" handle="${data.handle}" date="${data.date}" src="${data.src}">\n${data.body}\n</StaticTweet>`
  },
  toPreview(data) {
    return `<div style="border:1px solid #38444d;border-radius:12px;padding:16px;max-width:500px;background:#15202b;color:#d9d9d9">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
        <img src="${data.avatar}" style="width:48px;height:48px;border-radius:50%" />
        <div><strong style="color:#fff">${data.username}</strong><br><span style="color:#8899a6">@${data.handle}</span></div>
      </div>
      <div style="margin-bottom:8px">${data.body}</div>
      <div style="color:#8899a6;font-size:0.85em">${data.date}</div></div>`
  },
})

/* ── KaTeX Math Block ────────────────────────────────────── */
CMS.registerEditorComponent({
  id: 'math',
  label: 'Math (KaTeX)',
  fields: [
    { name: 'expression', label: 'LaTeX Expression', widget: 'text' },
  ],
  pattern: /^\$\$\n([\s\S]*?)\n\$\$$/,
  fromBlock(match) {
    return { expression: match[1] }
  },
  toBlock(data) {
    return `$$\n${data.expression}\n$$`
  },
  toPreview(data) {
    return `<div style="text-align:center;padding:16px;background:#f8fafc;border-radius:4px;font-family:serif;font-size:1.2em">${data.expression}</div>`
  },
})

/* ── Import Helper ──────────────────────────────────────── */
CMS.registerEditorComponent({
  id: 'mdx-import',
  label: 'MDX Import',
  fields: [
    {
      name: 'component',
      label: 'Component',
      widget: 'select',
      options: [
        { label: 'Callout', value: "import Callout from '@/components/mdx/Callout.astro'" },
        { label: 'Challenge', value: "import Challenge from '@/components/mdx/Challenge.astro'" },
        { label: 'CountryFlag', value: "import CountryFlag from '@/components/mdx/CountryFlag.astro'" },
        { label: 'FirstSubpost', value: "import FirstSubpost from '@/components/mdx/FirstSubpost.astro'" },
        { label: 'StaticTweet', value: "import StaticTweet from '@/components/mdx/StaticTweet.astro'" },
        { label: 'Code (Expressive Code)', value: "import { Code } from 'astro-expressive-code/components'" },
      ],
    },
  ],
  pattern: /^(import .+ from ['"]@\/components\/mdx\/[^'"]+['"]|import \{ Code \} from ['"]astro-expressive-code\/components['"])$/,
  fromBlock(match) {
    return { component: match[1] }
  },
  toBlock(data) {
    return data.component
  },
  toPreview(data) {
    return `<code style="font-size:0.85em;background:#f1f5f9;padding:4px 8px;border-radius:4px">${data.component}</code>`
  },
})
