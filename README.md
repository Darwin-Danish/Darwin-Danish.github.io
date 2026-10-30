<div align="center">

# Darwin Danish — Portfolio & Blog

[![Site](https://img.shields.io/badge/Site-darwindanish.github.io-blue?style=for-the-badge)](https://darwindanish.github.io)
[![Code License](https://img.shields.io/badge/Code%20License-MIT-green?style=for-the-badge)](LICENSE.md)
[![Content License](https://img.shields.io/badge/Content%20License-CC%20BY--NC--ND%204.0-lightgrey?style=for-the-badge)](LICENSE.content.md)

Personal portfolio and technical blog of **Darwin Danish**, computer engineering student and tech enthusiast passionate about IoT, AI, software development, and Formula 1.

</div>

---

## Overview

This website serves as the personal portfolio, project showcase, and technical blog for Darwin Danish, hosted statically on [GitHub Pages](https://darwindanish.github.io).

## Tech Stack

| Category | Technology |
| --- | --- |
| Framework | [**Astro 5**](https://astro.build/) (Static Site Generation) |
| Styling | [**Tailwind CSS**](https://tailwindcss.com/) with Typography |
| Components | [**shadcn/ui**](https://ui.shadcn.com/) & React 19 |
| Content Collections | [**MDX**](https://mdxjs.com/) with native Astro content collections |
| Syntax Highlighting | [**Expressive Code**](https://expressive-code.com/) & Shiki |
| Deployment | [**GitHub Pages**](https://pages.github.com/) |

## Project Structure

```
/
├── public/                 # Static assets, fonts, icons, robots.txt
├── src/
│   ├── components/         # UI components & bento grid widgets
│   ├── content/            # MDX content collections (blog, projects, authors)
│   ├── layouts/            # Page and blog post layouts
│   ├── pages/              # Astro static routes
│   └── consts.ts           # Site constants and navigation configuration
└── astro.config.ts         # Astro static build configuration
```

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript and Astro checks
npx astro check

# Build static output for production
npm run build
```

## Attribution & Licensing

- **Code License**: Licensed under the [MIT License](LICENSE.md). Based on open-source templates [astro-erudite](https://github.com/jktrn/astro-erudite) and [astro-micro](https://github.com/trevortylerlee/astro-micro).
- **Content License**: All original blog posts, project writings, and personal media are licensed under [CC BY-NC-ND 4.0](LICENSE.content.md).
