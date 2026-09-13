# SparkTrail Foundation & UI Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the SparkTrail repository, Next.js frontend foundation, design system, responsive marketing shell, authenticated app shell, and animation infrastructure without connecting the backend yet.

**Architecture:** SparkTrail starts as a repository with a `client/` Next.js App Router application and reserved `server/` directory for the separate Express backend. The frontend is split into marketing, auth, and protected app route groups, with reusable UI primitives and feature-oriented components. Landing-page motion infrastructure is isolated from the authenticated app so GSAP/Lenis never become global performance baggage.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui + Radix primitives, Lucide React, Motion, GSAP + ScrollTrigger, Lenis, Vitest, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-13-sparktrail-design.md`

## Global Constraints

- Product name: `SparkTrail`.
- Tagline: `Small steps. Real progress.`
- Framework: Next.js App Router + TypeScript + Tailwind CSS.
- Marketing aesthetic: hybrid light + dark premium; warm off-white, near-black typography, controlled lime/violet accents, large whitespace, dark immersive sections used strategically.
- Design tokens: light `#F6F5EF`, surface `#FFFFFF`, ink `#111111`, muted `#737373`, lime `#C7FF3D`, violet `#7857FF`, dark `#101113`, border `rgba(17,17,17,.10)`.
- Typography: Space Grotesk or Manrope for display, Inter for body/UI, optional Instrument Serif accent.
- Do not copy Facebook, Instagram, or X layouts.
- GSAP/ScrollTrigger/Lenis are marketing-page tools; authenticated app motion stays lightweight.
- Respect `prefers-reduced-motion` and simplify heavy effects on mobile.
- Public routes: `/`, `/login`, `/register`, `/onboarding`.
- Protected app routes later include `/feed`, `/explore`, `/create`, `/notifications`, `/saved`, `/profile`, `/profile/edit`, `/u/[username]`, `/post/[id]`.
- The backend remains a separate Express application; do not move core API logic into Next.js route handlers.
- AI-generated UI is a starting point only; every adopted component must be understandable, responsive, and edited into the SparkTrail design system.

---

## Planned Repository/File Structure

```text
sparktrail/
├── client/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (marketing)/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── register/page.tsx
│   │   │   │   └── onboarding/page.tsx
│   │   │   ├── (app)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── feed/page.tsx
│   │   │   │   ├── explore/page.tsx
│   │   │   │   ├── create/page.tsx
│   │   │   │   ├── notifications/page.tsx
│   │   │   │   ├── saved/page.tsx
│   │   │   │   ├── profile/page.tsx
│   │   │   │   ├── profile/edit/page.tsx
│   │   │   │   ├── u/[username]/page.tsx
│   │   │   │   └── post/[id]/page.tsx
│   │   │   ├── globals.css
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── app-shell/
│   │   │   │   ├── app-sidebar.tsx
│   │   │   │   ├── mobile-bottom-nav.tsx
│   │   │   │   └── right-rail.tsx
│   │   │   ├── marketing/
│   │   │   │   ├── marketing-header.tsx
│   │   │   │   ├── hero-section.tsx
│   │   │   │   └── progress-card.tsx
│   │   │   └── ui/
│   │   │       ├── brand-mark.tsx
│   │   │       └── button.tsx
│   │   ├── lib/
│   │   │   ├── animation/
│   │   │   │   ├── gsap.ts
│   │   │   │   └── lenis.tsx
│   │   │   └── utils.ts
│   │   └── test/setup.ts
│   ├── vitest.config.mts
│   └── package.json
├── server/
│   └── .gitkeep
├── docs/
│   └── superpowers/
├── .gitignore
└── README.md
```

Responsibilities are intentionally separated: marketing components know nothing about app-shell behavior; app-shell components know nothing about GSAP/Lenis; animation utilities do not own page content.

---

### Task 1: Initialize the Repository Root and Lock the v0 Visual Reference

**Files:**
- Create: `.gitignore`
- Create: `README.md`
- Create: `server/.gitkeep`
- Reference only: `docs/superpowers/specs/2026-09-13-sparktrail-design.md`
- Create after export/review: `docs/ui-reference.md`

**Interfaces:**
- Consumes: approved SparkTrail visual tokens and landing-page sections from the spec.
- Produces: initialized Git repository plus a visual reference for the marketing hero and feed card; no production code is copied blindly.

- [ ] **Step 1: Verify required local tools before creating the project**

Run:

```bash
node -v
npm -v
git --version
code --version
```

Expected: Node, npm, and git print versions. If only `code` is unavailable, continue and enable the editor shell command later. If Node/npm/git are unavailable, stop before scaffolding and install them rather than working around the missing dependency.

- [ ] **Step 2: Initialize the repository root and documentation directories**

Run from the directory that will contain the project:

```bash
mkdir -p sparktrail/server sparktrail/docs/superpowers
cd sparktrail
git init
touch server/.gitkeep
```

Create `.gitignore`:

```gitignore
.DS_Store
.env
.env.*
!.env.example
node_modules/
.next/
coverage/
dist/
*.log
```

Create `README.md`:

```markdown
# SparkTrail

SparkTrail is a progress-first social platform built for the CodeAlpha Full Stack Web Development internship task.

## Architecture

- `client/` — Next.js frontend
- `server/` — Express API and Socket.IO server
- `docs/` — product specs, implementation plans, and architecture notes
```

- [ ] **Step 3: Open a fresh v0 chat and submit this exact first prompt**

```text
Design a premium responsive landing-page concept for a product named SparkTrail, a progress-first social platform where people share what they are LEARNING, BUILDING, STUCK on, or have WON.

Do NOT make it look like Instagram, Facebook, X, LinkedIn, or a generic purple SaaS template.

Visual direction:
- hybrid light + dark premium editorial aesthetic
- primary background #F6F5EF
- surfaces #FFFFFF
- primary ink #111111
- muted text #737373
- accent lime #C7FF3D
- accent violet #7857FF
- immersive dark surface #101113
- thin understated borders using rgba(17,17,17,.10)
- large whitespace, strong typographic hierarchy, minimal shadows
- Space Grotesk-style display typography and Inter-style UI typography

Hero copy:
Eyebrow: PROGRESS, WITHOUT THE NOISE
Headline: Small steps. Real progress.
Body: Share what you're learning, building, fixing and winning — without the noise of traditional social media.
Primary CTA: Start your trail
Secondary CTA: Explore community

Hero visual must use original SparkTrail product UI, not a laptop mockup. Build a layered composition with one main progress-post card and smaller floating LEARNING / BUILDING / STUCK / WIN state cards. Include subtle progress indicators, avatars, spark/like count, comment count, and tags.

The landing page should visually support these later sections without fully implementing them yet: community strip, progress story, pinned Trail Journey, feed preview, four progress states, profile showcase, discovery, final CTA.

Make the hero feel sophisticated enough for an Awwwards-inspired startup while remaining highly usable and believable as a real social product. Avoid excessive glassmorphism, excessive gradients, neon overload, 3D blobs, stock illustrations, and clutter.

Use Next.js + TypeScript + Tailwind-compatible React components. Keep the hero component structure clean and reusable. Do not add backend logic.
```

- [ ] **Step 4: Review the v0 result against the acceptance checklist**

```text
PASS only if:
[ ] The hero explains SparkTrail within ~5 seconds.
[ ] The product cards look original, not like Instagram posts.
[ ] Light/dark contrast is controlled rather than neon-heavy.
[ ] Lime and violet are accents, not full-page fills.
[ ] Typography is bold but readable.
[ ] Desktop layout has enough whitespace.
[ ] Mobile composition still reads clearly.
[ ] The UI can be recreated with normal React/Tailwind components.

REJECT if:
[ ] Generic gradient SaaS hero.
[ ] Giant dashboard/laptop mockup.
[ ] Glass cards everywhere.
[ ] Instagram-style feed clone.
[ ] Overdesigned background competing with content.
```

- [ ] **Step 5: Save only design decisions, not raw generated code, into `docs/ui-reference.md`**

```markdown
# SparkTrail UI Reference

## Locked Direction
- Two-column editorial hero on desktop with copy on the left and an original layered SparkTrail progress-card composition on the right.
- Warm off-white marketing canvas with white surfaces, near-black type, lime primary accent, and violet secondary accent.
- Large display typography, generous whitespace, rounded but restrained cards, thin borders, and subtle shadows.
- Mobile hero becomes a single column; product cards remain readable and must not overflow the viewport.
- Product UI communicates LEARNING, BUILDING, STUCK, and WIN without copying an established social network.

## Allowed v0 Influence
- Refine spacing rhythm, card overlap, type scale, and responsive proportions.
- Suggest subtle micro-interactions that can later be implemented with GSAP/Motion.
- Suggest icon placement or supporting decorative geometry that does not compete with content.

## Rejected Patterns
- Generic purple/blue gradient SaaS hero.
- Laptop or browser-window mockup as the primary hero visual.
- Heavy glassmorphism, neon overload, 3D blobs, stock illustrations, or Instagram-style feed cards.
- Any v0-generated backend, authentication, or data-access code.
```

- [ ] **Step 6: Commit the repository root and visual reference**

```bash
git add .gitignore README.md server/.gitkeep docs/ui-reference.md
git commit -m "chore: initialize SparkTrail project"
```

Expected: one concise reference document exists; no v0-generated application has been merged yet.

---

### Task 2: Scaffold the Next.js Client and Test Harness

**Files:**
- Create via scaffold: `client/**`
- Create: `client/vitest.config.mts`
- Create: `client/src/test/setup.ts`
- Modify: `client/package.json`

**Interfaces:**
- Consumes: initialized repository from Task 1.
- Produces: runnable Next.js client and `npm test` test command used by all frontend tasks.

- [ ] **Step 1: Scaffold the Next.js frontend**

Run from `sparktrail/`:

```bash
npx create-next-app@latest client \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --use-npm
```

Expected: `client/src/app/page.tsx` and `client/src/app/layout.tsx` exist and `npm run dev` starts successfully.

- [ ] **Step 2: Install the frontend test harness**

Run:

```bash
cd client
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
```

Create `client/vitest.config.mts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

Install the React Vite plugin required by the config:

```bash
npm install -D @vitejs/plugin-react
```

Create `client/src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

- [ ] **Step 3: Add a failing smoke test before replacing the starter page**

Create `client/src/app/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("SparkTrail home", () => {
  it("shows the SparkTrail tagline", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: /small steps\. real progress\./i }),
    ).toBeInTheDocument();
  });
});
```

Add scripts to `client/package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Keep all existing `dev`, `build`, `start`, and `lint` scripts.

- [ ] **Step 4: Run the smoke test and verify it fails for the right reason**

Run:

```bash
npm test -- src/app/page.test.tsx
```

Expected: FAIL because the starter page does not contain `Small steps. Real progress.`

- [ ] **Step 5: Make the smallest implementation needed for the smoke test**

Replace `client/src/app/page.tsx` with:

```tsx
export default function Home() {
  return (
    <main>
      <h1>Small steps. Real progress.</h1>
    </main>
  );
}
```

- [ ] **Step 6: Verify tests, lint, and build**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all commands exit successfully.

- [ ] **Step 7: Commit the working foundation**

Run from the repository root:

```bash
cd ..
git add .
git commit -m "chore: initialize SparkTrail frontend"
```

---

### Task 3: Establish SparkTrail Design Tokens, Fonts, and Base UI Primitives

**Files:**
- Modify: `client/src/app/globals.css`
- Modify: `client/src/app/layout.tsx`
- Create: `client/src/components/ui/brand-mark.tsx`
- Create: `client/src/components/ui/brand-mark.test.tsx`
- Create: `client/src/components/ui/button.tsx`
- Create: `client/src/components/ui/button.test.tsx`
- Create: `client/src/lib/utils.ts`
- Modify: `client/package.json`

**Interfaces:**
- Produces: `BrandMark`, `Button`, and CSS custom properties used by all later UI.
- `Button` signature: standard `React.ButtonHTMLAttributes<HTMLButtonElement>` plus `variant?: "primary" | "secondary" | "ghost"`.

- [ ] **Step 1: Install UI utility dependencies**

Run from `client/`:

```bash
npm install clsx tailwind-merge lucide-react
```

Create `client/src/lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Write the failing BrandMark test**

Create `client/src/components/ui/brand-mark.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { BrandMark } from "./brand-mark";

describe("BrandMark", () => {
  it("renders the SparkTrail product name", () => {
    render(<BrandMark />);
    expect(screen.getByText("SparkTrail")).toBeInTheDocument();
  });
});
```

Run:

```bash
npm test -- src/components/ui/brand-mark.test.tsx
```

Expected: FAIL because `brand-mark.tsx` does not exist.

- [ ] **Step 3: Implement BrandMark**

Create `client/src/components/ui/brand-mark.tsx`:

```tsx
import { Sparkles } from "lucide-react";

export function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2 font-semibold tracking-[-0.03em] text-ink">
      <span className="grid size-8 place-items-center rounded-full bg-lime text-ink">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      <span>SparkTrail</span>
    </span>
  );
}
```

- [ ] **Step 4: Write the failing Button behavior test**

Create `client/src/components/ui/button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("forwards button interactions", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Start your trail</Button>);
    await user.click(screen.getByRole("button", { name: /start your trail/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

Run:

```bash
npm test -- src/components/ui/button.test.tsx
```

Expected: FAIL because `button.tsx` does not exist.

- [ ] **Step 5: Implement Button**

Create `client/src/components/ui/button.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:-translate-y-0.5 hover:bg-black",
  secondary: "border border-border bg-surface text-ink hover:bg-black/[0.03]",
  ghost: "bg-transparent text-ink hover:bg-black/[0.04]",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 6: Define the exact design tokens and global base styles**

Update `client/src/app/globals.css` so the theme contains these variables and Tailwind-compatible aliases:

```css
@import "tailwindcss";

:root {
  --background: #f6f5ef;
  --surface: #ffffff;
  --ink: #111111;
  --muted: #737373;
  --lime: #c7ff3d;
  --violet: #7857ff;
  --dark: #101113;
  --border: rgba(17, 17, 17, 0.1);
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-lime: var(--lime);
  --color-violet: var(--violet);
  --color-dark: var(--dark);
  --color-border: var(--border);
}

* {
  border-color: var(--border);
}

html {
  background: var(--background);
}

body {
  margin: 0;
  background: var(--background);
  color: var(--ink);
  text-rendering: optimizeLegibility;
}

::selection {
  background: var(--lime);
  color: var(--ink);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 7: Configure Next.js fonts**

Update `client/src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "SparkTrail — Small steps. Real progress.",
  description: "Share what you're learning, building, fixing and winning.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-[var(--font-sans)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Verify tests and build**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: BrandMark and Button tests pass; build succeeds.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add SparkTrail design system foundation"
```

---

### Task 4: Build the Marketing Header, Hero, and Original Progress Card

**Files:**
- Create: `client/src/app/(marketing)/layout.tsx`
- Create: `client/src/app/(marketing)/page.tsx`
- Remove: `client/src/app/page.tsx`
- Move/replace test: `client/src/app/(marketing)/page.test.tsx`
- Create: `client/src/components/marketing/marketing-header.tsx`
- Create: `client/src/components/marketing/hero-section.tsx`
- Create: `client/src/components/marketing/progress-card.tsx`
- Create: `client/src/components/marketing/hero-section.test.tsx`

**Interfaces:**
- `ProgressCard` consumes `{ status, title, body, author, sparks, comments, tags, compact? }`.
- `HeroSection` is pure presentation at this stage; animation hooks are added in Task 7.

- [ ] **Step 1: Write the failing hero content test**

Create `client/src/components/marketing/hero-section.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("explains SparkTrail and exposes both primary actions", () => {
    render(<HeroSection />);

    expect(
      screen.getByRole("heading", { name: /small steps\. real progress\./i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/share what you're learning, building, fixing and winning/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /start your trail/i })).toHaveAttribute("href", "/register");
    expect(screen.getByRole("link", { name: /explore community/i })).toHaveAttribute("href", "#community");
  });
});
```

Run:

```bash
npm test -- src/components/marketing/hero-section.test.tsx
```

Expected: FAIL because `HeroSection` does not exist.

- [ ] **Step 2: Implement the reusable ProgressCard**

Create `client/src/components/marketing/progress-card.tsx`:

```tsx
import { MessageCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type ProgressStatus = "LEARNING" | "BUILDING" | "STUCK" | "WIN";

type ProgressCardProps = {
  status: ProgressStatus;
  title: string;
  body?: string;
  author: string;
  sparks: number;
  comments: number;
  tags?: string[];
  compact?: boolean;
};

const statusSymbol: Record<ProgressStatus, string> = {
  LEARNING: "↗",
  BUILDING: "◆",
  STUCK: "○",
  WIN: "✦",
};

export function ProgressCard({
  status,
  title,
  body,
  author,
  sparks,
  comments,
  tags = [],
  compact = false,
}: ProgressCardProps) {
  return (
    <article
      className={cn(
        "rounded-[2rem] border border-border bg-surface p-5 shadow-[0_18px_60px_rgba(17,17,17,0.08)]",
        compact ? "max-w-[18rem]" : "max-w-[34rem]",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <span className="rounded-full bg-lime px-3 py-1 text-[0.7rem] font-semibold tracking-[0.12em] text-ink">
          {statusSymbol[status]} {status}
        </span>
        <span className="text-xs text-muted">@{author}</span>
      </div>
      <h2 className="font-[var(--font-display)] text-xl font-semibold tracking-[-0.04em] text-ink">
        {title}
      </h2>
      {!compact && body ? <p className="mt-3 text-sm leading-6 text-muted">{body}</p> : null}
      {tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
          {tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>
      ) : null}
      <div className="mt-5 flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5"><Zap className="size-3.5" />{sparks}</span>
        <span className="inline-flex items-center gap-1.5"><MessageCircle className="size-3.5" />{comments}</span>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Implement the marketing header**

Create `client/src/components/marketing/marketing-header.tsx`:

```tsx
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";

const navItems = [
  ["How it works", "#how-it-works"],
  ["Community", "#community"],
  ["Why SparkTrail", "#why-sparktrail"],
] as const;

export function MarketingHeader() {
  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
      <Link href="/" aria-label="SparkTrail home"><BrandMark /></Link>
      <nav className="hidden items-center gap-8 text-sm text-muted md:flex" aria-label="Primary navigation">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href} className="transition hover:text-ink">{label}</Link>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <Link href="/login" className="hidden text-sm font-medium text-ink sm:inline">Log in</Link>
        <Link href="/register" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-white">
          Start your trail <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
}
```

- [ ] **Step 4: Implement the hero without animation**

Create `client/src/components/marketing/hero-section.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProgressCard } from "./progress-card";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 pb-24 pt-14 md:px-8 md:pb-32 md:pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="mb-5 text-xs font-semibold tracking-[0.18em] text-muted">PROGRESS, WITHOUT THE NOISE</p>
          <h1 className="max-w-3xl font-[var(--font-display)] text-5xl font-semibold leading-[0.94] tracking-[-0.065em] text-ink sm:text-6xl lg:text-8xl">
            Small steps.<br />Real progress.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-muted sm:text-lg">
            Share what you're learning, building, fixing and winning — without the noise of traditional social media.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/register" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-medium text-white">
              Start your trail <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="#community" className="inline-flex min-h-12 items-center rounded-full border border-border bg-surface px-6 text-sm font-medium text-ink">
              Explore community
            </Link>
          </div>
        </div>

        <div className="relative min-h-[34rem]" aria-label="SparkTrail progress examples">
          <div className="absolute left-1/2 top-1/2 z-20 w-[min(100%,34rem)] -translate-x-1/2 -translate-y-1/2 rotate-[-2deg]">
            <ProgressCard
              status="BUILDING"
              title="Authentication finally works."
              body="Connected my Express API to PostgreSQL and got protected routes working today."
              author="sarahcodes"
              sparks={126}
              comments={18}
              tags={["nextjs", "nodejs"]}
            />
          </div>
          <div className="absolute right-0 top-4 z-30 rotate-[6deg]">
            <ProgressCard status="WIN" title="Shipped v1.0" author="mika" sparks={48} comments={7} compact />
          </div>
          <div className="absolute bottom-3 left-0 z-10 rotate-[-6deg]">
            <ProgressCard status="LEARNING" title="Understanding server actions" author="noor" sparks={31} comments={5} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Move the public root page into the marketing route group**

Create `client/src/app/(marketing)/layout.tsx`:

```tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

Create `client/src/app/(marketing)/page.tsx`:

```tsx
import { HeroSection } from "@/components/marketing/hero-section";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <MarketingHeader />
      <HeroSection />
    </main>
  );
}
```

Delete `client/src/app/page.tsx` to avoid two components resolving to `/`.

- [ ] **Step 6: Replace the smoke test with the marketing-page smoke test**

Create `client/src/app/(marketing)/page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import HomePage from "./page";

describe("marketing home page", () => {
  it("renders the product name and tagline", () => {
    render(<HomePage />);
    expect(screen.getByText("SparkTrail")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /small steps\. real progress\./i })).toBeInTheDocument();
  });
});
```

Remove the previous `client/src/app/page.test.tsx`.

- [ ] **Step 7: Run the focused and full checks**

Run:

```bash
npm test -- src/components/marketing/hero-section.test.tsx
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: build SparkTrail marketing hero"
```

---

### Task 5: Add Authentication Route Shells Without Backend Logic

**Files:**
- Create: `client/src/app/(auth)/layout.tsx`
- Create: `client/src/app/(auth)/login/page.tsx`
- Create: `client/src/app/(auth)/register/page.tsx`
- Create: `client/src/app/(auth)/onboarding/page.tsx`
- Create: `client/src/app/(auth)/auth-pages.test.tsx`

**Interfaces:**
- Produces: public route shells that later auth integration can replace without changing route paths.
- No form submits to an API in this task.

- [ ] **Step 1: Write the failing route-shell tests**

Create `client/src/app/(auth)/auth-pages.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import LoginPage from "./login/page";
import RegisterPage from "./register/page";
import OnboardingPage from "./onboarding/page";

describe("auth route shells", () => {
  it("renders login", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
  });

  it("renders registration", () => {
    render(<RegisterPage />);
    expect(screen.getByRole("heading", { name: /start your trail/i })).toBeInTheDocument();
  });

  it("renders onboarding", () => {
    render(<OnboardingPage />);
    expect(screen.getByRole("heading", { name: /make sparktrail yours/i })).toBeInTheDocument();
  });
});
```

Run:

```bash
npm test -- src/app/'(auth)'/auth-pages.test.tsx
```

Expected: FAIL because the pages do not exist.

- [ ] **Step 2: Implement a shared auth layout**

Create `client/src/app/(auth)/layout.tsx`:

```tsx
import Link from "next/link";
import { BrandMark } from "@/components/ui/brand-mark";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background px-5 py-5 sm:px-8">
      <Link href="/" aria-label="SparkTrail home"><BrandMark /></Link>
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl place-items-center py-10">
        {children}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Implement the static login page**

Create `client/src/app/(auth)/login/page.tsx`:

```tsx
import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="w-full max-w-md rounded-[2rem] border border-border bg-surface p-7 sm:p-9">
      <p className="text-xs font-semibold tracking-[0.16em] text-muted">SIGN IN</p>
      <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em]">Welcome back.</h1>
      <p className="mt-3 text-sm leading-6 text-muted">Pick up where your trail left off.</p>
      <div className="mt-8 rounded-2xl bg-background p-4 text-sm text-muted">Interactive form arrives with the authentication implementation phase.</div>
      <p className="mt-6 text-sm text-muted">New here? <Link href="/register" className="font-medium text-ink underline underline-offset-4">Start your trail</Link></p>
    </section>
  );
}
```

- [ ] **Step 4: Implement the static register page**

Create `client/src/app/(auth)/register/page.tsx`:

```tsx
import Link from "next/link";

export default function RegisterPage() {
  return (
    <section className="w-full max-w-md rounded-[2rem] border border-border bg-surface p-7 sm:p-9">
      <p className="text-xs font-semibold tracking-[0.16em] text-muted">JOIN SPARKTRAIL</p>
      <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em]">Start your trail.</h1>
      <p className="mt-3 text-sm leading-6 text-muted">Create an account to share what you are learning, building, fixing and winning.</p>
      <div className="mt-8 rounded-2xl bg-background p-4 text-sm text-muted">Interactive form arrives with the authentication implementation phase.</div>
      <p className="mt-6 text-sm text-muted">Already have an account? <Link href="/login" className="font-medium text-ink underline underline-offset-4">Log in</Link></p>
    </section>
  );
}
```

- [ ] **Step 5: Implement the static onboarding page**

Create `client/src/app/(auth)/onboarding/page.tsx`:

```tsx
export default function OnboardingPage() {
  return (
    <section className="w-full max-w-2xl rounded-[2rem] border border-border bg-surface p-7 sm:p-10">
      <p className="text-xs font-semibold tracking-[0.16em] text-muted">WELCOME</p>
      <h1 className="mt-3 font-[var(--font-display)] text-4xl font-semibold tracking-[-0.05em]">Make SparkTrail yours.</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">Avatar, current focus, interests and creator suggestions will be configured here after authentication is connected.</p>
    </section>
  );
}
```

- [ ] **Step 6: Run tests, lint, and build**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add SparkTrail auth route shells"
```

---

### Task 6: Build the Responsive Authenticated App Shell With Mock Data

**Files:**
- Create: `client/src/app/(app)/layout.tsx`
- Create: `client/src/app/(app)/feed/page.tsx`
- Create: `client/src/app/(app)/explore/page.tsx`
- Create: `client/src/app/(app)/create/page.tsx`
- Create: `client/src/app/(app)/notifications/page.tsx`
- Create: `client/src/app/(app)/saved/page.tsx`
- Create: `client/src/app/(app)/profile/page.tsx`
- Create: `client/src/app/(app)/profile/edit/page.tsx`
- Create: `client/src/app/(app)/u/[username]/page.tsx`
- Create: `client/src/app/(app)/post/[id]/page.tsx`
- Create: `client/src/components/app-shell/app-sidebar.tsx`
- Create: `client/src/components/app-shell/mobile-bottom-nav.tsx`
- Create: `client/src/components/app-shell/right-rail.tsx`
- Create: `client/src/components/app-shell/app-shell.test.tsx`

**Interfaces:**
- `AppSidebar` renders desktop primary navigation.
- `MobileBottomNav` renders Home / Explore / Create / Alerts / Profile navigation.
- `RightRail` renders mock trail stats and discovery content only; backend data arrives in a later plan.

- [ ] **Step 1: Write the failing navigation test**

Create `client/src/components/app-shell/app-shell.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { AppSidebar } from "./app-sidebar";
import { MobileBottomNav } from "./mobile-bottom-nav";

describe("authenticated app navigation", () => {
  it("exposes core desktop destinations", () => {
    render(<AppSidebar />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/feed");
    expect(screen.getByRole("link", { name: /explore/i })).toHaveAttribute("href", "/explore");
    expect(screen.getByRole("link", { name: /saved/i })).toHaveAttribute("href", "/saved");
  });

  it("exposes the five mobile actions", () => {
    render(<MobileBottomNav />);
    expect(screen.getAllByRole("link")).toHaveLength(5);
    expect(screen.getByRole("link", { name: /alerts/i })).toHaveAttribute("href", "/notifications");
  });
});
```

Run:

```bash
npm test -- src/components/app-shell/app-shell.test.tsx
```

Expected: FAIL because the shell components do not exist.

- [ ] **Step 2: Implement the desktop sidebar**

Create `client/src/components/app-shell/app-sidebar.tsx`:

```tsx
import Link from "next/link";
import { Bell, Bookmark, Compass, Home, Plus, UserRound } from "lucide-react";
import { BrandMark } from "@/components/ui/brand-mark";

const items = [
  ["Home", "/feed", Home],
  ["Explore", "/explore", Compass],
  ["Create", "/create", Plus],
  ["Alerts", "/notifications", Bell],
  ["Saved", "/saved", Bookmark],
  ["Profile", "/profile", UserRound],
] as const;

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-background px-5 py-6 lg:block">
      <BrandMark />
      <nav className="mt-10 space-y-1" aria-label="App navigation">
        {items.map(([label, href, Icon]) => (
          <Link key={href} href={href} className="flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-medium text-muted transition hover:bg-black/[0.04] hover:text-ink">
            <Icon className="size-4" aria-hidden="true" />{label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 3: Implement the mobile bottom navigation**

Create `client/src/components/app-shell/mobile-bottom-nav.tsx`:

```tsx
import Link from "next/link";
import { Bell, Compass, Home, Plus, UserRound } from "lucide-react";

const items = [
  ["Home", "/feed", Home],
  ["Explore", "/explore", Compass],
  ["Create", "/create", Plus],
  ["Alerts", "/notifications", Bell],
  ["Profile", "/profile", UserRound],
] as const;

export function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-around rounded-full border border-border bg-surface/95 px-2 py-2 shadow-[0_18px_50px_rgba(17,17,17,.12)] backdrop-blur lg:hidden" aria-label="Mobile navigation">
      {items.map(([label, href, Icon]) => (
        <Link key={href} href={href} aria-label={label} className="grid min-h-11 min-w-11 place-items-center rounded-full text-muted hover:bg-background hover:text-ink">
          <Icon className="size-5" aria-hidden="true" />
        </Link>
      ))}
    </nav>
  );
}
```

- [ ] **Step 4: Implement the right rail**

Create `client/src/components/app-shell/right-rail.tsx`:

```tsx
export function RightRail() {
  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 border-l border-border px-6 py-8 xl:block">
      <section>
        <p className="text-xs font-semibold tracking-[0.15em] text-muted">YOUR TRAIL</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[['Trails', '12'], ['Sparks', '248'], ['Followers', '18']].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-border bg-surface p-3">
              <strong className="block text-lg text-ink">{value}</strong>
              <span className="text-[0.7rem] text-muted">{label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <p className="text-xs font-semibold tracking-[0.15em] text-muted">TRENDING</p>
        <div className="mt-4 space-y-3 text-sm text-muted">
          <p>#nextjs</p><p>#design</p><p>#buildinpublic</p>
        </div>
      </section>
    </aside>
  );
}
```

- [ ] **Step 5: Implement the protected app layout shell**

Create `client/src/app/(app)/layout.tsx`:

```tsx
import { AppSidebar } from "@/components/app-shell/app-sidebar";
import { MobileBottomNav } from "@/components/app-shell/mobile-bottom-nav";
import { RightRail } from "@/components/app-shell/right-rail";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background lg:flex">
      <AppSidebar />
      <section className="min-w-0 flex-1 pb-24 lg:pb-0">{children}</section>
      <RightRail />
      <MobileBottomNav />
    </main>
  );
}
```

This layout is visually protected but not auth-protected yet; real middleware/session enforcement belongs to the authentication plan.

- [ ] **Step 6: Add the protected route shells**

Create `client/src/app/(app)/feed/page.tsx`:

```tsx
export default function FeedPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-7">
      <p className="text-xs font-semibold tracking-[0.15em] text-muted">HOME</p>
      <h1 className="mt-2 font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">Your feed</h1>
      <div className="mt-8 rounded-[2rem] border border-dashed border-border bg-surface p-8 text-sm text-muted">Feed data will connect to the Express API in a later implementation plan.</div>
    </div>
  );
}
```

Create `client/src/app/(app)/explore/page.tsx`:

```tsx
export default function ExplorePage() {
  return <div className="mx-auto max-w-4xl px-5 py-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">Explore</h1></div>;
}
```

Create `client/src/app/(app)/create/page.tsx`:

```tsx
export default function CreatePage() {
  return <div className="mx-auto max-w-2xl px-5 py-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">Share progress</h1></div>;
}
```

Create `client/src/app/(app)/notifications/page.tsx`:

```tsx
export default function NotificationsPage() {
  return <div className="mx-auto max-w-2xl px-5 py-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">Notifications</h1></div>;
}
```

Create `client/src/app/(app)/saved/page.tsx`:

```tsx
export default function SavedPage() {
  return <div className="mx-auto max-w-2xl px-5 py-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">Saved</h1></div>;
}
```

Create `client/src/app/(app)/profile/page.tsx`:

```tsx
export default function ProfilePage() {
  return <div className="mx-auto max-w-3xl px-5 py-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">Your profile</h1></div>;
}
```

Create `client/src/app/(app)/profile/edit/page.tsx`:

```tsx
export default function EditProfilePage() {
  return <div className="mx-auto max-w-2xl px-5 py-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">Edit profile</h1></div>;
}
```

Create `client/src/app/(app)/u/[username]/page.tsx`:

```tsx
export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return <div className="mx-auto max-w-3xl px-5 py-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">@{username}</h1></div>;
}
```

Create `client/src/app/(app)/post/[id]/page.tsx`:

```tsx
export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div className="mx-auto max-w-2xl px-5 py-8"><h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-[-0.04em]">Post {id}</h1></div>;
}
```

- [ ] **Step 7: Run tests and production checks**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass and all shell routes compile.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add responsive SparkTrail app shell"
```

---

### Task 7: Add Isolated Animation Infrastructure for the Marketing Site

**Files:**
- Modify: `client/package.json`
- Create: `client/src/lib/animation/gsap.ts`
- Create: `client/src/lib/animation/lenis.tsx`
- Create: `client/src/lib/animation/lenis.test.tsx`
- Modify: `client/src/app/(marketing)/layout.tsx`
- Modify: `client/src/components/marketing/hero-section.tsx`

**Interfaces:**
- `SmoothScrollProvider({ children })` provides Lenis only on marketing routes.
- `gsap.ts` exports configured `gsap` and `ScrollTrigger` for client components.
- The hero gains a simple entrance sequence only; the signature pinned Trail Journey is intentionally deferred to the dedicated landing-polish plan.

- [ ] **Step 1: Install animation dependencies**

Run from `client/`:

```bash
npm install gsap lenis motion
```

- [ ] **Step 2: Write the failing SmoothScrollProvider fallback test**

Create `client/src/lib/animation/lenis.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { SmoothScrollProvider } from "./lenis";

describe("SmoothScrollProvider", () => {
  it("always renders its children", () => {
    render(
      <SmoothScrollProvider>
        <span>Marketing content</span>
      </SmoothScrollProvider>,
    );

    expect(screen.getByText("Marketing content")).toBeInTheDocument();
  });
});
```

Run:

```bash
npm test -- src/lib/animation/lenis.test.tsx
```

Expected: FAIL because the provider does not exist.

- [ ] **Step 3: Create the GSAP registration helper**

Create `client/src/lib/animation/gsap.ts`:

```ts
"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
```

- [ ] **Step 4: Implement marketing-only Lenis provider with reduced-motion protection**

Create `client/src/lib/animation/lenis.tsx`:

```tsx
"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return children;
}
```

- [ ] **Step 5: Scope Lenis to the marketing route group**

Update `client/src/app/(marketing)/layout.tsx`:

```tsx
import { SmoothScrollProvider } from "@/lib/animation/lenis";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
```

- [ ] **Step 6: Add a minimal GSAP hero entrance without scroll-pinning**

Convert `client/src/components/marketing/hero-section.tsx` to a client component by adding:

```tsx
"use client";
```

Add imports:

```tsx
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/animation/gsap";
```

Add a root ref and the effect inside `HeroSection`:

```tsx
const root = useRef<HTMLElement>(null);

useLayoutEffect(() => {
  if (!root.current) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = gsap.context(() => {
    gsap.from("[data-hero-reveal]", {
      y: 24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out",
    });

    gsap.from("[data-hero-card]", {
      y: 34,
      opacity: 0,
      rotate: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      delay: 0.25,
    });
  }, root);

  return () => ctx.revert();
}, []);
```

Attach `ref={root}` to the hero `<section>`, `data-hero-reveal` to the eyebrow/heading/body/button group elements, and `data-hero-card` to each of the three positioned progress-card wrappers.

- [ ] **Step 7: Run tests, lint, and build**

Run:

```bash
npm test
npm run lint
npm run build
```

Expected: all pass. The marketing page uses Lenis/GSAP; app routes do not import them.

- [ ] **Step 8: Manually verify reduced motion and responsive behavior**

Run:

```bash
npm run dev
```

Check:

```text
Desktop:
[ ] Hero layout remains readable at >= 1280px.
[ ] Cards animate once on first render.
[ ] Scrolling remains smooth but controllable.

Mobile:
[ ] Hero cards do not overflow horizontally.
[ ] CTA buttons remain reachable.
[ ] No pinned/scroll-heavy behavior exists yet.

Reduced motion:
[ ] Enable OS/browser Reduce Motion.
[ ] Reload `/`.
[ ] Content appears immediately without Lenis or GSAP entrance movement.
```

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "feat: add marketing animation foundation"
```

---

### Task 8: Foundation Quality Gate and Handoff to Backend Planning

**Files:**
- Modify: `README.md`
- Create: `docs/foundation-verification.md`

**Interfaces:**
- Consumes: all deliverables from Tasks 1–7.
- Produces: a verified frontend foundation ready for the Express/Prisma/auth implementation plan.

- [ ] **Step 1: Run the complete frontend quality gate**

Run from `client/`:

```bash
npm test
npm run lint
npm run build
```

Expected: every command exits with status `0`.

- [ ] **Step 2: Verify route compilation manually**

Run:

```bash
npm run dev
```

Open and verify:

```text
/
/login
/register
/onboarding
/feed
/explore
/create
/notifications
/saved
/profile
/profile/edit
/u/demo-user
/post/demo-post
```

Expected: every route renders without a runtime exception.

- [ ] **Step 3: Record the verification evidence**

Create `docs/foundation-verification.md`:

```markdown
# SparkTrail Foundation Verification

## Automated checks
- `npm test`: PASS
- `npm run lint`: PASS
- `npm run build`: PASS

## Route smoke checks
- `/`: PASS
- `/login`: PASS
- `/register`: PASS
- `/onboarding`: PASS
- `/feed`: PASS
- `/explore`: PASS
- `/create`: PASS
- `/notifications`: PASS
- `/saved`: PASS
- `/profile`: PASS
- `/profile/edit`: PASS
- `/u/demo-user`: PASS
- `/post/demo-post`: PASS

## Responsive checks
- Marketing hero desktop: PASS
- Marketing hero mobile: PASS
- App desktop shell: PASS
- App mobile navigation: PASS
- Reduced-motion behavior: PASS

## Deferred by design
- Express API
- PostgreSQL/Prisma
- Real authentication
- Cloudinary uploads
- Feed data
- Socket.IO notifications
- Signature pinned Trail Journey
```

Do not mark an item PASS until it has actually been checked.

- [ ] **Step 4: Update README with local frontend commands**

Append:

```markdown
## Frontend development

```bash
cd client
npm install
npm run dev
```

Quality checks:

```bash
npm test
npm run lint
npm run build
```
```

- [ ] **Step 5: Commit the verified foundation**

Run from repository root:

```bash
git add README.md docs/foundation-verification.md
git commit -m "docs: verify SparkTrail frontend foundation"
```

---

## Subsequent Plans

This plan intentionally stops at a working, testable frontend foundation. The approved product spec spans multiple independent subsystems, so the remaining implementation must be planned separately rather than hidden inside one oversized checklist.

The next plans, in order, are:

1. `SparkTrail Express + Prisma Foundation` — Express server, environment validation, Prisma schema, PostgreSQL/Neon, API error contract, health endpoint, tests.
2. `SparkTrail Authentication + Profiles` — register/login/logout, HttpOnly cookie JWT, `/auth/me`, short-lived socket token, profile editing, Cloudinary avatar flow, route protection.
3. `SparkTrail Social Core` — post CRUD, statuses/tags/media, sparks, comments, follow/unfollow, bookmarks, authorization, cursor pagination, TanStack Query integration.
4. `SparkTrail Feed + Explore + Realtime` — following feed, discovery fallback, Explore views, persistent notifications, Socket.IO private rooms, unread state, optimistic UI.
5. `SparkTrail Landing Polish + QA + Deployment` — full 12-section landing page, signature pinned Trail Journey, dark/light transitions, accessibility/performance audits, Vercel/Render/Neon/Cloudinary deployment, README/CodeAlpha demo polish.

Each later plan must repeat the TDD/test/commit pattern and must preserve the interfaces and constraints established here.
