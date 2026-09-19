# SPARKTRAIL PRODUCT & DESIGN RULEBOOK

> **Version:** 1.0  
> **Scope:** All core product features, user interfaces, animations, and database operations.

This rulebook is the authoritative guide for all current and future development on SparkTrail. Every developer and AI assistant contributing to this codebase must adhere strictly to these principles.

---

## 1. BRAND & VISUAL DIRECTION
- **Editorial & Cinematic:** SparkTrail is built around visual storytelling and progress as a journey. It must feel premium, intentional, and calm.
- **Landing-to-App Continuity:** Authenticated product pages must feel like a seamless, natural continuation of the landing page aesthetic.
- **Anti-Admin Aesthetic:** Never build generic SaaS dashboards, admin panels, dense data tables, or generic CRUD grids.
- **Design Fundamentals First:** Prioritize typography, whitespace, layout composition, hierarchy, and subtle contrast over flashy visual effects.

---

## 2. TYPOGRAPHY HIERARCHY
- **Display & Headings:** `Space Grotesk` (`var(--font-heading)`) — used for page headers, section titles, progress stage labels, and major callouts.
- **Body & Interface:** `Inter` (`var(--font-body)`) — used for body text, form labels, badges, buttons, and meta information.
- **Hierarchy Integrity:** Maintain existing type scale and line-heights. Do not add arbitrary font families or random font weights.

---

## 3. COLOR SYSTEM
Respect the core SparkTrail color palette:
- **Light Surface:** `#F6F5EF`
- **Dark Surface:** `#0D0E10`
- **Secondary Dark Surface:** `#16171A`
- **Electric Violet (Primary Accent):** `#7857FF`
- **Spark Lime (Highlight Accent):** `#C7FF3D`
- **Text & Borders:** High-contrast neutral text (`#111111` in light, `#FFFFFF` in dark) with subtle hairline borders (`border-[#111111]/[0.08]` light, `border-white/10` dark).

*Do not introduce arbitrary secondary accent colors (like random blues, pinks, or bright reds) unless representing explicit status states.*

---

## 4. COMPONENT & LAYOUT STYLE
- **Spacious & Uncluttered:** Use generous padding, clean section dividers (`<hr className="border-[#111111]/[0.08] dark:border-white/10" />`), and intentional layout grids.
- **Purposeful Cards:** Use cards only when grouping cohesive progress content. Avoid dense card walls.
- **Avoid Clichés:** No heavy drop shadows, no giant color blobs, no aggressive glassmorphism overlays, no unnecessary 3D elements, and no tacky AI-generated graphics.

---

## 5. ANIMATION RULES
Animations must improve user understanding and polish, never serve as decorative fluff.

- **When to Animate:** Use motion for content reveals, establishing visual hierarchy, communicating navigation direction, and giving subtle interactive feedback.
- **Tech Stack:** Use Framer Motion, GSAP ScrollTrigger, and Lenis smooth scrolling. Reuse existing components (`StaggerContainer`, `StaggerItem`, `PageTransition`, `MagneticButton`).
- **Restrained Motion:** Prefer subtle opacity fades and short vertical translation (`y: 10px` to `0px`). Avoid wild scaling, spinning, or bouncy keyframes.
- **Pacing:** Keep transitions visible yet snappy (300ms–600ms). Never block or slow down user workflow.
- **Accessibility:** Always respect `prefers-reduced-motion`.

---

## 6. ROUTE TRANSITIONS
- **Unified Architecture:** All in-app navigation must use `TransitionLink` and `useRouteTransition` from `RouteTransitionProvider`.
- **Cinematic Flow:** Use the existing vertical curtain sweep for page transitions.
- **Native Scroll Integrity:** Do not hijack native window scroll, lock scrolling globally, or introduce fake loaders/artificial delays.

---

## 7. PAGE ENTRANCE ANIMATIONS
- Wrap page content in `StaggerContainer` and individual blocks in `StaggerItem`.
- Entrance motion should be subtle, staggered, and elegant, matching the hero reveal flow.

---

## 8. RESPONSIVENESS
- Build fully responsive layouts using Tailwind CSS breakpoints (`sm:`, `md:`, `lg:`).
- Ensure interfaces remain readable and touch-friendly on mobile viewports.

---

## 9. FUNCTIONALITY FIRST & HONESTY
- Never display fake user activity, dummy metric counts, or synthetic comments in the authenticated product to make it look "full."
- Present clean, encouraging, editorial empty states when database records do not exist yet.

---

## 10. DATABASE & BACKEND ARCHITECTURE
- **Single Source of Truth:** Use Prisma Client with PostgreSQL (Neon serverless driver).
- **Server Actions:** Use Server Actions located in `actions/` for all mutations.
- **Data Protection:** Never leak sensitive fields (e.g., `passwordHash`). Always select explicit fields in queries.

---

## 11. SECURITY & AUTHORIZATION
- **Server-Side Verification:** Always check authentication (`requireAuth()` or `verifySession()`) inside Server Actions and Server Components.
- **Ownership Verification:** Always verify that `resource.userId === authenticatedUser.id` before executing updates or deletes.
- **Input Validation:** Parse all incoming action payloads with Zod schemas.

---

## 12. CODE QUALITY & ARCHITECTURE
- Keep server actions, validation schemas, and UI components decoupled in their respective directories (`actions/`, `lib/validations/`, `components/`, `app/`).
- Reuse existing components before creating duplicates.
- Do not modify working, unrelated features or the landing page unless explicitly requested.

---

## 13. SPARKTRAIL PRODUCT PHILOSOPHY
> **"Progress has a story."**

SparkTrail is not a task manager or project tracker. It is a progress journal for creators and builders.
- Trails represent continuous journeys, not closed tickets.
- Trail entries represent meaningful milestone moments (`LEARNING`, `BUILDING`, `STUCK`, `WIN`).
- The UI should promote reflection, clarity, and building in public.
