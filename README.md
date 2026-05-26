```markdown
<div align="center">

<img src="https://nestjs.com/img/logo-small.svg" width="80" alt="NestJS Logo" />

# nestjs-starter-firestore-auth

**Production-ready NestJS boilerplate with Firebase Authentication & Firestore**

[![NestJS](https://img.shields.io/badge/NestJS-v11-ea2845?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin_SDK-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](CONTRIBUTING.md)

[Getting Started](#-getting-started) •
[API Reference](#-api-reference) •
[Architecture](#-architecture) •
[Configuration](#-configuration) •
[Contributing](#-contributing)

</div>

---

## Overview

A **batteries-included**, **strictly typed** NestJS starter that wires up
Firebase Authentication and Firestore out of the box — so you can skip the
boilerplate and ship features from day one.

Every route is protected by a **global Firebase Auth guard** by default.
Public routes are opt-in via a single `@Public()` decorator. Responses are
wrapped in a **consistent envelope**, and errors are caught by a **global
exception filter** — giving your consumers a predictable API surface.

---

## Features
```

```
Authentication
├── Email / Password Register & Login via Firebase REST API
├── Token Refresh without re-login
├── Forgot Password (password reset email)
├── Token Verification endpoint
├── Logout with server-side token revocation
└── Global Firebase Auth Guard (all routes protected by default)

Authorization
├── @Public() → opt-out of auth for specific routes
├── @CurrentUser() → inject decoded Firebase user anywhere
└── Custom claims support via setCustomClaims()

Database
├── Firestore user profiles (auto-created on first login)
├── Find, update, deactivate users
└── Typed Firestore queries with proper error handling

API Quality
├── Consistent { success, data, message, timestamp } response envelope
├── Global exception filter with friendly Firebase error messages
├── URI-based API versioning (/api/v1/...)
├── Full OpenAPI / Swagger documentation at /docs
├── Global ValidationPipe with class-validator & class-transformer
└── Explicit return types on every controller method

Security & Performance
├── Helmet — security headers
├── Compression — gzip responses
├── CORS — configurable allowed origins
└── Strict TypeScript — zero unsafe-any in codebase

```

---

## Architecture

```

nestjs-starter-firestore-auth
├─ .editorconfig
├─ .prettierrc
├─ eslint.config.mjs
├─ LICENSE
├─ nest-cli.json
├─ package.json
├─ README.md
├─ src
│ ├─ app.controller.spec.ts
│ ├─ app.controller.ts
│ ├─ app.module.ts
│ ├─ app.service.ts
│ ├─ auth
│ │ ├─ auth.controller.ts
│ │ ├─ auth.module.ts
│ │ ├─ auth.service.ts
│ │ ├─ decorators
│ │ │ ├─ current-user.decorator.ts
│ │ │ └─ public.decorator.ts
│ │ ├─ dto
│ │ │ ├─ forgot-password.dto.ts
│ │ │ ├─ login.dto.ts
│ │ │ ├─ refresh-token.dto.ts
│ │ │ ├─ register.dto.ts
│ │ │ └─ verify-token.dto.ts
│ │ ├─ guards
│ │ │ ├─ firebase-auth.guard.ts
│ │ │ └─ optional-auth.guard.ts
│ │ ├─ interfaces
│ │ │ ├─ auth-response.interface.ts
│ │ │ └─ firebase-user.interface.ts
│ │ ├─ mappers
│ │ │ └─ firebase-user.mapper.ts
│ │ └─ strategies
│ │ └─ firebase.strategy.ts
│ ├─ common
│ │ ├─ filters
│ │ │ └─ http-exception.filter.ts
│ │ ├─ interceptors
│ │ │ └─ response.interceptor.ts
│ │ └─ interfaces
│ │ └─ api-response.interface.ts
│ ├─ config
│ │ └─ firebase.config.ts
│ ├─ firebase
│ │ ├─ firebase.module.ts
│ │ └─ firebase.service.ts
│ ├─ health
│ │ ├─ health.controller.ts
│ │ ├─ health.module.ts
│ │ └─ health.service.ts
│ ├─ main.ts
│ └─ users
│ ├─ dto
│ │ └─ update-user.dto.ts
│ ├─ interfaces
│ │ └─ user.interface.ts
│ ├─ users.controller.ts
│ ├─ users.module.ts
│ └─ users.service.ts
├─ test
│ ├─ app.e2e-spec.ts
│ └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```

---

## Getting Started

### Prerequisites

| Tool             | Version           |
| ---------------- | ----------------- |
| Node.js          | >= 18             |
| npm              | >= 9              |
| Firebase Project | Firestore enabled |

### 1 — Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/nestjs-starter-firestore-auth.git
cd nestjs-starter-firestore-auth
npm install
```

### 2 — Firebase Setup

#### Generate Admin SDK credentials

1. Open [Firebase Console](https://console.firebase.google.com/) → your project
2. **⚙️ Settings** → **Service Accounts**
3. Click **"Generate new private key"** → download JSON
4. Save it as `firebase-service-account.json` in the project root

> The `firebase-service-account.json` file is already in `.gitignore`.
> **Never commit it.**

#### Enable Email/Password Authentication

1. Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Email/Password**

#### Enable Firestore

1. Firebase Console → **Firestore Database**
2. Click **"Create database"** → choose a region → **Start in test mode**

### 3 — Configure Environment

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your values:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=*

# Path to your downloaded service account JSON
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json

# Web API Key — from Firebase Console → Project Settings → General
FIREBASE_WEB_API_KEY=AIzaSy...
```

### 4 — Run

```bash
# Development (watch mode)
npm run start:dev
```

| Resource     | URL                                 |
| ------------ | ----------------------------------- |
| API Base     | http://localhost:3000/api/v1        |
| Swagger Docs | http://localhost:3000/docs          |
| Health Check | http://localhost:3000/api/v1/health |

---

## API Reference

### Authentication Flow

```
┌─────────────┐        ┌──────────────────┐        ┌──────────────┐
│   Client    │        │   NestJS API     │        │   Firebase   │
└──────┬──────┘        └────────┬─────────┘        └──────┬───────┘
       │                        │                          │
       │  POST /auth/login      │                          │
       │ ──────────────────>    │                          │
       │                        │  signInWithPassword()    │
       │                        │ ──────────────────────>  │
       │                        │ <── idToken + refresh ── │
       │                        │                          │
       │                        │  verifyIdToken()         │
       │                        │ ──────────────────────>  │
       │                        │ <── DecodedToken ──────  │
       │                        │                          │
       │  { user, idToken,      │                          │
       │    refreshToken }      │                          │
       │ <──────────────────    │                          │
       │                        │                          │
       │  GET /users/profile    │                          │
       │  Bearer: <idToken>     │                          │
       │ ──────────────────>    │                          │
       │                        │  verifyIdToken()         │
       │                        │ ──────────────────────>  │
       │                        │ <── valid ─────────────  │
       │  { user profile }      │                          │
       │ <──────────────────    │                          │
```

### Endpoints

#### Auth — Public

| Method | Endpoint                       | Description                             |
| ------ | ------------------------------ | --------------------------------------- |
| `POST` | `/api/v1/auth/register`        | Create account with email & password    |
| `POST` | `/api/v1/auth/login`           | Login and receive tokens                |
| `POST` | `/api/v1/auth/refresh`         | Exchange refresh token for new ID token |
| `POST` | `/api/v1/auth/forgot-password` | Send password reset email               |
| `POST` | `/api/v1/auth/verify`          | Verify a raw Firebase ID token          |

#### Auth — Protected

| Method | Endpoint              | Description                   |
| ------ | --------------------- | ----------------------------- |
| `GET`  | `/api/v1/auth/me`     | Get current user from token   |
| `POST` | `/api/v1/auth/logout` | Revoke all tokens server-side |

#### Users — Protected

| Method   | Endpoint                | Description                          |
| -------- | ----------------------- | ------------------------------------ |
| `GET`    | `/api/v1/users/profile` | Get or auto-create Firestore profile |
| `GET`    | `/api/v1/users`         | List all active users                |
| `GET`    | `/api/v1/users/:uid`    | Get user by UID                      |
| `PATCH`  | `/api/v1/users/:uid`    | Update user fields                   |
| `DELETE` | `/api/v1/users/:uid`    | Deactivate user (soft delete)        |

#### System

| Method | Endpoint         | Auth      | Description               |
| ------ | ---------------- | --------- | ------------------------- |
| `GET`  | `/api/v1/health` | ❌ Public | Uptime & environment info |

---

### Request & Response Examples

#### Register

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "displayName": "John Doe"
  }'
```

```json
{
  "success": true,
  "data": {
    "user": {
      "uid": "abc123xyz",
      "email": "john@example.com",
      "emailVerified": false,
      "displayName": "John Doe",
      "photoURL": "",
      "phoneNumber": "",
      "disabled": false,
      "provider": "password"
    },
    "idToken": "eyJhbGci...",
    "refreshToken": "AMf-vBxW...",
    "expiresIn": "3600"
  },
  "message": "Request successful",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

#### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Refresh Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "AMf-vBxW..."
  }'
```

#### Protected Route

```bash
curl http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGci..."
```

#### Error Response

```json
{
  "success": false,
  "data": null,
  "message": "Invalid email or password",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

## Configuration

### Environment Variables

| Variable                        | Required    | Default       | Description                  |
| ------------------------------- | ----------- | ------------- | ---------------------------- |
| `NODE_ENV`                      | No          | `development` | `development` / `production` |
| `PORT`                          | No          | `3000`        | HTTP server port             |
| `CORS_ORIGIN`                   | No          | `*`           | Allowed CORS origins         |
| `FIREBASE_SERVICE_ACCOUNT_PATH` | Option A ✅ | —             | Path to service account JSON |
| `FIREBASE_PROJECT_ID`           | Option B    | —             | Firebase project ID          |
| `FIREBASE_CLIENT_EMAIL`         | Option B    | —             | Service account email        |
| `FIREBASE_PRIVATE_KEY`          | Option B    | —             | Service account private key  |
| `FIREBASE_WEB_API_KEY`          | ✅ Always   | —             | Firebase Web API Key         |

> **Option A** (JSON file) is recommended for local development.
> **Option B** (individual variables) is recommended for CI/CD and cloud deployments.

### Credential Setup Options

#### Option A — Service Account JSON File (Local Dev)

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
FIREBASE_WEB_API_KEY=AIzaSy...
```

#### Option B — Environment Variables (Production / CI)

```env
FIREBASE_PROJECT_ID=my-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@my-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
FIREBASE_WEB_API_KEY=AIzaSy...
```

---

## Key Concepts

### Global Auth Guard

Every route is protected by default. No configuration needed.

```typescript
// This route requires a valid Firebase ID token
@Get('secret')
getSecret() {
  return { data: 'protected' };
}
```

### Making a Route Public

```typescript
import { Public } from '../auth/decorators/public.decorator';

@Get('public-info')
@Public()
getPublicInfo() {
  return { data: 'anyone can see this' };
}
```

### Accessing the Current User

```typescript
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FirebaseUser } from '../auth/interfaces/firebase-user.interface';

@Get('my-data')
getMyData(@CurrentUser() user: FirebaseUser) {
  console.log(user.uid, user.email);
  return this.myService.findByUid(user.uid);
}
```

### Token Lifecycle

```
Login / Register
      │
      ▼
  idToken  ──── valid for 1 hour ────► use for all API calls
      │
  refreshToken ── never expires* ────► POST /auth/refresh → new idToken
      │
  Logout
      │
      ▼
  revokeRefreshTokens() ─────────────► all tokens invalidated server-side
```

> \*Refresh tokens are long-lived but can be revoked via logout or from the Firebase Console.

---

## Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov

# End-to-end tests
npm run test:e2e
```

---

## Scripts

```bash
npm run start:dev     # Development with hot reload
npm run start:debug   # Debug mode
npm run build         # Compile to /dist
npm run start:prod    # Run compiled build
npm run lint          # ESLint check
npm run lint:fix      # ESLint auto-fix
npm run format        # Prettier format
npm run test          # Jest unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

---

## Related Starters

This repo is part of the **NestJS Starters** collection.

| Starter                                                                     | Description                        | Status          |
| --------------------------------------------------------------------------- | ---------------------------------- | --------------- |
| [nestjs-starter-base](https://github.com/YOUR_USERNAME/nestjs-starter-base) | Clean NestJS boilerplate           | ✅ Available    |
| **nestjs-starter-firestore-auth**                                           | NestJS + Firebase Auth + Firestore | ✅ You are here |
| nestjs-starter-jwt-auth                                                     | NestJS + JWT + Passport            | 🔜 Coming Soon  |
| nestjs-starter-prisma                                                       | NestJS + Prisma ORM                | 🔜 Coming Soon  |
| nestjs-starter-graphql                                                      | NestJS + GraphQL Code-First        | 🔜 Coming Soon  |

---

## Contributing

Contributions are welcome!

```bash
# 1. Fork the repo
# 2. Create your branch
git checkout -b feature/your-feature

# 3. Make changes and commit
git commit -m "feat: add your feature"

# 4. Push and open a PR
git push origin feature/your-feature
```

Please make sure `npm run lint` and `npm run build` pass before opening a PR.

---

## License

This project is [MIT](LICENSE) licensed.

---

<div align="center">

Built with ❤️ using [NestJS](https://nestjs.com/) + [Firebase](https://firebase.google.com/)

⭐ Star this repo if it helped you!

</div>
```
