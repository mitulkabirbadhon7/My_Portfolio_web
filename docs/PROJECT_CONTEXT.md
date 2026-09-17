## Current Phase
Phase 3: Database Connection

## Completed Phases
Phase 1: Initialization & VS Code Setup
Phase 2: Backend Setup

## Database
MongoDB Atlas (Mongoose connected)

## Important Environment Variables
- `PORT` (Backend port)
- `MONGO_URI` (MongoDB connection string)

## Pending Tasks
- Set up Backend Architecture: BaseRepository and Error Handling (Phase 4)

## Current Phase
Phase 4: Backend Architecture Setup

## Completed Phases
Phase 1: Initialization & VS Code Setup
Phase 2: Backend Setup
Phase 3: Database Connection

## Current Architecture
- Monorepo (frontend/ and backend/).
- Backend uses layered OOP structure: Routes -> Controllers -> Services -> Repositories -> Models.
- Global Error Handling implemented via `AppError`.

## Pending Tasks
- Auth Models & DB Schema (Phase 5)

## Current Phase
Phase 5: Auth Models & DB Schema

## Completed Phases
Phase 1: Initialization & VS Code Setup
Phase 2: Backend Setup
Phase 3: Database Connection
Phase 4: Backend Architecture Setup

## Database
MongoDB Atlas (Mongoose connected)
- User Model implemented.

## Pending Tasks
- Auth Services & Controllers (Phase 6)

## Current Phase
Phase 6: Auth Services & Controllers

## Completed Phases
Phases 1 through 5.

## Authentication Strategy
JWT stored in HttpOnly cookies. `auth.service` and `auth.controller` implemented.

## Pending Tasks
- Auth Routes Protection Middleware (Phase 7)

## Current Phase
Phase 7: Auth Routes & Middleware

## Completed Phases
Phases 1 through 6.

## Authentication Strategy
JWT stored in HttpOnly cookies. `protect` middleware guards private routes via cookie and Bearer token parsing.

## Pending Tasks
- Projects Module Backend (Phase 8)

## Current Phase
Phase 8: Projects Module Backend

## Completed Phases
Phases 1 through 7.

## Current Architecture
- Full CRUD API implemented for Projects.
- Utilizes `ProjectRepository` extending `BaseRepository<IProject>`.
- Automated title-to-slug generation with collision handling.

## Pending Tasks
- Skills & Experience Module Backend (Phase 9)


## Current Phase
Phase 9: Skills & Experience Module Backend

## Completed Phases
Phases 1 through 8.

## Current Architecture
- Full CRUD APIs for Projects, Skills, and Experiences.
- Layered OOP structure (Model -> Repository -> Service -> Controller -> Route) uniformly followed.
- Route protection middleware active across all mutating administrative endpoints.

## Pending Tasks
- Settings & CV Module Backend with Cloudinary (Phase 10)

## Current Phase
Phase 10: Settings & CV Module Backend

## Completed Phases
Phases 1 through 9.

## File Storage Strategy
Cloudinary integration using `multer.memoryStorage()` for streaming uploads without disk persistence.

## Current Architecture
- Singleton `SettingsModel` maintains global site settings and CV link.
- CV uploads stream directly to Cloudinary (`portfolio/cv/`) using memory buffers.

## Pending Tasks
- Contact Email API with Resend (Phase 11)

## Current Phase
Phase 11: Contact Email API

## Completed Phases
Phases 1 through 10.

## Email Integration
Resend REST SDK with HTML templating, validation, and reply-to configuration.

## Pending Tasks
- AI Chatbot Backend Base (Phase 12)

## AI Integration
- Google Gen AI SDK (`@google/genai`) using `gemini-2.5-flash`.
- Server-side proxy isolating `GEMINI_API_KEY`.
- Bounded history (last 6 turns) and max output limit (500 tokens).

## Production Deployment (Phase 37)
- Platform: Render (Node Web Service)
- Live Backend Base URL: https://mkb-portfolio-wev.onrender.com
- Live API v1 Base: https://mkb-portfolio-wev.onrender.com/api/v1
- Production Domain: mitulkabirbadhon.me
- Production Frontend URL: https://mitulkabirbadhon.me
- Health Check: https://mkb-portfolio-wev.onrender.com/api/v1/health (Verified HTTP 200)

## Frontend Production Deployment (Phase 38)
- Platform: Vercel (Next.js App Router)
- Root Directory: frontend
- Production Custom Domain: mitulkabirbadhon.me
- Production Frontend URL: https://mitulkabirbadhon.me
- Build Configuration: NEXT_PUBLIC_API_URL=https://mkb-portfolio-wev.onrender.com/api/v1
- Image Domain Optimization: Cloudinary remotePatterns configured in next.config.ts

## Canonical Production Domain Mapping (Phase 39)
- Canonical Domain: mitulkabirbadhon.me
- Frontend: https://mitulkabirbadhon.me
- Backend API: https://mkb-portfolio-wev.onrender.com/api/v1
- Canonical Base URL fallback in metadata, sitemap.ts, and robots.ts: https://mitulkabirbadhon.me
- Robots sitemap: https://mitulkabirbadhon.me/sitemap.xml
- DNS & Routing Status: Apex (mitulkabirbadhon.me) and WWW (www.mitulkabirbadhon.me) live with active TLS and HTTP 200 responses