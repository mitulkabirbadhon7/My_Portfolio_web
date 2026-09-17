# Development Log

## Phase 1 - Initialization & VS Code Setup

### Date
2026-09-02

### Completed
- Initialized Git repository on Windows
- Created monorepo folder structure (`frontend`, `backend`)
- Created documentation structure (`docs/`)
- Set up root `.gitignore`
- Configured VS Code Workspace (`.vscode/settings.json`, `.vscode/extensions.json`)

### Files Created
- `.gitignore`
- `README.md`
- `.vscode/settings.json`
- `.vscode/extensions.json`
- `docs/*.md`

### Tests Performed
- Verified git status
- Verified VS Code prompts for extensions

### Result
PASS

### Git Commit
chore: initialize monorepo, docs, and vscode workspace for windows

## Phase 2 - Backend Setup

### Date
2026-09-02

### Completed
- Initialized Node.js in `/backend`
- Installed Express, TypeScript, and modern tooling (`tsx`)
- Configured ESLint and Prettier for the backend
- Created separate `app.ts` and `server.ts` for modularity
- Added health check API route
- Configured environment variables template

### Files Created
- `backend/package.json`
- `backend/tsconfig.json`
- `backend/.eslintrc.json`
- `backend/.prettierrc`
- `backend/.env` & `backend/.env.example`
- `backend/src/app.ts`
- `backend/src/server.ts`

### Tests Performed
- Started dev server using `npm run dev`
- Visited health check endpoint in browser
- Tested 404 fallback route

### Result
PASS

### Git Commit
feat: initialize backend with express, typescript, and basic architecture

### Next Phase
Phase 3 (Database Connection)

## Phase 3 - Database Connection

### Date
2026-09-02

### Completed
- Installed Mongoose ODM
- Created `config/db.ts` to manage MongoDB connection
- Implemented fail-fast database connection logic in `server.ts`
- Updated environment variables template with `MONGO_URI`

### Files Created
- `backend/src/config/db.ts`

### Files Modified
- `backend/package.json`
- `backend/.env` & `backend/.env.example`
- `backend/src/server.ts`

### Tests Performed
- Connected successfully to MongoDB Atlas cluster
- Verified fail-fast behavior (DB connects before server listens)

### Result
PASS

### Git Commit
feat: connect backend to mongodb atlas using mongoose

### Next Phase
Phase 4 (Backend Architecture Setup)

## Phase 4 - Backend Architecture Setup

### Date
2026-09-02

### Completed
- Created `AppError.ts` for standardized error generation.
- Created `errorHandler.ts` middleware for centralized error response.
- Created `base.repository.ts` implementing a generic CRUD interface.
- Wired error handler into `app.ts`.

### Files Created
- `backend/src/utils/AppError.ts`
- `backend/src/middlewares/errorHandler.ts`
- `backend/src/repositories/base.repository.ts`

### Files Modified
- `backend/src/app.ts`

### Tests Performed
- Tested 404 route to verify global error handler returns JSON with stack trace in development.

### Result
PASS

### Git Commit
feat: implement oop base repository and global error handling

### Next Phase
Phase 5 (Auth Models & DB Schema)


## Phase 5 - Auth Models & DB Schema

### Date
2026-09-02

### Completed
- Documented complete project schema in `DATABASE_SCHEMA.md`.
- Implemented `UserModel` with strict TypeScript typing.
- Added `bcryptjs` for secure password hashing.
- Configured Mongoose `pre('save')` hook for automated hashing.
- Added `select: false` to password field for default security.

### Files Created
- `backend/src/models/user.model.ts`

### Files Modified
- `docs/DATABASE_SCHEMA.md`
- `backend/package.json`

### Tests Performed
- Started dev server to verify schema compiles and types are correct.

### Result
PASS

### Git Commit
feat: document db schema and implement secure user model with bcrypt

### Next Phase
Phase 6 (Auth Services & Controllers)


## Phase 6 - Auth Services & Controllers

### Date
2026-09-17

### Completed
- Installed `jsonwebtoken`.
- Implemented `AuthService` handling DB queries and token generation.
- Implemented `AuthController` handling HTTP requests and `HttpOnly` cookies.
- Mapped Express routes for `/register` and `/login`.

### Files Created
- `backend/src/services/auth.service.ts`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/routes/auth.routes.ts`

### Files Modified
- `backend/src/app.ts`
- `backend/.env`

### Tests Performed
- Hit `/register` endpoint via PowerShell.
- Hit `/login` endpoint via PowerShell. Validated successful JSON response.

### Result
PASS

### Git Commit
feat: implement auth service, controller, and jwt generation

### Next Phase
Phase 7 (Auth Routes & Middleware)


## Phase 7 - Auth Routes & Middleware

### Date
2026-09-17

### Completed
- Installed and integrated `cookie-parser`.
- Created TypeScript definition declaration in `src/types/express.d.ts` for `req.user`.
- Built `protect` middleware for JWT extraction and verification.
- Added `getMe` and `logout` handlers to `AuthController`.
- Added protected `/me` and public `/logout` routes to `auth.routes.ts`.

### Files Created
- `backend/src/types/express.d.ts`
- `backend/src/middlewares/auth.middleware.ts`

### Files Modified
- `backend/src/app.ts`
- `backend/src/controllers/auth.controller.ts`
- `backend/src/routes/auth.routes.ts`
- `backend/package.json`
- `docs/API_DOCUMENTATION.md`

### Tests Performed
- Verified 401 response on unauthenticated `GET /api/v1/auth/me`.
- Authenticated via PowerShell `WebRequestSession` and verified 200 response on `GET /api/v1/auth/me`.
- Verified `/logout` invalidates session cookie.

### Result
PASS

### Git Commit
feat: implement auth protection middleware, cookie parsing, and session endpoints

### Next Phase
Phase 8 (Projects Module Backend)

## Phase 8 - Projects Module Backend

### Date
2026-09-17

### Completed
- Built `slugify` utility for URL generation.
- Created `ProjectModel` with indexing on `slug`.
- Implemented `ProjectRepository` inheriting from `BaseRepository`.
- Built `ProjectService` handling uniqueness and public/admin filtering.
- Implemented `ProjectController` and mapped CRUD endpoints.
- Attached `protect` middleware to modifying actions (`POST`, `PUT`, `DELETE`).

### Files Created
- `backend/src/utils/slugify.ts`
- `backend/src/models/project.model.ts`
- `backend/src/repositories/project.repository.ts`
- `backend/src/services/project.service.ts`
- `backend/src/controllers/project.controller.ts`
- `backend/src/routes/project.routes.ts`

### Files Modified
- `backend/src/app.ts`
- `docs/API_DOCUMENTATION.md`

### Tests Performed
- Verified public `GET /api/v1/projects` returns empty list on initialization.
- Verified unauthenticated `POST /api/v1/projects` returns 401.
- Authenticated via PowerShell session and created project.
- Verified slug generation (`dynamic-portfolio-website`) and retrieval via public slug endpoint.

### Result
PASS

### Git Commit
feat: implement project model, repository, service, controller, and routes

### Next Phase
Phase 9 (Skills & Experience Module Backend)

## Phase 9 - Skills & Experience Module Backend

### Date
2026-09-17

### Completed
- Implemented `SkillModel` and `ExperienceModel` with indexing.
- Created `SkillRepository` and `ExperienceRepository` inheriting from `BaseRepository`.
- Built `SkillService` with proficiency range bounds validation.
- Built `ExperienceService` with conditional date logic.
- Implemented `SkillController` and `ExperienceController`.
- Mapped routes for `/api/v1/skills` and `/api/v1/experiences` with selective `protect` middleware.

### Files Created
- `backend/src/models/skill.model.ts`
- `backend/src/repositories/skill.repository.ts`
- `backend/src/services/skill.service.ts`
- `backend/src/controllers/skill.controller.ts`
- `backend/src/routes/skill.routes.ts`
- `backend/src/models/experience.model.ts`
- `backend/src/repositories/experience.repository.ts`
- `backend/src/services/experience.service.ts`
- `backend/src/controllers/experience.controller.ts`
- `backend/src/routes/experience.routes.ts`

### Files Modified
- `backend/src/app.ts`
- `docs/API_DOCUMENTATION.md`

### Tests Performed
- Created Skill and Experience records using authenticated admin session.
- Fetched both collections publicly to verify 200 response and JSON formatting.
- Verified chronological ordering on experiences.

### Result
PASS

### Git Commit
feat: implement skills and experiences models, repositories, services, and routes

### Next Phase
Phase 10 (Settings & CV Module Backend)

## Phase 10 - Settings & CV Module Backend

### Date
2026-09-17

### Completed
- Configured Cloudinary v2 SDK.
- Implemented Multer memory storage middleware with strict PDF filter and 5MB threshold.
- Implemented singleton `SettingsModel` and `SettingsRepository`.
- Built `SettingsService` streaming memory buffers to Cloudinary via readable streams.
- Implemented `SettingsController` and `/api/v1/settings` endpoints.

### Files Created
- `backend/src/config/cloudinary.ts`
- `backend/src/middlewares/upload.middleware.ts`
- `backend/src/models/settings.model.ts`
- `backend/src/repositories/settings.repository.ts`
- `backend/src/services/settings.service.ts`
- `backend/src/controllers/settings.controller.ts`
- `backend/src/routes/settings.routes.ts`

### Files Modified
- `backend/src/app.ts`
- `backend/package.json`
- `backend/.env` & `backend/.env.example`
- `docs/API_DOCUMENTATION.md`

### Tests Performed
- Verified singleton record creation on public `GET /api/v1/settings`.
- Authenticated and updated settings fields (`githubUrl`, `linkedinUrl`).
- Uploaded test PDF via multipart/form-data to Cloudinary and verified `cvUrl` persistence.

### Result
PASS

### Git Commit
feat: implement settings singleton, cloudinary config, and pdf cv upload flow

### Next Phase
Phase 11 (Contact Email API)

## Phase 11 - Contact Email API

### Date
2026-09-17

### Completed
- Installed and integrated `resend` SDK.
- Built `EmailService` with responsive HTML email template, HTML sanitization, and reply-to routing.
- Built `ContactController` with input validation (name, email format, message length bounds).
- Mapped public `POST /api/v1/contact` route.

### Files Created
- `backend/src/services/email.service.ts`
- `backend/src/controllers/contact.controller.ts`
- `backend/src/routes/contact.routes.ts`

### Files Modified
- `backend/src/app.ts`
- `backend/package.json`
- `backend/.env` & `backend/.env.example`
- `docs/API_DOCUMENTATION.md`

### Tests Performed
- Tested 400 response on short message and invalid email format.
- Dispatched valid message via PowerShell and verified email delivery in inbox.

### Result
PASS

### Git Commit
feat: implement contact email module with resend sdk and input validation

### Next Phase
Phase 12 (AI Chatbot Backend Base)

### Provider Update (Gemini)
- Replaced `openai` dependency with `@google/genai`.
- Refactored `ai.service.ts` to construct Gemini `contents` payload with system instruction configuration.
- Verified single-turn and multi-turn chat via PowerShell.