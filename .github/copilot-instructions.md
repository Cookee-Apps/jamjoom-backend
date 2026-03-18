<!-- Copilot instructions for the dr-leo-api repo -->

# Quick Context

This repository is a NestJS server (TypeScript) that uses Prisma as the ORM and Redis/AWS services for integrations. Key folders:

- `src/` — main Nest application organized by feature modules (e.g. `auth/`, `users/`, `zone/`, `routes/`, `business-registrations/`).
- `prisma/` — Prisma schema and migration history. Migrations are committed.
- `uploads/`, `temp/` — local file storage areas; uploads are also pushed to S3 (see `@aws-sdk/client-s3` dependency).
- `utils/`, `config/`, `logger/` — helpers, configuration, and logging (Nest + Winston).

# High-level architecture notes

- Application follows NestJS module/service/controller pattern. Each folder under `src/` is typically a Nest module exposing controllers and services.
- Dependency injection is used across services; prefer adding new functionality as a module with explicit exports/imports in `app.module.ts`.
- Authentication: JWT + Passport (see `src/auth/` and use of `@nestjs/jwt` and `passport-jwt`).
- Persistence: Prisma client (`@prisma/client`) wired from `prisma/` schema. Migrations are applied via `npm run migration:local` (dev) or `npm run migration:prod` (deploy).

# Developer workflows (commands)

- Install: `npm install`
- Develop (hot reload): `npm run start:dev` (uses `nest start --watch`).
- Build: `npm run build` (produces `dist/`).
- Run production build: `npm run start:prod` (runs `node dist/src/main`).
- Prisma migrations (dev): `npm run migration:local` (runs `prisma migrate dev && prisma generate`).
- Prisma generate (if you only want client generation): `npm run migration:generate`.
- Running migrations for production DB: `npm run migration:prod`.
- Tests: Jest is configured in `package.json` but there is no `test` script; run tests with `npx jest` or add a `test` script. Test files follow `*.spec.ts` under `src/`.

# Project-specific conventions and patterns

- Feature modules: folders in `src/` map 1:1 to Nest modules. Keep controllers, services, DTOs, and entities within the feature folder.
- DTOs / validation: uses `class-validator` and `class-transformer`. Use DTO classes for incoming validation and annotate routes with pipes where needed.
- Helpers & shared utilities live in `utils/` (for example `utils/multer.helper.ts` for file uploads, `utils/passwords.service.ts` for password hashing).
- Logging: `nest-winston` + `winston` configured under `logger/`; use the injected logger instead of console.log.
- File uploads: check `utils/multer.helper.ts` and `uploads/` for local disk handling; S3 client usage exists (`@aws-sdk/client-s3`).
- DTO helper & naming: there are repository-wide helpers (e.g. `utils/dto.helper.ts`) — follow these helpers for consistent DTO creation and transformation.

# Integration points & ops

- External services: Redis (via `ioredis`), AWS S3 (`@aws-sdk/client-s3`), Firebase (`firebase-admin`) and email/task integrations via `@nestjs/axios` and queues. Check `src/config/` and `src/firebase/` for environment-driven setup.
- Secrets & env: configuration is centralized with `@nestjs/config` (see `src/config` and `src/config/*.ts`). Avoid hardcoding secrets — follow existing env keys.
- DB migrations: schema is authoritative at `prisma/schema.prisma`. Review migration history in `prisma/migrations/` before creating or rolling back migrations.

# Code examples & locations

- Add a new module: mirror existing modules like `src/zone/` or `src/users/`. Export services in the module file and import the module in `src/app.module.ts`.
- Authentication: see `src/auth/` for guards, strategies, and `AuthModule` wiring.
- Prisma usage pattern: import a shared Prisma service (search for `prismaService` or `PrismaClient` usage) rather than creating ad-hoc clients.

# What to watch for (gotchas)

- Many migrations are committed; do not overwrite migration history — add new migrations using `npm run migration:local` and commit the generated files.
- There is no top-level `test` npm script; CI or dev may expect `npx jest` or an added script. Confirm before updating CI configurations.
- Sensitive config is environment-driven. When running locally, ensure `.env` matches expected keys or use a dev DB/Redis instance.

# When you need help or more context

- Inspect `src/app.module.ts` and `src/main.ts` to understand which modules are loaded and any global pipes/filters/guards applied.
- Review `prisma/schema.prisma` and `prisma/migrations/` for database design and historical schema changes.
- If a new integration is required, follow the pattern from existing modules (e.g. file upload + S3 in `utils/multer.helper.ts` and relevant controllers).

---
If anything in this summary is unclear or you want me to expand a section (migrations, auth, or CI commands), tell me which part and I'll refine it.
