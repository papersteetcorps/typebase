# Paper Street Corps

Next.js + Supabase-ready implementation of the Paper Street Corps platform concept.

## What is included

- Dark modern home page with search, auth actions, debate chamber entry, and generated hero image.
- Search result cards for profiles, profile lists, and profile list categories.
- Typology color dots in the required order: Classic Jung, Enneagram with Subtype, Socionics, Temperaments, Moral Alignment, Big 5 SLOAN, TRC.
- Profile detail surface with typed systems, highest-vetted analysis, and best/new comment toggle.
- Theory, rules, platform guide, report routing, and user profile sections.
- Local prototype login/signup session.
- Add-request flow for categories, profile lists, and profiles.
- Optional profile photograph upload with legal media disclaimer.
- Profile analysis comment form with 150-600 word validation and server-side Anthropic audit handoff messaging.
- Attached corpus files under `assets/corpora/` for Classic Jung, Enneagram, Socionics, Temperaments, Moral Alignment, and TRC.
- No payment gateway or money-related implementation.
- Next.js 15 App Router + TypeScript app in `app/`.
- Supabase Auth client foundation in `lib/supabase/client.ts`.
- Public assets and theory corpuses in `public/assets/`.

## Run

This machine has Node/npm at `C:\Program Files\nodejs`, but they may not be in PATH. Use:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Verify

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
npm run typecheck
npm run build
```

## Environment

Copy `.env.local.example` to `.env.local` once you have keys:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ANTHROPIC_API_KEY=
```

Until Supabase keys are configured, login/sign-up falls back to a local demo state and clearly says Supabase is not configured.

## Backend still required

The app is migrated to Next.js and wired for Supabase Auth, but these production features still require a real Supabase project and schema:

- Supabase Auth settings and email verification.
- Supabase PostgreSQL tables for users, profiles, lists, votes, reports, comments, ranks, and markers.
- Supabase Storage buckets for uploaded profile/user/evidence photographs.
- Server route for Anthropic comment auditing so API keys are never exposed in browser code.

The old static prototype files (`index.html`, `styles.css`, `app.js`) remain for reference and can be removed once the Next app is fully approved.

## Run

Open `index.html` in a browser. The current version has no build step.

## Next likely step

When the product shape is approved, this can be migrated into the planned stack: Next.js App Router, TypeScript, Tailwind/shadcn, Supabase, Drizzle, Zod, and AI vetting APIs.
