# SparkTrail

> Small steps. Real progress.

SparkTrail is an editorial progress journal for creators, developers, and builders. Instead of broadcasting polished outcomes on noisy social networks, SparkTrail helps you document your raw journey in public, milestone by milestone.

[Live Demo](https://spark-trail-one.vercel.app/) &bull; [Repository](https://github.com/MuneebxNick/spark-trail)

---

## Overview

Traditional social platforms reward engagement bait, vanity metrics, and finished highlights. They discourage sharing the messy middle: the bugs, the rabbit holes, the pivots, and the incremental breakthroughs.

SparkTrail reimagines building in public around **Trails**:
- A **Trail** represents an ongoing journey or project.
- **Trail Entries** capture specific moments categorized by milestone statuses: `LEARNING`, `BUILDING`, `STUCK`, and `WIN`.
- The community can follow creators, leave thoughtful comments, and give **Sparks** to acknowledge real effort.

---

## Key Features

### Journey Tracking
- **Trails Management**: Create, edit, and categorize projects. Choose between public sharing and private journaling.
- **Timeline Entries**: Post milestone updates with contextual tags (`LEARNING`, `BUILDING`, `STUCK`, `WIN`).
- **Media Uploads**: Attach reference screenshots and progress photos powered by Cloudinary.

### Community & Engagement
- **Explore Feed**: Discover ongoing trails across the community, filterable by category and status.
- **Sparks**: Light a spark on trails to encourage creators without vanity follower counts.
- **Discussion**: Threaded comments on trails for feedback and peer troubleshooting.
- **Follow System**: Follow builders to track their evolving work over time.

### In-App Notifications
- Real-time notification layer alerting users to new sparks, comments, and followers.
- Dedicated notification drawer with instant read/unread tracking and modal scroll-lock protection.

### Identity & Preferences
- **Public Profiles**: Showcase all public trails, recent milestone entries, and follower networks.
- **Account Settings**: Update profile bio, change username, and upload custom avatars.
- **Theme Toggle**: Cohesive Light and Dark modes with flash-free hydration scripts.
- **Cinematic Route Transitions**: Coordinated page transitions with vertical curtain sweeps and motion-reduced accessibility.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions)
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Motion & Scrolling**: Framer Motion, GSAP, Lenis Smooth Scroll
- **Database & ORM**: PostgreSQL (hosted on Neon Serverless), Prisma ORM
- **Authentication**: Stateless HttpOnly JWT cookies via `jose` and `bcryptjs`
- **Media Storage**: Cloudinary SDK
- **Validation**: Zod with React Hook Form
- **Deployment**: Vercel

---

## Technical Highlights

- **Stateless Authentication**: Sessions are signed and verified using JWTs via `jose`, stored in secure, HttpOnly, SameSite cookies. Passwords are salted and hashed with `bcryptjs`.
- **Server Actions Architecture**: Data mutations are executed through type-safe Server Actions with strict input validation via Zod and server-side authorization checks.
- **Data Protection**: Sensitive credentials such as password hashes are strictly filtered out at the query level using Prisma select projections.
- **Database Connection Management**: A singleton Prisma Client instance prevents connection exhaustion in serverless environments when communicating with Neon.
- **Cursor-Based Pagination**: Feed queries use cursor pagination for scalable timeline loading.
- **Synchronized Route Transitions**: Custom route transition system coordinates exit animations, Server Component streaming, and atomic DOM commits before lifting the transition curtain.

---

## Getting Started

### Prerequisites
- Node.js 18.18 or later
- PostgreSQL database instance (such as Neon)
- Cloudinary account for media uploads

### 1. Clone the Repository
```bash
git clone https://github.com/MuneebxNick/spark-trail.git
cd spark-trail
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on `.env.example`:
```bash
cp .env.example .env
```

Configure the following environment variables:
- `DATABASE_URL`: Pooled connection URL for serverless PostgreSQL queries (Neon)
- `DIRECT_URL`: Direct PostgreSQL connection URL for Prisma migrations
- `JWT_SECRET`: Random string of at least 32 characters for signing JWT session tokens
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret

### 4. Database Setup
Push the Prisma schema to your database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Generates the Prisma Client and compiles the production Next.js application.
- `npm run start`: Runs the compiled production server.
- `npm run lint`: Runs ESLint across the codebase.
- `npm run test`: Runs unit and component tests with Vitest.

---

## Database Schema

SparkTrail uses PostgreSQL managed via Prisma ORM:
- `User`: User accounts, authentication credentials, avatar, and bio
- `Follows`: Self-referential join table for following and follower relationships
- `Trail`: Project containers with title, description, category, and status
- `TrailEntry`: Individual timeline posts tagged by progress status
- `Spark`: Appreciation records unique per user and trail
- `Comment`: User comments on specific trails
- `Notification`: Activity records linking actors, recipients, and relevant entities

---

## Deployment

SparkTrail is deployed in production on Vercel:
- Production URL: [https://spark-trail-one.vercel.app/](https://spark-trail-one.vercel.app/)

When deploying to Vercel:
1. Connect the GitHub repository to your Vercel project.
2. Define `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the project settings.
3. The build command `prisma generate && next build` will automatically run on every push to `main`.

---

## Security

- **Password Hashing**: User passwords are encrypted with bcrypt before being written to the database.
- **Session Protection**: Session tokens are stored in HttpOnly, SameSite cookies to protect against cross-site scripting (XSS) attacks.
- **Access Control**: Every mutation checks ownership (`resource.userId === authenticatedUser.id`) on the server before modifying records.
- **Input Validation**: All payloads sent to Server Actions are validated against strict Zod schemas.

---

## Future Improvements

- Full-text search and tag discovery for trails
- Markdown and code block syntax support in trail entries
- Export tools for trails (PDF or Markdown archive)
- Activity heatmaps and streaks on profile pages
- Accessibility and keyboard navigation enhancements

---

## Repository

- Project repository: [https://github.com/MuneebxNick/spark-trail](https://github.com/MuneebxNick/spark-trail)
