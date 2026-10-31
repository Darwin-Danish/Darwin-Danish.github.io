import { glob } from 'astro/loaders'
import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      parent_slug: z.string().optional(),
      is_subpost: z.boolean().optional(),
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      order: z.number().optional(),
      // Uploaded assets live in /public/uploads and should be treated as plain paths,
      // not Astro-processed assets, to avoid dev-time ImageNotFound races.
      image: z
        .string()
        .url()
        .or(z.string().startsWith('/'))
        .or(image())
        .optional(),
      tags: z.array(z.string()).optional(),
      authors: z.array(z.string()).optional(),
      draft: z.boolean().optional(),
    }),
})

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/authors' }),
  schema: z.object({
    name: z.string(),
    fullName: z.string().optional(),
    pronouns: z.string().optional(),
    avatar: z.string().url().or(z.string().startsWith('/')),
    bio: z.string().optional(),
    mail: z.string().email().optional(),
    website: z.string().url().optional(),
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    orcid: z.string().url().optional(),
    instagram: z.string().url().optional(),
    threads: z.string().url().optional(),
    gravatar: z.string().url().optional(),
    huggingface: z.string().url().optional(),
    pypi: z.string().url().optional(),
    stackoverflow: z.string().url().optional(),
    gitlab: z.string().url().optional(),
    kofi: z.string().url().optional(),
    facebook: z.string().url().optional(),
    discord: z.string().url().optional(),
    discordUsername: z.string().optional(),
    discordInvite: z.string().url().optional(),
  }),
})

const home = defineCollection({
  loader: glob({ pattern: 'index.md', base: 'src/content/home' }),
  schema: z.object({
    title: z.string(),
    details: z.string(),
  }),
})

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      tags: z.array(z.string()),
      image: z.string().url().or(z.string().startsWith('/')).or(image()),
      link: z.string().optional(),
      startDate: z.coerce.date().optional(),
      endDate: z.coerce.date().optional(),
      order: z.coerce.number().optional().catch(0),
    }),
})

const tags = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/tags' }),
  schema: z.object({
    name: z.string(),
    type: z.enum(['Special', 'Common']).optional().default('Special'),
    color: z.string().optional(),
    icon: z.string().optional(),
  }),
})

export const collections = { blog, authors, projects, tags, home }
