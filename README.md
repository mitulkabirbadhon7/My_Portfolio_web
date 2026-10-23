# Mitul Kabir Badhon &mdash; Software Engineering Portfolio

[![Continuous Integration](https://github.com/mitulkabirbadhon7/My_Portfolio_web/actions/workflows/ci.yml/badge.svg)](https://github.com/mitulkabirbadhon7/My_Portfolio_web/actions/workflows/ci.yml)
[![Production Deployment](https://img.shields.io/badge/Production-Live-5DD62C?style=flat&logo=vercel&logoColor=white)](https://www.mitulkabirbadhon.me/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)

Personal production portfolio and interactive engineering systems console for **Mitul Kabir Badhon** &mdash; Full-Stack & Systems Software Engineer. Designed with a high-density, feature-first aesthetic emphasizing architectural durability, runtime stability, and tactile engineering interactions.

**Live Domain:** [https://www.mitulkabirbadhon.me/](https://www.mitulkabirbadhon.me/)

---

## ⚡ Technical Highlights & Features

- **Interactive Profile HUD**: Dynamic portrait featuring cursor-coordinated 3D micro-tilt ($\pm 3.5^\circ$), vertical CRT laser scanline sweep, HUD corner brackets, and live telemetry ribbons (`PORT: 443 // TLS`, `DIAG: NOMINAL`).
- **Snappy Route & Page Transitions**: GPU-accelerated enter animations paired with route handshake sweep bars and seamless anchor preservation.
- **Engineered Project Bento Grid**: Modular project showcase cards with 3D micro-tilt, HUD reticles, live demo links, repository badges, and responsive filtering.
- **Interactive CLI Engineering Console**: Terminal-inspired console widget providing structured query exploration (`$ query --stack`, `$ query --projects`, `$ query --contact`) backed by a portfolio knowledge base.
- **Clean Engineering Aesthetic**: De-AI styling with titanium dark themes (`#0F0F0F`, `#141414`, `#202020`), border accents (`#2A2A2A`), and cyber green telemetry (`#5DD62C`).
- **Full Accessibility & Reduced Motion**: Native support for `prefers-reduced-motion: reduce`, ARIA compliance, and semantic HTML5 hierarchy.

---

## 🛠 Tech Stack & Architecture

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Streaming Server Components)
- **Language:** TypeScript 5.9 (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme` variables & cubic-bezier easing
- **Icons:** [Lucide React](https://lucide.dev/)
- **State & Context:** React 19 Hooks, Custom Context Providers (`SettingsContext`, `AuthContext`)

### Backend & Storage
- **Runtime:** [Node.js](https://nodejs.org/) (ES Modules, TypeScript)
- **Server Framework:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via Mongoose ODM
- **Validation:** [Zod](https://zod.dev/) schema validation on API payloads
- **Security:** JWT authentication, dual-layer bearer token & HTTP-only cookies, CORS policy, helmet headers
- **Asset Storage:** Cloudinary media storage with Multer multipart handlers

### CI/CD & Testing
- **Continuous Integration:** GitHub Actions automated pipelines on `main`, `master`, and `frontend`
- **Unit & Integration Testing:** [Vitest](https://vitest.dev/)
- **Linting & Typechecking:** ESLint 9 (Flat Config), TypeScript `--noEmit`
- **Hosting:** Vercel (Frontend SSR/Edge), Render/VPS (Backend API)

---

## 📁 Repository Structure

```text
my-dynamic-portfolio/
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI matrix pipeline
├── backend/
│   ├── src/
│   │   ├── config/              # Environment & DB configurations
│   │   ├── controllers/         # API request handlers
│   │   ├── middlewares/         # Auth, validation, error middlewares
│   │   ├── models/              # Mongoose schemas (Project, Skill, Experience, Settings)
│   │   ├── repositories/        # Data access layer
│   │   ├── routes/              # Express API versioned routes (/api/v1)
│   │   ├── services/            # Business logic & AI terminal engine
│   │   └── tests/               # Vitest unit test suite
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── app/                 # Next.js 16 App Router (home, about, projects, admin)
│   │   ├── components/
│   │   │   ├── home/            # Hero, TechPortrait, BentoProjects, SkillsMarquee
│   │   │   ├── layout/          # Navbar, Footer, PublicShell
│   │   │   ├── motion/          # PageTransition, MagneticButton, CustomCursor
│   │   │   ├── projects/        # ProjectGallery, filter controls
│   │   │   └── public/          # ChatWidget interactive CLI console
│   │   ├── context/             # Client state contexts
│   │   ├── lib/                 # API client utilities
│   │   └── types/               # TypeScript interfaces
│   ├── eslint.config.mjs
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ installed
- MongoDB instance (local or MongoDB Atlas URI)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/mitulkabirbadhon7/My_Portfolio_web.git
cd My_Portfolio_web/my-dynamic-portfolio
```

### 2. Configure Backend
```bash
cd backend
npm install
cp .env.example .env
```
Fill in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your_secure_jwt_secret_key
FRONTEND_URL=http://localhost:3000
```
Run development server:
```bash
npm run dev
```

### 3. Configure Frontend
In a new terminal window:
```bash
cd frontend
npm install
cp .env.example .env.local
```
Fill in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Run development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Validation

```bash
# Run backend test suite
cd backend
npm test

# Run frontend linting & typechecking
cd ../frontend
npm run lint
npx tsc --noEmit

# Test production build
npm run build
```

---

## 📄 License
This project is private and proprietary to **Mitul Kabir Badhon**. All rights reserved.
