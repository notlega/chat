# chat

This is a chat webapp built using NextJS, Express, and Socket.io

## Requirements

- NodeJS
- Nx (globally installed - optional)

## Installation and Setup

Clone the repository

```bash
git clone https://github.com/notlega/chat.git
```

Install dependencies

```bash
npm ci
```

Copy `.env.example` and rename to `.env.local` in the same directory

Fill in the values for the environment variables

Run the following command to setup prisma

```bash
npm run prisma-setup
```

## Usage

**If you do not have Nx installed globally, add `npx` before each command**

To build both applications in parallel

```bash
npm run build
```

To build each application

```bash
npm run build:frontend
npm run build:backend
```

To start both applications in parallel and production mode

```bash
npm run start
```

To start each application

```bash
npm run start:frontend
npm run start:backend
```

To start both applications in parallel and development mode

```bash
npm run dev
```

To start each application in development mode

```bash
npm run dev:frontend
npm run dev:backend
```
