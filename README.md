# chat

This is a chat webapp built using NextJS, Express, and Socket.io

## Requirements

- NodeJS
- Nx (globally installed - optional)

## Installation

Clone the repository

```bash
git clone https://github.com/notlega/chat.git
```

Install dependencies

```bash
npm ci
```

## Usage

If you do not have Nx installed globally, add `npx` before each command

To build each application

```bash
nx run chat-frontend:build:production
nx run chat-backend:build:production
```

To start each application

```bash
nx run chat-frontend:serve:production
nx run chat-backend:serve:production
```

To start both applications in dev mode

```bash
nx run chat-frontend:serve:development
nx run chat-backend:serve:development
```
