# CMS (Decap) setup

This site uses **Decap CMS** (Git-based CMS) to edit the existing **MDX content** under `src/content/` without changing how Astro renders your pages/components.

## Local (recommended while developing)

Run Astro and the Decap local backend in two terminals:

```bash
npm run dev
```

```bash
npm run cms:local
```

Then open `http://localhost:1234/admin/`.

## Production editing (choose one)

Decap needs a Git provider auth flow in production. Pick one of these:

### Option A: Netlify (easiest)

- Set `backend.name` to `git-gateway` in `public/admin/config.yml`
- Enable **Netlify Identity** + **Git Gateway**
- Invite your editors in Netlify

### Option B: GitHub OAuth (works anywhere, more setup)

- Keep `backend.name: github` in `public/admin/config.yml`
- Create a GitHub OAuth App and provide an OAuth “bridge” (Decap requires this)
- Configure your deployed `/admin/` to use the OAuth bridge

If you want, tell me where you deploy (Vercel / Netlify / Cloudflare Pages / custom server) and I’ll tailor the exact production auth steps for that platform.

