# CDIMS — Software Quality Analysis & Professional Recommendations

> **Project:** Catholic Diocese Infrastructure Management System  
> **Analysis Date:** June 2026  
> **Purpose:** Identify gaps and provide actionable recommendations to make the software professional, clean, testable, and maintainable.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Database Import Guide — .sql into MySQL on VPS](#2-database-import-guide--sql-into-mysql-on-vps)
3. [Project Structure Recommendations](#3-project-structure-recommendations)
4. [Backend Code Quality](#4-backend-code-quality)
5. [Frontend Code Quality](#5-frontend-code-quality)
6. [Testing Strategy](#6-testing-strategy)
7. [DevOps & CI/CD](#7-devops--cicd)
8. [Security Hardening](#8-security-hardening)
9. [Documentation](#9-documentation)
10. [Monitoring & Observability](#10-monitoring--observability)
11. [Priority Action Plan](#11-priority-action-plan)

---

## 1. Executive Summary

The CDIMS project has a **solid foundation**: RESTful API design, Sequelize ORM with migrations, JWT authentication, role-based authorization, Swagger documentation, and a modern React + TypeScript + Vite frontend. However, it falls short of production-grade professionalism in several critical areas.

### Key Strengths ✓
- Clean MVC-like architecture (models, controllers, routes, services)
- Comprehensive Swagger/OpenAPI documentation on routes
- Input validation middleware (express-validator)
- Audit logging service
- Role-based access control
- Database migrations and seeders
- Modern frontend toolchain (Vite, TypeScript, Tailwind CSS, ESLint)

### Critical Gaps ✗
| Area | Status |
|------|--------|
| Automated tests | **Zero tests exist** (no `*.test.*` or `*.spec.*` files anywhere) |
| Error handling consistency | Mixed — some controllers use try/catch, others don't |
| Environment security | `config/config.json` contains **plaintext production credentials** |
| Code duplication | Massive duplication in SWAGGER comments across routes |
| Backend language | JavaScript (not TypeScript) — no type safety |
| CI/CD pipeline | None |
| Docker / containerization | None |
| `.env` files | Not gitignored properly, hardcoded fallbacks |
| Linting (backend) | No ESLint/Prettier config for backend |
| Code formatting | Mixed conventions (spaces vs tabs, semicolons inconsistently) |
| Dead/redundant files | `materials_fixed.js` route duplicates `materials.js` |
| Architectural layering | Business logic mixed into controllers |

---

## 2. Database Import Guide — .sql into MySQL on VPS

### 2.1 Prerequisites

```bash
# SSH into your VPS
ssh user@your-vps-ip

# Verify MySQL is running
sudo systemctl status mysql

# If not running:
sudo systemctl start mysql
```

### 2.2 Upload Your .sql File to the VPS

**Option A — Using SCP from your local machine:**
```bash
# From your local terminal (not in SSH)
scp /path/to/your/database.sql user@your-vps-ip:/tmp/database.sql
```

**Option B — Using rsync:**
```bash
rsync -avz /path/to/your/database.sql user@your-vps-ip:/tmp/database.sql
```

**Option C — If the file is on GitHub or a URL:**
```bash
# Inside your VPS SSH session
wget -O /tmp/database.sql https://example.com/path/to/database.sql
# OR
curl -o /tmp/database.sql https://example.com/path/to/database.sql
```

### 2.3 Import the Database

#### Step 1: Create the database (if it doesn't exist)
```bash
sudo mysql -u root -p
```

```sql
CREATE DATABASE cdims CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'cdims_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON cdims.* TO 'cdims_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Step 2: Import the .sql file

**Standard import:**
```bash
sudo mysql -u root -p cdims < /tmp/database.sql
```

**Using a specific user:**
```bash
mysql -u cdims_user -p cdims < /tmp/database.sql
```

**If the file is large (use pv to show progress):**
```bash
# Install pv first
sudo apt install pv -y

# Import with progress bar
pv /tmp/database.sql | mysql -u cdims_user -p cdims
```

### 2.4 Verification

```bash
# Login to MySQL
mysql -u cdims_user -p cdims

# Check tables
SHOW TABLES;

# Check row counts
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM materials;

# Check a sample
SELECT * FROM users LIMIT 5;

EXIT;
```

### 2.5 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| `ERROR 1045 (28000): Access denied` | Double-check username/password; ensure user has access from `localhost` |
| `ERROR 1115 (42000): Unknown character set` | Open the .sql file and replace `utf8mb4_0900_ai_ci` with `utf8mb4_unicode_ci` |
| `ERROR 2006 (HY000): MySQL server has gone away` | Increase `max_allowed_packet`: `sudo nano /etc/mysql/my.cnf` → add `max_allowed_packet=1024M` → `sudo systemctl restart mysql` |
| `ERROR 1418 (HY000): This function has none of DETERMINISTIC...` | Run `SET GLOBAL log_bin_trust_function_creators = 1;` before importing |
| File is too large for default upload | Use SCP/rsync instead of uploading through web panel |
| Timeout during import | Use `mysql --connect-timeout=300 -u user -p db < file.sql` |

### 2.6 One-Liner Import (All Steps)

```bash
# Upload + create DB + import in one go (on the VPS)
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS cdims CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p cdims < /tmp/database.sql
echo "Import complete. Verify:"
mysql -u root -p -e "USE cdims; SHOW TABLES; SELECT COUNT(*) as total_users FROM users;"
```

---

## 3. Project Structure Recommendations

### Current Structure Issues

```
backend/
  config/config.json    ← Contains plaintext passwords (SECURITY RISK!)
  src/
    routes/
      materials.js      ← Has code
      materials_fixed.js ← DUPLICATE — should be removed
```

### Recommended Structure

```
cdims/
├── backend/
│   ├── src/
│   │   ├── config/           # env-based config only
│   │   ├── controllers/      # Thin controllers -> call services
│   │   ├── services/         # Business logic layer
│   │   ├── repositories/     # Data access layer (NEW)
│   │   ├── middleware/       # Auth, validation, error handling
│   │   ├── routes/           # Route definitions only (remove Swagger to separate docs)
│   │   ├── validators/       # Request validation schemas (NEW)
│   │   ├── utils/            # Helpers
│   │   └── types/            # Shared JSDoc types (NEW)
│   ├── tests/                # (NEW) — all test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── fixtures/
│   ├── migrations/
│   ├── seeders/
│   ├── docs/                 # Swagger specs separate from code (NEW)
│   ├── Dockerfile            # (NEW)
│   ├── .env.example
│   ├── .eslintrc.js          # (NEW)
│   ├── .prettierrc           # (NEW)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance + interceptors
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Route-level page components
│   │   ├── hooks/            # Custom React hooks (NEW)
│   │   ├── services/         # API service layer
│   │   ├── types/            # TypeScript interfaces
│   │   ├── utils/            # Helper functions
│   │   ├── context/          # React contexts
│   │   └── __tests__/        # (NEW)
│   ├── Dockerfile            # (NEW)
│   ├── .env.example
│   └── package.json
├── docker-compose.yml         # (NEW)
├── .editorconfig
├── .gitignore
├── .prettierrc
├── CONTRIBUTING.md
└── SOFTWARE_QUALITY_RECOMMENDATIONS.md
```

### Immediate Fixes

1. **Remove `backend/config/config.json` from version control** — Replace with environment variables only
2. **Delete `materials_fixed.js`** — Dead code that will confuse developers
3. **Add `.env.example` files** for both backend and frontend (backend has one already — good)
4. **Move db config to environment variables** — Never check credentials into Git

---

## 4. Backend Code Quality

### 4.1 Current Problems Found

#### 🔴 Critical: Plaintext Credentials in Config
**File:** `backend/config/config.json`
```json
{
  "production": {
    "password": "password@123",
    "database": "cdims"
  }
}
```
**Fix:** Remove this file from Git. Add to `.gitignore`. Use environment variables only.

#### 🟡 Medium: No TypeScript — Use JSDoc as a Bridge
The backend uses plain JavaScript with no type checking. **Recommendation:** If a full migration to TypeScript is too costly, add JSDoc type annotations and enable `// @ts-check` in key files.

#### 🟡 Medium: Try/Catch Everywhere — No Centralized Async Error Handling
Currently, every controller function wraps its logic in a try/catch that returns `500`. This is verbose and error-prone.

**Fix:** Use an `asyncHandler` wrapper (already defined in `errorHandler.js` but not consistently used).

```javascript
// Instead of:
const getMaterialById = async (req, res) => {
  try { /* ... */ } catch (error) { res.status(500).json(...) }
}

// Use:
const getMaterialById = asyncHandler(async (req, res) => {
  const material = await Material.findByPk(req.params.id);
  if (!material) throw new NotFoundError('Material');
  res.json({ success: true, data: { material } });
});
```

#### 🟢 Low: Duplicate Swagger Comments
Every route file has verbose JSDoc @swagger blocks that duplicate route logic. The OpenAPI spec file (`config/swagger.js`) already pulls from these, but the comments are copy-pasted with minor changes.

**Recommended:** Move to a dedicated `docs/openapi.yaml` file and use `swagger-jsdoc` only for JSDoc inline annotations on the handler functions themselves, not on route definitions.

#### 🟡 Medium: Service Layer Underutilized
`services/` only has 3 files: `auditService.js`, `databaseService.js`, `exportService.js`. All business logic lives directly in controllers.

**Fix:** Extract business logic into services. Controllers should only:
1. Extract request parameters
2. Call a service method
3. Send the response

#### 🟡 Medium: `pg` and `pg-hstore` Dependencies Unused
`backend/package.json` includes `pg` and `pg-hstore` (PostgreSQL drivers) but the project uses MySQL. These are dead dependencies.

#### 🟢 Low: Commented-Out Rate Limiting
`app.js` has a large block of rate-limiting code commented out. Either enable it or remove it.

### 4.2 Backend Checklist for Professional Quality

- [ ] Remove `config/config.json` from Git
- [ ] Delete `materials_fixed.js`
- [ ] Remove unused dependencies (`pg`, `pg-hstore`, `express-mongo-sanitize`, `xss-clean`, `hpp`)
- [ ] Add ESLint + Prettier + configure with Airbnb or Standard style guide
- [ ] Use `asyncHandler` consistently across all controllers
- [ ] Extract business logic from controllers into services
- [ ] Add request validation at the route level using the existing `validation.js` middleware
- [ ] Enable and configure rate limiting in production
- [ ] Enable Helmet CSP properly (currently partially commented)
- [ ] Add proper CORS configuration — use env variables for allowed origins
- [ ] Add health check that also tests database connectivity
- [ ] Create a proper startup script that waits for DB before listening

---

## 5. Frontend Code Quality

### 5.1 Current Problems Found

#### 🟡 Medium: Inconsistent API Response Handling
Services like `userService.ts` manually read `response.data.data` with varying nesting logic. The response from the backend is consistently `{ success, data, message }`, but frontend services handle it differently each time.

**Fix:** Standardize with a response interceptor in `api.ts`:
```typescript
api.interceptors.response.use(
  (response) => response.data.data, // unwrap automatically
  (error) => { /* handle errors globally */ }
);
```

#### 🟡 Medium: Auth Token Duplication
Every service file reads `localStorage.getItem('auth_token')` and sets the Authorization header manually. The axios interceptor in `api.ts` already does this! This means the services are redundantly duplicating the header.

**Fix:** Remove manual header setting from all service files. The interceptor handles it.

#### 🟡 Medium: Dead/Orphaned Components
The `src/store/Blogs.ts` file is a standalone store, but the project doesn't use any state management library. There are also test artifacts like `jhfsfjs.tsx` and placeholder modals like `src/components/Role/DeleteClientModal.tsx` that are clearly wrong (Role → Client rename artifact).

#### 🟢 Low: Model Mismatch
`frontend/src/types/model.ts` defines `Client` interface but the backend has no "Client" entity. The app seems to have been partially repurposed. There are leftover "Client" references in the frontend that should be reconciled with backend models.

#### 🟡 Medium: Missing Index Exports
Import paths in pages are long and inconsistent. Add barrel exports (`index.ts`) for each module directory.

### 5.2 Frontend Checklist for Professional Quality

- [ ] Remove manual `Authorization` headers from all service files (interceptor already does it)
- [ ] Add a response interceptor for consistent data unwrapping
- [ ] Add global error toast/notification via interceptors
- [ ] Clean up dead components (`jhfsfjs.tsx`, Role `DeleteClientModal.tsx`)
- [ ] Reconcile type definitions with actual API responses
- [ ] Add barrel exports (`index.ts`) for cleaner imports
- [ ] Add unit tests (Vitest + React Testing Library)
- [ ] Add `tsconfig` path aliases for shorter imports (`@api/`, `@components/`, etc.)
- [ ] Fix the `User` interface — `id` should be `number` not `string` (backend uses integers)
- [ ] Add proper loading states and error boundaries
- [ ] Enable strict TypeScript mode in `tsconfig.json`

---

## 6. Testing Strategy

### Current State: **Zero Tests** ❌

This is the single biggest quality gap. Without tests, you cannot refactor with confidence, and every deployment is risky.

### Recommended Test Stack

| Layer | Tool | Target |
|-------|------|--------|
| **Backend Unit Tests** | Jest + Supertest | Services, utilities, middleware |
| **Backend Integration Tests** | Jest + Supertest + Test DB | API endpoints (requests, auth, CRUD) |
| **Frontend Unit Tests** | Vitest + React Testing Library | Components, hooks, services |
| **Frontend E2E** | Playwright or Cypress | Critical user flows (login → create request → approve) |
| **API Contract Tests** | Supertest + Jest | Validate request/response shapes |

### Minimum Viable Test Suite

Create these test files as a starting point:

```
backend/tests/
├── unit/
│   ├── services/auditService.test.js
│   ├── middleware/auth.test.js
│   ├── middleware/validation.test.js
│   └── utils/helpers.test.js
├── integration/
│   ├── auth.test.js           # Login, logout, profile
│   ├── materials.test.js      # CRUD operations
│   ├── requests.test.js       # Request workflow
│   └── stock.test.js          # Stock management
└── fixtures/
    ├── users.js
    └── materials.js

frontend/src/__tests__/
├── components/                # Component rendering tests
├── services/                  # Service mocking tests
└── utils/dateUtils.test.ts    # Utility tests
```

### Example Backend Test (Jest + Supertest)

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');

describe('POST /api/auth/login', () => {
  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@cdims.rw', password: 'admin123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user.role.name).toBe('ADMIN');
  });

  it('should reject invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@cdims.rw', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@cdims.rw' });

    expect(res.status).toBe(400);
  });
});
```

### Setting Up Test Database

Add a test npm script:
```json
{
  "scripts": {
    "test": "NODE_ENV=test jest --forceExit --detectOpenHandles",
    "test:watch": "NODE_ENV=test jest --watch",
    "test:coverage": "NODE_ENV=test jest --coverage"
  }
}
```

Create a test config that uses a separate database:
```javascript
// config/test.js
module.exports = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: 'cdims_test',
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false
};
```

---

## 7. DevOps & CI/CD

### Current State: **Nothing** ❌

No Docker, no CI/CD pipeline, no automated deployments.

### 7.1 Docker Setup

Create a `docker-compose.yml` at the project root:

```yaml
version: '3.8'

services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: cdims
      MYSQL_USER: cdims_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 5s
      retries: 10

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DB_HOST: db
      DB_USER: cdims_user
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: cdims
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
  uploads:
```

### 7.2 Dockerfile for Backend

```dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run migrate && npm run seed

EXPOSE 3000

CMD ["node", "src/app.js"]
```

### 7.3 Dockerfile for Frontend (Nginx)

```dockerfile
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 7.4 CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: cd backend && npm ci && npm run lint
      - run: cd frontend && npm ci && npm run lint

  test-backend:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: test
          MYSQL_DATABASE: cdims_test
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd backend && npm ci
      - run: cd backend && npm run migrate
      - run: cd backend && npm run seed
      - run: cd backend && npm test
        env:
          DB_HOST: localhost
          DB_USER: root
          DB_PASSWORD: test
          DB_NAME: cdims_test
          JWT_SECRET: test-secret

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd frontend && npm ci
      - run: cd frontend && npm test -- --run
      - run: cd frontend && npm run build

  deploy:
    needs: [lint, test-backend, test-frontend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/cdims
            git pull origin main
            cd backend && npm ci && npm run migrate
            pm2 restart cdims-backend
            cd ../frontend && npm ci && npm run build
```

---

## 8. Security Hardening

### Immediate Fixes (Critical)

| Issue | Severity | Fix |
|-------|----------|-----|
| DB credentials in `config.json` | 🔴 Critical | Remove from Git; use env vars only |
| `xss-clean` deprecated | 🟡 Medium | Replace with `xss-filters` or DOMPurify |
| `express-mongo-sanitize` unused (MySQL project) | 🟢 Low | Remove — not applicable |
| Hardcoded JWT secret in env.example | 🟡 Medium | Rotate; always use a strong random secret |
| CORS origins hardcoded in app.js | 🟡 Medium | Read from env var `CORS_ORIGINS` as comma-separated list |
| No CSRF protection | 🟡 Medium | Add `csurf` or `csrf-csrf` middleware |
| Password stored as `password_hash` column but set as plaintext | 🔴 Critical | Ensure bcrypt hashing is always applied before save |

### Additional Security Measures

- [ ] Add helmet.js properly with CSP headers
- [ ] Enable and configure rate limiting (currently commented out)
- [ ] Add request size limiting
- [ ] Implement account lockout after N failed login attempts
- [ ] Add audit logging for all sensitive operations (already partially done)
- [ ] Sanitize all user inputs (already partially done with express-validator)
- [ ] Add security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- [ ] Set `httpOnly` and `secure` flags on cookies if used
- [ ] Add an API key for external integrations
- [ ] Add proper CORS — restrict to specific origins in production

---

## 9. Documentation

### Current State
- `README.md` — ✅ Good, covers setup, features, API endpoints
- `API_DOCUMENTATION.md` — ✅ Exists (at backend level)
- `PROJECT_DOCUMENTATION.md` — ✅ Comprehensive
- Swagger UI at `/api-docs` — ✅ Excellent

### What's Missing

| Document | Why You Need It |
|----------|-----------------|
| `CONTRIBUTING.md` | So other developers know how to contribute, code conventions, PR process |
| `CHANGELOG.md` | Track releases and breaking changes |
| `SECURITY.md` | How to report vulnerabilities |
| `CODE_OF_CONDUCT.md` | Standard for any open/collaborative project |
| Architecture Decision Records (ADRs) | Document key technical decisions and why they were made |

### Documentation Improvements

1. **Add inline code documentation** — Use JSDoc for all exported functions
2. **Add `typedoc` or documentation generation** — Auto-generate API docs from types
3. **Add database ERD diagram** — Visualize the schema relationships
4. **Add user role decision tree** — Document who can do what

---

## 10. Monitoring & Observability

### What to Add

| Tool | Purpose |
|------|---------|
| **Winston or Pino** | Structured logging (replacing `console.log`) |
| **Sentry** | Error tracking and performance monitoring |
| **PM2 metrics** | Built-in monitoring via `pm2 monit` |
| **Database query logging** | Log slow queries for optimization |
| **Application health endpoint** | `/api/health` with DB connectivity check |
| **Prometheus metrics** | `/metrics` endpoint for advanced monitoring |

### Logging Improvement

Replace `console.log` with a structured logger:

```javascript
// src/config/logger.js
const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
    err: pino.stdSerializers.err,
  },
});

module.exports = logger;
```

---

## 11. Priority Action Plan

### Phase 1 — Security & Hygiene (Week 1)
| Priority | Task | Effort |
|----------|------|--------|
| 🔴 P0 | Remove `config/config.json` from Git; add to `.gitignore` | 5 min |
| 🔴 P0 | Delete `materials_fixed.js` duplicate route | 2 min |
| 🔴 P0 | Remove unused dependencies (`pg`, `pg-hstore`, etc.) | 10 min |
| 🔴 P0 | Add `.env` to `.gitignore` (ensure no .env files are tracked) | 2 min |
| 🟡 P1 | Add ESLint + Prettier for backend | 30 min |
| 🟡 P1 | Clean up frontend dead components (`jhfsfjs.tsx`, orphaned modals) | 20 min |

### Phase 2 — Testing Foundation (Week 2)
| Priority | Task | Effort |
|----------|------|--------|
| 🔴 P0 | Write first integration test for auth (login flow) | 2 hrs |
| 🔴 P0 | Write first integration test for materials CRUD | 2 hrs |
| 🟡 P1 | Set up test database and CI pipeline | 3 hrs |
| 🟡 P1 | Add Vitest + React Testing Library for frontend | 2 hrs |
| 🟡 P1 | Write unit tests for `dateUtils.ts` and utility functions | 1 hr |

### Phase 3 — Architecture Improvement (Week 3)
| Priority | Task | Effort |
|----------|------|--------|
| 🟡 P1 | Extract business logic from controllers → services | 4 hrs |
| 🟡 P1 | Use `asyncHandler` wrapper consistently | 1 hr |
| 🟡 P1 | Standardize API response handling on frontend (interceptor) | 2 hrs |
| 🟡 P1 | Add barrel exports (`index.ts`) for cleaner imports | 1 hr |
| 🟢 P2 | Enable and configure rate limiting | 30 min |

### Phase 4 — DevOps & Production Readiness (Week 4)
| Priority | Task | Effort |
|----------|------|--------|
| 🟡 P1 | Add `Dockerfile` for backend and frontend | 3 hrs |
| 🟡 P1 | Add `docker-compose.yml` for local development | 1 hr |
| 🟡 P1 | Set up GitHub Actions CI/CD pipeline | 3 hrs |
| 🟢 P2 | Add structured logging (Pino) | 1 hr |
| 🟢 P2 | Add Sentry error tracking | 30 min |

### Phase 5 — Long-Term Improvements
| Priority | Task | Effort |
|----------|------|--------|
| 🟢 P3 | Migrate backend to TypeScript | 2-3 weeks |
| 🟢 P3 | Add E2E tests with Playwright | 1 week |
| 🟢 P3 | Add WebSocket for real-time notifications (Socket.IO already installed) | 2 days |
| 🟢 P3 | Add performance monitoring and APM | 1 day |
| 🟢 P3 | Add API versioning (`/api/v1/`, `/api/v2/`) | 1 day |

---

## Appendix: Quick Wins

These can be done in under 30 minutes each:

1. **Delete `materials_fixed.js`** — Dead code
2. **Enable rate limiting** — Uncomment the code in `app.js`
3. **Remove unused npm packages**: `pg`, `pg-hstore`, `express-mongo-sanitize`, `xss-clean`, `hpp`
4. **Delete `frontend/src/store/Blogs.ts`** — Orphaned file
5. **Delete `frontend/src/pages/dashboard/jhfsfjs.tsx`** — Clearly test artifact
6. **Remove manual `Authorization` headers from frontend services** — The axios interceptor already adds them
7. **Add `@typescript-eslint/no-explicit-any` rule** — Reduce `any` usage
8. **Add `.editorconfig`** — Consistent coding styles across editors
9. **Add a `postinstall` script that warns about env config** instead of auto-running migrations
10. **Add a database health check to `/api/health` endpoint**

---

*This document was generated through a comprehensive analysis of the CDIMS codebase. For questions or clarification, refer to the project maintainers.*
