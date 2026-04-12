# Contributing

Thanks for contributing to AI Interview!

## Development

### Fork this repo

Click the fork button on GitHub, then clone locally:

```bash
git clone https://github.com/brijeshmarch16/ai-interview.git
cd ai-interview
```

### Configure environment

```bash
cp .env.example .env
```

Set the following in `.env`:

| Variable | Description |
|---|---|
| `BETTER_AUTH_URL` | `http://localhost:3000` |
| `BETTER_AUTH_SECRET` | Run `openssl rand -base64 32` |
| `DATABASE_URL` | Postgres connection string |
| `RETELL_API_KEY` | From Retell AI dashboard |
| `OPENAI_API_KEY` | From OpenAI dashboard |
| `NEXT_PUBLIC_MARKETING_ENABLED` | `true` to enable marketing features |

### Install dependencies

```bash
pnpm install
```

### Set up database

```bash
pnpm db:migrate && pnpm db:seed
```

### Start the app

```bash
pnpm dev
```

Open http://localhost:3000.

### Useful commands

```bash
pnpm lint          # lint with Biome
pnpm check         # lint + format
pnpm db:generate   # generate migrations from schema changes
pnpm db:migrate    # run migrations
pnpm db:studio     # open Drizzle Studio
```

Found a bug? [Open an issue](https://github.com/brijeshmarch16/ai-interview/issues). Want a new feature? [Start a discussion](https://github.com/brijeshmarch16/ai-interview/issues) first.
