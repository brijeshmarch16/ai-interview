export type GetStartedInlinePart =
  | { type: "text"; value: string }
  | { type: "inlineCode"; value: string }
  | { type: "link"; label: string; href: string }
  | { type: "strong"; value: string };

export interface GetStartedParagraphBlock {
  type: "paragraph";
  parts: GetStartedInlinePart[];
}

export interface GetStartedCodeBlock {
  type: "code";
  code: string;
}

export interface GetStartedEnvRow {
  variable: string;
  value: GetStartedInlinePart[];
}

export interface GetStartedEnvTableBlock {
  type: "envTable";
  rows: GetStartedEnvRow[];
}

export type GetStartedBlock =
  | GetStartedParagraphBlock
  | GetStartedCodeBlock
  | GetStartedEnvTableBlock;

export interface GetStartedStep {
  title: string;
  blocks: GetStartedBlock[];
}

export interface GetStartedTab {
  id: "locally" | "vercel" | "docker";
  label: string;
  icon: "terminal" | "rocket" | "server";
  steps: GetStartedStep[];
}

export const GET_STARTED_TABS: GetStartedTab[] = [
  {
    id: "locally",
    label: "Locally",
    icon: "terminal",
    steps: [
      {
        title: "Clone & install",
        blocks: [
          {
            type: "code",
            code: "git clone https://github.com/brijeshmarch16/ai-interview.git\ncd ai-interview\npnpm install",
          },
        ],
      },
      {
        title: "Configure environment variables",
        blocks: [
          { type: "code", code: "cp .env.example .env" },
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Open " },
              { type: "inlineCode", value: ".env" },
              { type: "text", value: " and fill in each value:" },
            ],
          },
          {
            type: "envTable",
            rows: [
              {
                variable: "BETTER_AUTH_URL",
                value: [{ type: "inlineCode", value: "http://localhost:3000" }],
              },
              {
                variable: "BETTER_AUTH_SECRET",
                value: [
                  { type: "text", value: "Run " },
                  { type: "inlineCode", value: "openssl rand -base64 32" },
                  { type: "text", value: " and paste the output" },
                ],
              },
              {
                variable: "DATABASE_URL",
                value: [
                  {
                    type: "text",
                    value: "Your Postgres connection string (for example, from ",
                  },
                  { type: "link", label: "Neon", href: "https://neon.tech/" },
                  { type: "text", value: ")" },
                ],
              },
              {
                variable: "RETELL_API_KEY",
                value: [{ type: "text", value: "From the Retell AI dashboard" }],
              },
              {
                variable: "OPENAI_API_KEY",
                value: [{ type: "text", value: "From the OpenAI platform" }],
              },
            ],
          },
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Optionally set " },
              {
                type: "inlineCode",
                value: "NEXT_PUBLIC_MARKETING_ENABLED=true",
              },
              {
                type: "text",
                value: " to enable the marketing landing page.",
              },
            ],
          },
        ],
      },
      {
        title: "Set up the database",
        blocks: [
          { type: "code", code: "pnpm db:migrate && pnpm db:seed" },
          {
            type: "paragraph",
            parts: [
              {
                type: "text",
                value:
                  "This runs migrations and creates the default interviewers needed for the app.",
              },
            ],
          },
        ],
      },
      {
        title: "Start the dev server",
        blocks: [
          { type: "code", code: "pnpm dev" },
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Open " },
              {
                type: "link",
                label: "http://localhost:3000",
                href: "http://localhost:3000",
              },
              { type: "text", value: " — you're good to go." },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "vercel",
    label: "Vercel",
    icon: "rocket",
    steps: [
      {
        title: "Fork & import to Vercel",
        blocks: [
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Fork " },
              {
                type: "link",
                label: "brijeshmarch16/ai-interview",
                href: "https://github.com/brijeshmarch16/ai-interview",
              },
              { type: "text", value: " on GitHub, then go to " },
              {
                type: "link",
                label: "vercel.com",
                href: "https://vercel.com/",
              },
              { type: "text", value: ", click " },
              { type: "strong", value: "Add New Project" },
              { type: "text", value: ", and import your fork." },
            ],
          },
        ],
      },
      {
        title: "Configure database & env variables",
        blocks: [
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "In your Vercel project, go to the " },
              { type: "strong", value: "Storage" },
              { type: "text", value: " tab, click " },
              { type: "strong", value: "Create Database" },
              { type: "text", value: ", and select " },
              { type: "strong", value: "Neon Postgres" },
              { type: "text", value: ". Vercel automatically sets " },
              { type: "inlineCode", value: "DATABASE_URL" },
              { type: "text", value: " for you. Then go to " },
              { type: "strong", value: "Settings → Environment Variables" },
              { type: "text", value: " and add:" },
            ],
          },
          {
            type: "envTable",
            rows: [
              {
                variable: "BETTER_AUTH_URL",
                value: [
                  { type: "text", value: "Your Vercel URL (for example, " },
                  { type: "inlineCode", value: "https://your-app.vercel.app" },
                  { type: "text", value: ")" },
                ],
              },
              {
                variable: "BETTER_AUTH_SECRET",
                value: [
                  { type: "text", value: "Run " },
                  { type: "inlineCode", value: "openssl rand -base64 32" },
                  { type: "text", value: " and paste the output" },
                ],
              },
              {
                variable: "RETELL_API_KEY",
                value: [{ type: "text", value: "From the Retell AI dashboard" }],
              },
              {
                variable: "OPENAI_API_KEY",
                value: [{ type: "text", value: "From the OpenAI platform" }],
              },
            ],
          },
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Optionally set " },
              {
                type: "inlineCode",
                value: "NEXT_PUBLIC_MARKETING_ENABLED=true",
              },
              {
                type: "text",
                value: " to enable the marketing landing page",
              },
            ],
          },
        ],
      },
      {
        title: "Set build command & deploy",
        blocks: [
          {
            type: "code",
            code: "pnpm db:migrate && pnpm db:seed && pnpm build",
          },
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "In " },
              {
                type: "strong",
                value: "Settings → Build & Development Settings",
              },
              { type: "text", value: ", set this as the " },
              { type: "strong", value: "Build Command" },
              {
                type: "text",
                value:
                  ". This runs migrations and seeds on every deploy (the seed script skips if data already exists).",
              },
            ],
          },
        ],
      },
      {
        title: "Go live",
        blocks: [
          {
            type: "paragraph",
            parts: [
              {
                type: "text",
                value: "Trigger a redeployment — your app will be live.",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "docker",
    label: "Docker",
    icon: "server",
    steps: [
      {
        title: "Clone & install",
        blocks: [
          {
            type: "code",
            code: "git clone https://github.com/brijeshmarch16/ai-interview.git\ncd ai-interview\npnpm install",
          },
        ],
      },
      {
        title: "Configure the project",
        blocks: [
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Open " },
              { type: "inlineCode", value: "next.config.js" },
              { type: "text", value: " and uncomment the " },
              { type: "inlineCode", value: 'output: "standalone"' },
              {
                type: "text",
                value: " line so Docker can run the app without ",
              },
              { type: "inlineCode", value: "node_modules" },
              { type: "text", value: ". Then set up your env:" },
            ],
          },
          { type: "code", code: "cp .env.example .env" },
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Open " },
              { type: "inlineCode", value: ".env" },
              { type: "text", value: " and fill in each value:" },
            ],
          },
          {
            type: "envTable",
            rows: [
              {
                variable: "BETTER_AUTH_URL",
                value: [{ type: "inlineCode", value: "http://your-server-ip:3000" }],
              },
              {
                variable: "BETTER_AUTH_SECRET",
                value: [
                  { type: "text", value: "Run " },
                  { type: "inlineCode", value: "openssl rand -base64 32" },
                  { type: "text", value: " and paste the output" },
                ],
              },
              {
                variable: "DATABASE_URL",
                value: [{ type: "text", value: "Your Postgres connection string" }],
              },
              {
                variable: "RETELL_API_KEY",
                value: [{ type: "text", value: "From the Retell AI dashboard" }],
              },
              {
                variable: "OPENAI_API_KEY",
                value: [{ type: "text", value: "From the OpenAI platform" }],
              },
            ],
          },
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Optionally set " },
              {
                type: "inlineCode",
                value: "NEXT_PUBLIC_MARKETING_ENABLED=true",
              },
              {
                type: "text",
                value: " to enable the marketing landing page.",
              },
            ],
          },
        ],
      },
      {
        title: "Set up the database",
        blocks: [
          { type: "code", code: "pnpm db:migrate && pnpm db:seed" },
          {
            type: "paragraph",
            parts: [
              {
                type: "text",
                value:
                  "This runs migrations and creates the default interviewers needed for the app.",
              },
            ],
          },
        ],
      },
      {
        title: "Start the app",
        blocks: [
          { type: "code", code: "docker-compose up --build -d" },
          {
            type: "paragraph",
            parts: [
              { type: "text", value: "Open " },
              { type: "inlineCode", value: "http://your-server-ip:3000" },
              { type: "text", value: " — you're good to go." },
            ],
          },
        ],
      },
    ],
  },
];
