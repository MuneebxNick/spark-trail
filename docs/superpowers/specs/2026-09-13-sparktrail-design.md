# SparkTrail — Product & Technical Design Specification

**Date:** 2026-09-13  
**Project:** CodeAlpha Full Stack Web Development Internship Task 2  
**Product:** SparkTrail — a progress-first social platform  
**Status:** Design approved for implementation planning

## 1. Product Vision

SparkTrail is a social platform centered on sharing small, meaningful progress rather than polished final outcomes. Users can document what they are learning, building, struggling with, and completing, while following other creators and receiving real-time social feedback.

The project must feel distinct from Facebook, Instagram, and X. Its identity is based on progress trails, status-driven posts, focus areas, and a calmer, more intentional community experience.

### Core positioning

- **Tagline:** Small steps. Real progress.
- **Primary user value:** Share ongoing progress without the noise of traditional social media.
- **Primary content model:** Progress posts categorized as `LEARNING`, `BUILDING`, `STUCK`, or `WIN`.
- **Primary social model:** Follow creators, spark/like posts, comment, save, and receive real-time notifications.

## 2. Visual Direction

SparkTrail uses a **hybrid light + dark premium aesthetic**.

### Design language

- Warm off-white primary marketing background.
- Near-black typography.
- Controlled lime and violet accents.
- Large whitespace and editorial layout.
- Dark immersive sections used strategically rather than everywhere.
- Minimal borders, subtle shadows, clean card hierarchy.
- No generic glassmorphism-heavy SaaS look.
- No Instagram-style copied feed composition.

### Design tokens

- Light background: `#F6F5EF`
- Surface: `#FFFFFF`
- Primary ink: `#111111`
- Muted text: `#737373`
- Spark lime: `#C7FF3D`
- Electric violet: `#7857FF`
- Dark surface: `#101113`
- Border: `rgba(17,17,17,.10)`

### Typography

- Display/headings: Space Grotesk or Manrope
- Body/UI: Inter
- Optional editorial accent: Instrument Serif

## 3. Frontend Technology

### Framework

- Next.js using the App Router
- TypeScript
- Tailwind CSS

### UI and interaction

- shadcn/ui with Radix primitives
- Lucide React icons
- Motion / Framer Motion for app micro-interactions
- GSAP for cinematic landing-page animation
- GSAP ScrollTrigger for scroll-linked storytelling
- Lenis for smooth marketing-page scrolling
- TanStack Query for server state and caching
- Zustand for lightweight client state
- React Hook Form + Zod for forms
- Native fetch through a typed API wrapper
- Sonner/custom UI for toast and notification feedback

## 4. Backend Technology

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL hosted on Neon
- JWT-based authentication with HttpOnly cookies
- bcrypt for password hashing
- Zod for request validation
- Helmet for security headers
- CORS with explicit frontend origin
- Rate limiting on sensitive endpoints
- Cloudinary for avatar and post media
- Socket.IO for authenticated real-time notifications

## 5. Deployment Architecture

- Next.js frontend: Vercel
- Express API + Socket.IO: Render or equivalent free Node hosting
- PostgreSQL: Neon free tier
- Media: Cloudinary free tier
- Source control: GitHub

The frontend and backend remain separate deployments so the internship evaluator can clearly identify the frontend, backend, database, and real-time layers.

## 6. Application Route Architecture

### Public routes

- `/` — marketing landing page
- `/login`
- `/register`
- `/onboarding`

### Protected routes

- `/feed`
- `/explore`
- `/create`
- `/notifications`
- `/saved`
- `/profile`
- `/profile/edit`
- `/u/[username]`
- `/post/[id]`

## 7. Landing Page Experience

The marketing site communicates the product within the first five seconds and uses premium motion without sacrificing performance.

### Sections

1. Minimal navbar
2. Cinematic hero
3. Community/social proof strip
4. Progress story introduction
5. Signature pinned Trail Journey
6. Interactive feed preview
7. Four progress states
8. Profile/focus showcase
9. Community discovery
10. Why SparkTrail
11. Final CTA
12. Minimal footer

### Signature Trail Journey

The desktop experience pins the section while the user scrolls through the lifecycle:

`IDEA → LEARNING → BUILDING → STUCK → WIN`

The right-side progress card changes status, content, accent, and progress state as scroll position advances. Mobile uses a simplified vertical reveal rather than a heavy pinned animation.

### Motion responsibilities

- **GSAP:** hero timelines, masked text reveals, composition assembly, complex sequences
- **ScrollTrigger:** pinned sections, parallax, background transitions, scroll-linked progress
- **Lenis:** smooth marketing-page scrolling
- **Motion:** buttons, cards, dropdowns, modal transitions, tabs, post interactions, notification appearance

Reduced-motion preferences must be respected and heavy effects must be simplified on mobile.

## 8. Authenticated App UX

### Desktop

Three-column layout:

- Left: sticky navigation
- Center: feed/content
- Right: progress stats, trends, creator discovery

### Tablet

Two-column layout with the right rail removed.

### Mobile

Native-app-style single-column feed with bottom navigation:

`Home | Explore | Create | Alerts | Profile`

The app uses calmer motion than the landing page.

## 9. Core Features

### Authentication

- Register
- Login
- Logout
- Protected routes
- Unique user profiles
- Secure password hashing
- HttpOnly authentication cookie
- `/auth/me` current-user endpoint
- Short-lived socket authentication token for Socket.IO connections

### Profiles

Each user has a separate profile with:

- Avatar
- Display name
- Unique username
- Bio
- Current focus areas
- Interests
- Post count
- Followers count
- Following count
- Total received sparks/likes
- Profile tabs: Posts, Wins, Media

Users can edit only their own profile.

### Posts

Users can:

- Create a post
- Edit their own post
- Delete their own post
- Choose one progress status
- Add title and content
- Upload an optional image
- Add tags

Statuses:

- `LEARNING`
- `BUILDING`
- `STUCK`
- `WIN`

### Social interactions

- Spark/like a post
- Remove spark/like
- Comment
- Edit/delete own comments
- Follow/unfollow users
- View followers/following
- Save/bookmark posts
- View saved posts

### Feed

- Personalized following feed
- Own posts included
- Discovery fallback when following feed is sparse
- Cursor-based pagination
- Optimistic updates for lightweight social actions

### Explore

- Recent/popular posts
- Suggested creators
- Topics/tags
- Status filters
- Categories such as Development, Design, Study, Art, Photography, Fitness, Writing, and Other

## 10. Real-Time Notifications

SparkTrail includes persistent, real-time notifications.

### Notification triggers

- Someone follows the user
- Someone sparks/likes the user's post
- Someone comments on the user's post

Self-notifications are not created.

### Persistence model

Every notification is written to PostgreSQL before a real-time event is emitted. This guarantees that offline users still see the event later.

### Socket flow

1. Authenticated frontend requests a short-lived socket token.
2. Socket.IO client connects using the short-lived token.
3. Express/Socket.IO verifies the token.
4. Socket joins private user room: `user:<id>`.
5. Social action occurs.
6. Database transaction creates social record and notification.
7. Server emits `notification:new` to the recipient's private room.
8. Frontend updates unread count, dropdown cache, and toast immediately.

### Notification capabilities

- Unread count
- Notification dropdown
- Full notification history page
- Mark one as read
- Mark all as read
- Navigate from notification to related post or profile

Browser push notifications while the browser is fully closed are out of scope for v1.

## 11. Data Model

### User

- `id`
- `name`
- `username` unique
- `email` unique
- `passwordHash`
- `avatarUrl` nullable
- `bio` nullable
- `currentFocus`
- `interests`
- `createdAt`
- `updatedAt`

### Post

- `id`
- `authorId` → User
- `title`
- `content`
- `status`
- `imageUrl` nullable
- `tags`
- `createdAt`
- `updatedAt`

### Comment

- `id`
- `postId` → Post
- `authorId` → User
- `content`
- `createdAt`
- `updatedAt`

### Like

- `id`
- `userId` → User
- `postId` → Post
- `createdAt`
- unique pair: `(userId, postId)`

### Follow

- `id`
- `followerId` → User
- `followingId` → User
- `createdAt`
- unique pair: `(followerId, followingId)`

### Bookmark

- `id`
- `userId` → User
- `postId` → Post
- `createdAt`
- unique pair: `(userId, postId)`

### Notification

- `id`
- `type`
- `senderId` → User
- `receiverId` → User
- `postId` nullable → Post
- `isRead`
- `createdAt`
- `readAt` nullable

### Important indexes

- Post: `(authorId, createdAt)`
- Comment: `(postId, createdAt)`
- Notification: `(receiverId, isRead, createdAt)`
- Follow: `followerId`
- Follow: `followingId`

## 12. Backend Module Architecture

The Express backend is feature-oriented rather than one large server file.

```text
server/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── likes/
│   │   ├── follows/
│   │   ├── bookmarks/
│   │   └── notifications/
│   ├── socket/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
└── package.json
```

Each feature may contain route, controller, service, validation, and type files.

Request flow:

`Route → Validation → Controller → Service → Prisma → PostgreSQL`

## 13. API Contract

Base prefix: `/api/v1`

### Authentication

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `GET /auth/socket-token`

### Users

- `GET /users/:username`
- `PATCH /users/me`
- `GET /users/:username/followers`
- `GET /users/:username/following`
- `POST /users/:userId/follow`
- `DELETE /users/:userId/follow`

### Posts and feeds

- `POST /posts`
- `GET /posts/:id`
- `PATCH /posts/:id`
- `DELETE /posts/:id`
- `GET /feed`
- `GET /explore`
- `GET /users/:username/posts`

### Likes

- `POST /posts/:postId/like`
- `DELETE /posts/:postId/like`

### Comments

- `GET /posts/:postId/comments`
- `POST /posts/:postId/comments`
- `PATCH /comments/:commentId`
- `DELETE /comments/:commentId`

### Bookmarks

- `POST /posts/:postId/bookmark`
- `DELETE /posts/:postId/bookmark`
- `GET /bookmarks`

### Notifications

- `GET /notifications`
- `GET /notifications/unread-count`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`

## 14. API Response Style

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "You are not authorized to perform this action.",
  "code": "FORBIDDEN"
}
```

## 15. Authorization Rules

- Users may edit only their own profiles.
- Users may edit/delete only their own posts.
- Users may edit/delete only their own comments.
- Unauthenticated users cannot access protected write actions.
- Duplicate likes, follows, and bookmarks are prevented by unique database constraints.

## 16. Media Flow

Media is not stored on the Node server filesystem.

`Next.js → Express → Cloudinary → media URL → PostgreSQL`

Only the media URL and metadata are persisted in the application database.

## 17. Frontend State Strategy

### TanStack Query

Used for authoritative server state:

- Current user
- Feed
- Explore
- Profiles
- Comments
- Notifications
- Saved posts

### Zustand

Used only for lightweight client state:

- Notification badge helper state
- Create-post modal state
- Mobile navigation state
- Socket connection state
- Small UI preferences

Redux is intentionally not required.

## 18. UX Requirements

The product must include:

- Responsive layouts
- Loading skeletons
- Empty states
- Error states
- Toast feedback
- Confirmation dialogs
- Optimistic interactions for spark/follow/bookmark/read-state actions
- Accessible forms
- Keyboard navigation
- Focus states
- Semantic HTML
- ARIA where required
- Reduced-motion support
- Proper image alt text

## 19. Performance Strategy

- Use Next.js image optimization.
- Use Cloudinary transformations/CDN.
- Restrict GSAP and Lenis primarily to marketing pages.
- Keep application interactions lightweight.
- Lazy-load below-the-fold media.
- Avoid animating layout-heavy properties when transforms/opacity suffice.
- Simplify parallax and pinned interactions on mobile.
- Avoid loading multiple animation libraries for the same responsibility.

## 20. MVP Scope

The following must be complete before bonus work:

- Authentication
- Individual user profiles
- Profile editing and avatar upload
- Post CRUD
- Progress statuses
- Post media
- Tags
- Sparks/likes
- Comments
- Follow/unfollow
- Followers/following
- Bookmarks
- Following feed
- Explore feed
- Cursor pagination
- Real-time follow/like/comment notifications
- Persistent notification history
- Notification read state
- Responsive design
- Landing-page premium animation
- Loading, empty, error, and validation states
- Production deployment

## 21. Bonus Scope

Only after the MVP is stable and deployed:

- Search across users/posts/tags
- Trending algorithm refinements
- Richer profile progress stats
- Share links
- Dark mode
- PWA installation
- Browser push notifications
- Comment replies
- Mentions
- Hashtag pages
- Activity streaks
- Rich link previews

Explicitly out of v1 scope:

- Direct messaging/chat
- Stories
- Livestreaming
- Video calls
- Marketplace

## 22. Development Phases

1. Environment and repository setup
2. UI concept and design system
3. Next.js foundation
4. Express foundation
5. PostgreSQL + Prisma
6. Authentication and profile system
7. Core social interactions
8. Feed and Explore
9. Real-time Socket.IO notifications
10. Premium landing-page animation
11. QA, security, accessibility, and performance
12. Deployment
13. CodeAlpha submission polish

Each phase follows:

`PLAN → BUILD → RUN → TEST → FIX → COMMIT → NEXT PHASE`

## 23. Acceptance Criteria

The project is considered implementation-ready when the planned implementation can demonstrate all of the following:

- Two independent users can register and log in.
- Each user has a separate editable profile.
- A user can create, edit, and delete only their own posts.
- Another user can follow, spark, comment, and bookmark.
- Personalized feeds return appropriate content.
- A like/comment/follow notification appears in real time for an online recipient.
- The same notification remains available after reconnecting or logging in later.
- Unauthenticated and unauthorized operations are rejected by the server.
- Desktop, tablet, and mobile layouts are usable.
- The landing page delivers the approved premium hybrid visual experience.
- The app is deployed with separate frontend, backend, database, and media services.

## 24. Implementation Principle

AI tools may accelerate visual ideation, boilerplate, debugging, and review, but no single tool should generate the entire project in one step. Each feature should be implemented, run, tested, understood, and committed before the next phase.
