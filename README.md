[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub Repo Views](https://gitviews.com/repo/brijeshmarch16/ai-interview.svg?label=views&style=flat&label-color=%23555&color=%234c1)

# AI Interview - AI-powered voice interviewer for hiring 💼

AI Interview is an open source platform for companies to conduct AI powered hiring interviews with their candidates.

![AI Interview product demo](public/screenshot.png)

## Key Features

- **🎯 Interview Creation:** Instantly generate tailored interview questions from any job description.
- **🔗 One-Click Sharing:** Generate and share unique interview links with candidates in seconds.
- **🎙️ AI Voice Interviews:** Let our AI conduct natural, conversational interviews that adapt to candidate responses.
- **📊 Smart Analysis:** Get detailed insights and scores for each interview response, powered by advanced AI.
- **📈 Comprehensive Dashboard:** Track all candidate performances and overall stats.

## Initial Setup

1. Clone the project.

```bash
git clone https://github.com/brijeshmarch16/ai-interview.git
cd ai-interview
```

2. Copy the environment template.

```bash
cp .env.example .env
```

## Better Auth Setup ([Better Auth](https://www.better-auth.com/))

Authentication runs locally via Better Auth (email + password). There is no third-party signup required.

1. Generate a session secret and put it in `.env` as `BETTER_AUTH_SECRET`:

```bash
openssl rand -base64 32
```

2. Set `BETTER_AUTH_URL` to your app's base URL (locally `http://localhost:3000`).

## Database Setup (PostgreSQL + Drizzle)

The app uses standard PostgreSQL via the `pg` driver. Any Postgres instance works — a local install or a hosted provider (Railway, Render, Fly, Supabase Postgres, your own VPS).

1. Spin up a PostgreSQL instance and create a database for the app.
2. Put the connection string into `.env`:

```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

3. Push the schema:

```bash
pnpm db:push
```

(Use `pnpm db:generate` + `pnpm db:migrate` if you prefer versioned migrations. `pnpm db:studio` opens Drizzle Studio in your browser. `pnpm db:seed` loads seed data.)

## Retell AI Setup ([Retell AI](https://retellai.com/))

Retell AI manages all the voice calls — recording storage and a simple SDK to integrate with. Free credits to start; pay-as-you-go after.

1. Create an API key in the [Retell AI Dashboard](https://dashboard.retellai.com/apiKey).
2. Add it to `.env` as `RETELL_API_KEY`.

## Add OpenAI API Key

OpenAI is used to generate interview questions and analyze responses. Cost is typically low for normal use.

1. Create an API key at [OpenAI](https://platform.openai.com/api-keys).
2. Add it to `.env` as `OPENAI_API_KEY`.

## Getting Started locally

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Self Hosting

We recommend using [Vercel](https://vercel.com/) to host the app.

## Contributing

If you'd like to contribute to AI Interview, feel free to fork the repository, make your changes, and submit a pull request. Contributions are welcomed and appreciated.

For a detailed guide on contributing, read the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## Show Your Support 🌟

If you find AI Interview helpful, please consider giving the repo a star on GitHub! It helps the project reach more developers.

## License

The software code is licensed under the [MIT License](LICENSE).

## Inspired by FoloUp

This project is inspired by [FoloUp](https://github.com/FoloUp/FoloUp)
