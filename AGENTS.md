# Agent Instructions for jamjoom-backend

## Project Overview

This is a NestJS (TypeScript) backend server using Prisma ORM, Redis caching, and AWS S3 for file storage. The codebase follows NestJS module patterns with feature-based organization.

---

## Build, Lint, and Test Commands

### Build

```bash
npm run build          # Compile TypeScript to dist/ (uses nest build)
```

### Development

```bash
npm run start:dev      # Hot reload dev server (nest start --watch)
npm run start:debug    # Debug mode with hot reload
```

### Production

```bash
npm run start:prod     # node dist/src/main
```

### Lint & Format

```bash
npx eslint .           # Run ESLint on entire project
npx prettier --check . # Check formatting
npx prettier --write . # Auto-fix formatting
```

### Test

```bash
npx jest                        # Run all tests (finds *.spec.ts in src/)
npx jest path/to/file.spec.ts   # Run single test file
npx jest --watch                # Watch mode
npx jest --coverage             # With coverage report
```

### Database Migrations (Prisma)

```bash
npm run migration:local       # prisma migrate dev && prisma generate (dev)
npm run migration:generate    # prisma generate (client only)
npm run migration:prod        # prisma migrate deploy && prisma generate (prod)
```

---

## Code Style Guidelines

### TypeScript Configuration

- Uses `strictNullChecks: true` but `noImplicitAny: false`
- Decorator metadata enabled for dependency injection
- Target: ES2023, Module: CommonJS

### Imports

**Order (follow this pattern):**

1. Node built-ins (e.g., `fs`, `path`)
2. External packages (`@nestjs/*`, `class-validator`)
3. Internal absolute imports (`src/`, `utils/`)
4. Relative imports (`../`, `./`)

**Examples:**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BannerRepository } from '../repositories/banner.repository';
import { CreateBannerDto } from '../dto/banner.dto';
```

### Naming Conventions

| Element   | Convention  | Example                                       |
| --------- | ----------- | --------------------------------------------- |
| Files     | kebab-case  | `banner-admin.controller.ts`                  |
| Classes   | PascalCase  | `BannerAdminController`                       |
| Methods   | camelCase   | `createBanner`, `findAdminBanners`            |
| DTOs      | PascalCase  | `CreateBannerDto`, `GetAllBannersResponseDTO` |
| Variables | camelCase   | `storeId`, `imgEn`                            |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT`                             |
| Enums     | PascalCase  | `UserRole` (members: UPPER_SNAKE)             |

### Module Structure

Each feature module follows this structure:

```
src/feature/
├── feature.module.ts
├── controllers/
│   ├── feature.admin.controller.ts
│   ├── feature.customer.controller.ts
│   └── feature.store.controller.ts
├── services/
│   └── feature.service.ts
├── dto/
│   └── feature.dto.ts
└── repositories/
    └── feature.repository.ts
```

### DTO Patterns

- Use `class-validator` decorators for validation
- Use `@ApiProperty()` for Swagger documentation
- Separate DTOs: `Create*Dto`, `Update*Dto`, `*ParamsDto`, `*ResponseDTO`
- Use Prisma types via `@prisma/client`

```typescript
export class CreateBannerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @ApiProperty()
  @IsOptional()
  active?: boolean;
}
```

### Error Handling

- Use NestJS built-in exceptions (`NotFoundException`, `BadRequestException`, etc.)
- Services throw exceptions; controllers delegate to service layer
- Shared exception filters in `utils/exception-filters/`

```typescript
async updateBanner(dto: UpdateBannerDto) {
    const banner = await this.bannerRepo.findOne({ id: dto.id });
    if (!banner) throw new NotFoundException('Banner not found');
    return await this.bannerRepo.update(dto.id, data);
}
```

### Logging

- Use injected Logger via `nest-winston` (in `utils/logger/`)
- Avoid `console.log` in production code

### Authentication

- JWT + Passport via `@nestjs/jwt` and `passport-jwt`
- Use `@ProtectRoute()` decorator with role guards
- See `src/auth/` for existing patterns

### API Documentation

- Use `@nestjs/swagger` decorators
- Use custom `@SwaggerAdmin()`, `@SwaggerCustomer()`, `@SwaggerStore()` decorators from `utils/decorators/SwaggerDoc`

### File Uploads

- Use `utils/multer.helper.ts` with `@ReceiveFiles()` and `@FileField()` decorators
- Files are stored locally in `uploads/` and synced to S3

### Repository Pattern

- Feature modules use dedicated repositories (`*Repository`)
- Extend shared Prisma service from `utils/db/`

### Configuration

- Use `@nestjs/config` with `ConfigModule.forRoot({ isGlobal: true })`
- Environment variables centralized in `src/config/`
- Avoid hardcoding secrets; use env vars following existing patterns

---

## Additional Patterns

### Prisma

- Schema is in `prisma/schema.prisma`
- Migrations are committed to the repo
- Always run `npm run migration:local` after schema changes
- Do NOT overwrite migration history

### Caching

- Redis caching via `@nestjs/cache-manager` and `ioredis`
- See `utils/cache/` for caching patterns

### External Services

- AWS S3: `@aws-sdk/client-s3`
- Firebase: `firebase-admin`
- HTTP calls: `@nestjs/axios`

### Internationalization (i18n)

Modules that display content to users (e.g., banners, categories, notifications) must support English and Malayalam. Use `En`/`Ml` suffixes for text fields:

| Field Type      | Suffix | Example                              |
| --------------- | ------ | ------------------------------------ |
| English text    | `En`   | `titleEn`, `nameEn`, `descriptionEn` |
| Malayalam text  | `Ml`   | `titleMl`, `nameMl`, `descriptionMl` |
| English media   | `En`   | `imgEn`, `videoEn`                   |
| Malayalam media | `Ml`   | `imgMl`, `videoMl`                   |

- DTOs must include both language variants
- Prisma schema must have corresponding columns
- API examples should show English and Malayalam examples

---

## Quick Reference for Adding New Features

1. Create module folder under `src/`
2. Add module to `src/app.module.ts`
3. Create controller(s) with appropriate naming: `*.admin.controller.ts`, `*.customer.controller.ts`
4. Create service(s)
5. Create DTOs with validation decorators
6. Create repository if needed
7. Export from module file
8. Add routes to app.module.ts imports

Example controller method:

```typescript
@ProtectRoute(['ADMIN'])
@Post('/create')
async create(@Body() dto: CreateDto) {
    return await this.myService.create(dto);
}
```
