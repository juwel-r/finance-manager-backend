```md
# Bun + TypeScript + Vercel API Starter

A clean backend starter template using:

- ⚡ Bun runtime
- 📘 TypeScript
- 🚀 Vercel deployment
- 🌐 Node-compatible serverless API

This setup avoids common configuration problems when starting a new backend project.

---

# Tech Stack

| Technology   | Purpose                   |
| ------------ | ------------------------- |
| Bun          | Runtime + Package Manager |
| TypeScript   | Type safety               |
| Vercel       | Deployment                |
| Node Adapter | Vercel serverless support |

---

# Project Structure


.
├── src
│ ├── app
│ │ └── config
│ │ └── errorHelpers
│ │ └── interface
│ │ └── middleware
│ │ └── modules
│ │ └── routes
│ │ └── utils
│ │
│ ├── app.ts
│ └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vercel.json
└── README.md

---

# File Responsibilities

## src/app

Main application folder.

Example:

```

src/app/modules

````

Contains:

- routes
- controllers
- services
- middleware
- database logic


---

## src/app.ts

Application configuration.

Example:

```ts
import express from "express";

const app = express();

app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "API Running"
  });
});


export default app;
````

---

## src/server.ts

Vercel entry point.

Example:

```ts
import app from "./app";

export default app;
```

Important:

Do not use:

```ts
app.listen(3000);
```

because Vercel manages the server.

---

# Installation

## Install Bun

[https://bun.sh](https://bun.sh)

Check:

```bash
bun --version
```

---

# Create Project

Install dependencies:

```bash
bun init -y
bun install
```

---

# Development

Run development server:

```bash
bun run dev
```

Script:

```json
"dev": "bun --watch src/server.ts"
```

Bun automatically restarts when files change.

---

# Available Commands

## Development

```bash
bun run dev
```

Start development mode.

---

## Production Start

```bash
bun run start
```

Runs:

```bash
bun src/server.ts
```

---

## Build

```bash
bun run build
```

Build command:

```bash
bun build src/server.ts \
--outdir dist \
--platform=node \
--target=node \
--minify
```

---

## Lint

```bash
bun run lint
```

Runs ESLint.

---

# package.json

Current setup:

```json
{
  "scripts": {
    "dev": "bun --watch src/server.ts",
    "start": "bun src/server.ts",
    "build": "bun build src/server.ts --outdir dist --platform=node --target=node --minify",
    "lint": "bun eslint ./src"
  }
}
```

---

# TypeScript Configuration

File:

```
tsconfig.json
```

```json
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": false,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noPropertyAccessFromIndexSignature": false
  }
}
```

---

# Vercel Configuration

File:

```
vercel.json
```

```json
{
  "version": 2,

  "$schema": "https://openapi.vercel.sh/vercel.json",
  "bunVersion": "1.x",

  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],

  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

---

# Deploy to Vercel

Install Vercel CLI:

```bash
bun add -g vercel
```

Login:

```bash
vercel login
```

Deploy:

```bash
vercel deploy
```

Production:

```bash
vercel --prod
```

---

# Environment Variables must need to add in vercel

Create:

```
.env
```

Example:

```env
PORT=3000

DATABASE_URL=

JWT_SECRET=
```

Add same variables:

```
Vercel Dashboard
      ↓
Project
      ↓
Settings
      ↓
Environment Variables
```

---


# Common Problems

## ❌ Cannot use app.listen()

Wrong:

```ts
app.listen(3000);
```

Correct:

```ts
export default app;
```

---

## ❌ Wrong Vercel builder

Do not use:

```
@vercel/bun
```

Correct:

```json
"use": "@vercel/node"
```

---

## ❌ TypeScript emits files

Keep:

```json
"noEmit": true
"verbatimModuleSyntax":false //for import types without writing "type"
```

