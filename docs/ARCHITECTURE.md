# System Architecture & Complete Project Structure

Welcome to the architectural overview and project map for the **Dynamic Developer Portfolio**. This document provides an exhaustive reference of the full codebase so you can quickly locate every folder, file, route, component, controller, model, and service.

---

## 1. High-Level Architectural Pattern

The project is organized as a clean decoupled **Full-Stack Monorepo**:
- **`frontend/`**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Sonner.
- **`backend/`**: Node.js, Express 5, TypeScript, MongoDB (Mongoose), Cloudinary, Resend, Google Gen AI (`@google/genai`).
- **`docs/`**: Architectural documentation, API specifications, and context tracking.

```
                  ┌──────────────────────────────────────────────┐
                  │                 CLIENT / WEB                 │
                  │  Next.js App Router (Tailwind v4 / Lucide)   │
                  │         https://mitulkabirbadhon.me          │
                  └───────────────┬──────────────────────────────┘
                                  │
                   HTTPS / JSON   │ HttpOnly Cookies (JWT)
                                  ▼
                  ┌──────────────────────────────────────────────┐
                  │                 BACKEND API                  │
                  │         Express 5 + TypeScript on Render     │
                  │   https://mkb-portfolio-wev.onrender.com     │
                  └─────────┬───────────────────┬────────────────┘
                            │                   │
         Mongoose ODM       ▼                   ▼  Third-Party APIs
               ┌─────────────────┐       ┌────────────────────────┐
               │  MongoDB Atlas  │       │ • Cloudinary (CV/Files)│
               │ (Projects, Auth │       │ • Resend (Email/SMTP)  │
               │  Skills, Exp)   │       │ • Google Gemini (AI)   │
               └─────────────────┘       └────────────────────────┘
```

---

## 2. Complete Project Directory Tree

```
my-dynamic-portfolio/
│
├── .github/
│   └── workflows/
│       └── ci.yml                     # GitHub Actions CI/CD Pipeline
│
├── .vscode/                           # IDE configurations & extensions
├── .gitignore                         # Repository gitignore (ignores .env, .next, Update.txt)
├── README.md                          # Project overview & quickstart
│
├── docs/                              # Project Documentation
│   ├── AGENTIC_EXECUTION_ROADMAP.md   # Phased implementation plan (Phases 1–40)
│   ├── API_DOCUMENTATION.md           # API specification & endpoint contracts
│   ├── ARCHITECTURE.md                # System design & complete folder map (This file)
│   ├── CONFIG.md                      # Production & local environment reference
│   ├── PHASE_CHECKLIST.md             # Status checklist of all 40 phases
│   └── PROJECT_CONTEXT.md             # Live environment status & deployment history
│
├── backend/                           # Node.js + Express + TypeScript Backend
│   ├── .env.example                   # Backend environment template
│   ├── package.json                   # Backend dependencies and scripts
│   ├── tsconfig.json                  # TypeScript compiler settings
│   └── src/
│       ├── server.ts                  # Server bootstrap & database initialization
│       ├── app.ts                     # Express app setup, CORS, Helmet, rate-limiters
│       │
│       ├── config/                    # Configuration modules
│       │   ├── db.ts                  # MongoDB Mongoose connection handler
│       │   ├── cloudinary.ts          # Cloudinary SDK client initialization
│       │   └── resend.ts              # Resend email client configuration
│       │
│       ├── controllers/               # HTTP Request/Response Controllers
│       │   ├── auth.controller.ts     # Login, register, me, logout handlers
│       │   ├── project.controller.ts  # Projects CRUD & slug handling
│       │   ├── skill.controller.ts    # Skills CRUD handlers
│       │   ├── experience.controller.ts # Experience entries CRUD handlers
│       │   ├── settings.controller.ts # Settings & CV upload handlers
│       │   ├── contact.controller.ts  # Contact email delivery handler
│       │   └── ai.controller.ts       # Gemini AI chat endpoint proxy
│       │
│       ├── services/                  # Business Logic Layer
│       │   ├── auth.service.ts        # Password hashing & JWT generation
│       │   ├── project.service.ts     # Project queries & slug generation logic
│       │   ├── skill.service.ts       # Skills queries & category sorting
│       │   ├── experience.service.ts  # Timeline sorting & validations
│       │   ├── settings.service.ts    # Settings singleton & Cloudinary streaming
│       │   ├── email.service.ts       # HTML email formatting & sending via Resend
│       │   └── ai.service.ts          # Google Gemini flash model integration
│       │
│       ├── repositories/              # Database Access Layer (Repository Pattern)
│       │   ├── base.repository.ts     # Generic CRUD repository interface & class
│       │   ├── user.repository.ts     # User specific queries
│       │   ├── project.repository.ts  # Project queries & published filters
│       │   ├── skill.repository.ts    # Skill queries
│       │   ├── experience.repository.ts # Experience queries
│       │   └── settings.repository.ts # Settings singleton queries
│       │
│       ├── models/                    # Mongoose Data Schemas & Models
│       │   ├── user.model.ts          # User schema (email, password hash, role)
│       │   ├── project.model.ts       # Project schema (title, slug, techStack, etc.)
│       │   ├── skill.model.ts         # Skill schema (name, category, proficiency)
│       │   ├── experience.model.ts    # Experience schema (company, role, timeline)
│       │   └── settings.model.ts      # Settings schema (cvUrl, contactEmail, etc.)
│       │
│       ├── middlewares/               # Express Middlewares
│       │   ├── auth.middleware.ts     # `protect` middleware checking JWT cookie
│       │   ├── errorHandler.ts        # Global error handling middleware
│       │   ├── rateLimiter.ts         # Express rate limiters (global, AI, contact)
│       │   └── upload.middleware.ts   # Multer memory storage for CV uploads
│       │
│       ├── routes/                    # API Route Definitions (/api/v1/*)
│       │   ├── auth.routes.ts         # /api/v1/auth/*
│       │   ├── project.routes.ts      # /api/v1/projects/*
│       │   ├── skill.routes.ts        # /api/v1/skills/*
│       │   ├── experience.routes.ts   # /api/v1/experiences/*
│       │   ├── settings.routes.ts     # /api/v1/settings/*
│       │   ├── contact.routes.ts      # /api/v1/contact
│       │   └── ai.routes.ts           # /api/v1/ai/chat
│       │
│       ├── utils/                     # Utility Classes & Helpers
│       │   ├── AppError.ts            # Custom operational error class
│       │   └── catchAsync.ts          # Async route wrapper for error forwarding
│       │
│       └── types/                     # Backend TypeScript interfaces & types
│
└── frontend/                          # Next.js 16 App Router Frontend
    ├── package.json                   # Frontend dependencies and scripts
    ├── next.config.ts                 # Next.js configuration & Cloudinary image domains
    ├── tsconfig.json                  # TypeScript compiler settings
    ├── postcss.config.mjs             # PostCSS plugin settings
    ├── eslint.config.mjs              # ESLint configuration
    ├── components.json                # Shadcn / UI configuration
    │
    ├── public/                        # Static Assets & SVGs
    │   ├── favicon.ico                # Site favicon
    │   └── *.svg                      # Vector icons and graphics
    │
    └── src/
        ├── app/                       # Next.js App Router (Pages & Route Handlers)
        │   ├── layout.tsx             # Root layout (Metadata, Google Fonts, PublicShell)
        │   ├── page.tsx               # Homepage (Hero, Bento Grid, Featured Projects)
        │   ├── globals.css            # Global CSS & Tailwind v4 theme tokens
        │   ├── loading.tsx            # Global route loading skeleton
        │   ├── not-found.tsx          # Custom 404 page
        │   ├── error.tsx              # Root error boundary
        │   ├── robots.ts              # Dynamic robots.txt generation
        │   ├── sitemap.ts             # Dynamic sitemap.xml generation
        │   │
        │   ├── about/                 # About Page Route
        │   │   └── page.tsx           # Bio, skills breakdown, experience timeline
        │   │
        │   ├── projects/              # Projects Section
        │   │   ├── page.tsx           # Projects gallery with filter pills & search
        │   │   ├── loading.tsx        # Projects gallery loading skeleton
        │   │   └── [slug]/            # Dynamic Project Detail
        │   │       └── page.tsx       # Markdown case study view & metadata
        │   │
        │   ├── contact/               # Contact Page Route
        │   │   └── page.tsx           # Contact details & interactive message form
        │   │
        │   ├── cv/                    # Dynamic CV Route Handler
        │   │   └── route.ts           # Fetches CV from /settings and redirects to Cloudinary
        │   │
        │   ├── cv-unavailable/        # Fallback CV Page
        │   │   └── page.tsx           # Friendly fallback when CV is not yet uploaded
        │   │
        │   └── admin/                 # Admin Dashboard Pages (Protected Area)
        │       ├── layout.tsx         # Admin layout with sidebar & auth guard
        │       ├── login/page.tsx     # Admin authentication login page
        │       ├── dashboard/page.tsx # Overview metrics and stats
        │       ├── projects/          # Admin projects management
        │       │   ├── page.tsx       # Projects table & publication status
        │       │   ├── new/page.tsx   # Project creation form
        │       │   └── edit/[id]/page.tsx # Project editor with Markdown preview
        │       ├── skills/page.tsx    # Skills manager (categories & proficiency)
        │       ├── experiences/page.tsx # Experience timeline manager
        │       └── cv/page.tsx        # CV PDF uploader & global contact settings
        │
        ├── components/                # Modular UI Components
        │   ├── layout/                # Global Layout Components
        │   │   ├── navbar.tsx         # Responsive header & navigation links
        │   │   ├── footer.tsx         # Global footer with social links & copyright
        │   │   └── public-shell.tsx   # Client wrapper for public routes
        │   │
        │   ├── public/                # Public Interactive Widgets
        │   │   └── ChatWidget.tsx     # Floating electric-green AI chatbot
        │   │
        │   ├── projects/              # Projects Feature Components
        │   │   └── projects-gallery.tsx # Filterable projects list & tech pills
        │   │
        │   ├── contact/               # Contact Feature Components
        │   │   └── contact-form.tsx   # Validated contact form with sonner toasts
        │   │
        │   ├── admin/                 # Admin Feature Components
        │   │   └── ProjectForm.tsx    # Shared create/edit project form
        │   │
        │   ├── ui/                    # Primitive UI Components
        │   │   ├── alert.tsx          # Callout alerts
        │   │   ├── button.tsx         # Theme styled buttons
        │   │   ├── card.tsx           # Bento and general cards
        │   │   ├── dialog.tsx         # Modal dialogs
        │   │   ├── input.tsx          # Form text inputs
        │   │   ├── label.tsx          # Form field labels
        │   │   ├── sonner.tsx         # Toast provider
        │   │   ├── table.tsx          # Admin data tables
        │   │   └── textarea.tsx       # Multi-line text inputs
        │   │
        │   └── providers.tsx          # React Context Providers wrapper
        │
        ├── context/                   # Global React State
        │   ├── auth-context.tsx       # Admin authentication state & login/logout
        │   └── settings-context.tsx   # Global site settings & CV URL state
        │
        ├── lib/                       # Utilities & API Clients
        │   ├── api.ts                 # Shared typed fetch client with HttpOnly cookies
        │   └── utils.ts               # Tailwind class merge utility (cn)
        │
        └── types/                     # TypeScript Interfaces & Models
            └── index.ts               # Shared frontend types (Project, Skill, etc.)
```

---

## 3. Key Feature Quick Lookup

| If you want to change... | Look in this folder / file |
|---|---|
| **Color Palette / Theme Tokens** | `frontend/src/app/globals.css` |
| **Homepage Layout & Bento Grid** | `frontend/src/app/page.tsx` |
| **Navigation Bar & Header** | `frontend/src/components/layout/navbar.tsx` |
| **Footer & Social Links** | `frontend/src/components/layout/footer.tsx` |
| **AI Chatbot UI & Behavior** | `frontend/src/components/public/ChatWidget.tsx` |
| **AI Chatbot Backend Prompt / Model** | `backend/src/services/ai.service.ts` |
| **Projects Gallery & Filtering** | `frontend/src/components/projects/projects-gallery.tsx` |
| **Project Case Study Detail Page** | `frontend/src/app/projects/[slug]/page.tsx` |
| **About Page & Timeline** | `frontend/src/app/about/page.tsx` |
| **Contact Form UI** | `frontend/src/components/contact/contact-form.tsx` |
| **Contact Form Backend & Email Template** | `backend/src/services/email.service.ts` |
| **CV Upload Handler (Cloudinary)** | `backend/src/controllers/settings.controller.ts` |
| **CV Upload Admin Page** | `frontend/src/app/admin/cv/page.tsx` |
| **Admin Login & Authentication** | `frontend/src/app/admin/login/page.tsx` & `backend/src/controllers/auth.controller.ts` |
| **SEO Metadata, OpenGraph & Robots** | `frontend/src/app/layout.tsx`, `robots.ts`, and `sitemap.ts` |
| **API Client Base URL & Fetch Wrapper** | `frontend/src/lib/api.ts` |
