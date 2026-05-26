<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">NestJS Starter Base</h1>

<p align="center">
  A production-ready, minimal NestJS boilerplate with best practices baked in.
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="Node Version" /></a>
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-v11-ea2845.svg" alt="NestJS Version" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License" /></a>
</p>

---

## ✨ Features

- ⚡ **NestJS 11** — Latest version with strict TypeScript
- 📖 **Swagger/OpenAPI** — Auto-generated API documentation at `/docs`
- ✅ **Validation** — Global `ValidationPipe` with `class-validator` & `class-transformer`
- 🔢 **API Versioning** — URI-based versioning (`/api/v1/...`)
- 🛡️ **Security** — Helmet, CORS, and security best practices
- 📦 **Compression** — Gzip response compression out of the box
- 🔧 **Config Module** — Environment-based configuration with `.env` support
- 🏥 **Health Check** — Built-in `/api/v1/health` endpoint
- 🧪 **Testing** — Jest pre-configured for unit and e2e tests
- 📁 **Clean Architecture** — Modular, scalable project structure

---

## 📂 Project Structure

```
nestjs-starter-base
├─ .prettierrc
├─ eslint.config.mjs
├─ LICENSE
├─ nest-cli.json
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ app.controller.spec.ts
│  ├─ app.controller.ts
│  ├─ app.module.ts
│  ├─ app.service.ts
│  ├─ health
│  │  ├─ health.controller.ts
│  │  ├─ health.module.ts
│  │  └─ health.service.ts
│  └─ main.ts
├─ test
│  ├─ app.e2e-spec.ts
│  └─ jest-e2e.json
├─ tsconfig.build.json
└─ tsconfig.json

```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/nestjs-starter-base.git
cd nestjs-starter-base

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

# Quick Reference -- All Commands in ORder

# 1. Install CLI

npm i -g @nestjs/cli

# 2. Create project

nest new nestjs-starter-base --strict --skip-git --package-manager npm
cd nestjs-starter-base

# 3. Install packages

npm install class-validator class-transformer @nestjs/config @nestjs/swagger helmet compression
npm install -D @types/compression

# 4. Generate health module

nest generate module health
nest generate controller health --no-spec
nest generate service health --no-spec

# 5. Create env files

cp .env.example .env.local

# 6. Update main.ts, app.module.ts, health.controller.ts (as shown above)

# 7. Test

npm run start:dev
