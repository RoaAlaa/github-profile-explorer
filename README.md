# GitHub Profile Explorer

A Next.js app for searching GitHub profiles, comparing developers, and keeping notes — with AI-powered profile analysis and repository chat grounded in real repo data.

## Features

- **Profile search** — Enter a GitHub username on the home page to view their avatar, bio, stats, and repositories.
- **Compare profiles** — Side-by-side comparison of two users (repos, stars, followers, commit frequency, and more).
- **AI profile analysis** — Summarizes a developer's public GitHub activity using Groq.
- **Repo chat** — Ask questions about a specific repository; answers are grounded in the README, file tree, and recent commits. Responses stream and history persists per repo.
- **Notes** — Save notes on profiles or individual repos. View all notes from the home page.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Prisma + PostgreSQL (notes and chat history)
- GitHub REST API
- Groq (Llama 3.3 70B)

## Getting started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

3. Run database migrations:

```bash
npx prisma migrate deploy
```

4. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GITHUB_TOKEN` | Recommended | GitHub personal access token for higher API rate limits |
| `GROQ_API_KEY` | Yes (for AI) | Groq API key for profile analysis and repo chat |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `DIRECT_URL` | Yes | Direct PostgreSQL URL (for migrations) |

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add all environment variables from `.env.example`.
4. Provision a PostgreSQL database (e.g. [Neon](https://neon.tech) or [Prisma Postgres](https://www.prisma.io/postgres)).
5. Add a **Build Command** override or run migrations separately:

```bash
npx prisma migrate deploy
```

Vercel runs `postinstall` automatically, which generates the Prisma client.

## Project structure

```
src/
├── app/                  # Routes (pages, API, server actions)
├── components/           # UI components
└── lib/                  # GitHub client, stats, AI, notes, Prisma
prisma/
└── schema.prisma         # Note and ChatMessage models
```
