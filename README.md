# propnex

This is a propnex webapp built using NextJS, Express, and Socket.io

## Requirements

- NodeJS
- Nx (globally installed - optional)

## Installation and Setup

Clone the repository

```bash
git clone https://github.com/notlega/propnex.git
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
npm run build:appname
```

To start all applications in parallel and production mode

```bash
npm run start
```

To start each application

```bash
npm run start:appname
```

To start all applications in parallel and development mode

```bash
npm run dev
```

To start each application in development mode

```bash
npm run dev:appname
```
