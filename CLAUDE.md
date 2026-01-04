# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

This is a **Next.js 16** application using the **App Router** with **Sanity CMS** as the headless content backend.

### Tech Stack
- **Next.js 16** with App Router (`src/app/`)
- **React 19** with Server Components by default
- **Tailwind CSS v4** (uses `@import "tailwindcss"` syntax, not v3's `@tailwind` directives)
- **Sanity CMS** via `next-sanity` for content management
- **TypeScript** with strict mode

### Project Structure
```
src/
├── app/           # Next.js App Router pages and layouts
│   ├── layout.tsx # Root layout with Geist fonts
│   ├── page.tsx   # Home page
│   └── globals.css
└── sanity/
    └── client.ts  # Sanity client configuration
```

### Sanity Configuration
- **Project ID**: `glu8suiv`
- **Dataset**: `production`
- **API Version**: `2024-01-01`
- CDN disabled for fresh content

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json)

### Styling
Tailwind CSS v4 with CSS variables for theming:
- Light/dark mode via `prefers-color-scheme`
- Custom fonts: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`)
- Theme colors defined in `globals.css` using `@theme inline` directive

---

## Next.js 16 Best Practices

Reference guide for Next.js 16.1.1 App Router patterns and conventions.

### 1. Project Structure

**Special File Conventions:**
| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI, preserves state across navigation |
| `page.tsx` | Makes route publicly accessible |
| `loading.tsx` | Loading UI (Suspense boundary) |
| `error.tsx` | Error boundary (must be Client Component) |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint |
| `template.tsx` | Re-rendered layout (no state preservation) |

**Component Rendering Hierarchy:**
```
layout → template → error → loading → not-found → page
```

**Organization Techniques:**
```
app/
├── (marketing)/        # Route group - no URL impact
│   └── page.tsx        # → /
├── blog/
│   ├── _components/    # Private folder - not routable
│   ├── [slug]/         # Dynamic segment
│   └── page.tsx
├── @sidebar/           # Parallel route slot
└── layout.tsx
```

**Key Rules:**
- Only `page.tsx` or `route.ts` make routes public
- Prefix private folders with `_` to exclude from routing
- Use `(groupName)` for organization without affecting URLs
- Dynamic routes: `[slug]`, catch-all: `[...slug]`, optional: `[[...slug]]`

### 2. Layouts and Pages

**Creating Pages:**
```tsx
// app/blog/page.tsx → /blog
export default function BlogPage() {
  return <h1>Blog</h1>
}
```

**Creating Layouts:**
```tsx
// app/layout.tsx (Root - required)
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

**Key Rules:**
- Root layout **must** contain `<html>` and `<body>` tags
- Layouts nest automatically via folder hierarchy
- Layouts preserve state and don't re-render on navigation
- Use `template.tsx` when you need re-render on every navigation

### 3. Linking and Navigation

**Use `<Link>` for Client-Side Navigation:**
```tsx
import Link from 'next/link'

// Prefetched automatically when visible
<Link href="/blog">Blog</Link>

// Disable prefetch for resource-heavy scenarios
<Link href="/heavy-page" prefetch={false}>Heavy Page</Link>
```

**Navigation Patterns:**
```tsx
// Programmatic navigation
'use client'
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/dashboard')
router.replace('/login')  // No back button
router.refresh()          // Refresh current route

// Server-side redirect
import { redirect } from 'next/navigation'
redirect('/login')
```

**Best Practices:**
- Always add `loading.tsx` to dynamic routes for partial prefetching
- Use `generateStaticParams` to prerender dynamic segments at build time
- Native History API (`pushState`, `replaceState`) syncs with Next.js Router

### 4. Server and Client Components

**Server Components (Default):**
```tsx
// No directive needed - server by default
export default async function Page() {
  const data = await db.query('SELECT * FROM posts')  // Direct DB access
  const secret = process.env.API_SECRET              // Safe to use secrets
  return <div>{data.title}</div>
}
```

**Client Components:**
```tsx
'use client'  // Must be first line

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**When to Use Each:**
| Server Component | Client Component |
|-----------------|------------------|
| Data fetching | useState, useEffect |
| Access secrets/API keys | Event handlers (onClick) |
| Database queries | Browser APIs (localStorage) |
| Reduce JS bundle | Real-time updates |

**Composition Patterns:**
```tsx
// Pass Server Component as children to Client Component
import ClientModal from './Modal'
import ServerContent from './Content'

export default function Page() {
  return (
    <ClientModal>
      <ServerContent />  {/* Rendered on server */}
    </ClientModal>
  )
}
```

**Security:**
```tsx
// Prevent server code from leaking to client
import 'server-only'

export async function getSecretData() {
  // Build error if imported in Client Component
}
```

### 5. Cache Components

**Enable in next.config.ts:**
```ts
const nextConfig: NextConfig = {
  cacheComponents: true,
}
```

**Using `'use cache'` Directive:**
```tsx
import { cacheLife, cacheTag } from 'next/cache'

async function BlogPosts() {
  'use cache'
  cacheLife('hours')        // Cache for 1 hour
  cacheTag('posts')         // Tag for revalidation

  const posts = await db.query('SELECT * FROM posts')
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>
}
```

**Cache Lifetime Presets:**
- `cacheLife('hours')` - 1 hour
- `cacheLife('days')` - 1 day
- `cacheLife('weeks')` - 1 week
- `cacheLife('max')` - Maximum cache duration

**Pattern with Runtime Data:**
```tsx
// Extract cookies/headers OUTSIDE cache, pass as params
async function Page() {
  const session = (await cookies()).get('session')?.value
  return <CachedContent sessionId={session} />  // sessionId becomes cache key
}

async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache'
  // Cached per sessionId
}
```

### 6. Fetching Data

**Server Component Fetching:**
```tsx
export default async function Page() {
  // Direct async/await in Server Components
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return <PostList posts={posts} />
}
```

**Parallel Fetching (Recommended):**
```tsx
export default async function Page() {
  // Start both requests simultaneously
  const [posts, users] = await Promise.all([
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/users').then(r => r.json()),
  ])
  return <div>...</div>
}
```

**Streaming with Suspense:**
```tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Header />  {/* Sent immediately */}
      <Suspense fallback={<PostsSkeleton />}>
        <Posts />  {/* Streamed when ready */}
      </Suspense>
    </>
  )
}
```

**Request Deduplication:**
```tsx
import { cache } from 'react'

// Wrap ORM queries to deduplicate within render pass
export const getPost = cache(async (id: string) => {
  return await db.query.posts.findFirst({ where: eq(posts.id, id) })
})
```

**Preloading Pattern:**
```tsx
export const preload = (id: string) => {
  void getPost(id)  // Fire request early
}

export default async function Page({ params }) {
  preload(params.id)  // Start loading before checks
  const isAllowed = await checkPermission()
  if (!isAllowed) return null
  const post = await getPost(params.id)  // Already loading
  return <Post data={post} />
}
```

### 7. Updating Data (Server Functions)

**Define Server Functions:**
```tsx
// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  await db.insert(posts).values({ title })

  revalidatePath('/posts')  // Clear cache
  redirect('/posts')        // Must be after revalidatePath
}
```

**Form Handling (Progressive Enhancement):**
```tsx
import { createPost } from './actions'

export function CreateForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">Create</button>
    </form>
  )
}
```

**With Pending State:**
```tsx
'use client'
import { useActionState } from 'react'
import { createPost } from './actions'

export function CreateForm() {
  const [state, action, pending] = useActionState(createPost, null)

  return (
    <form action={action}>
      <input name="title" disabled={pending} />
      <button disabled={pending}>
        {pending ? 'Creating...' : 'Create'}
      </button>
      {state?.error && <p>{state.error}</p>}
    </form>
  )
}
```

**Cookie Management:**
```tsx
'use server'
import { cookies } from 'next/headers'

export async function setTheme(theme: string) {
  const cookieStore = await cookies()
  cookieStore.set('theme', theme)
}
```

### 8. Caching and Revalidation

**Tag-Based Revalidation (Recommended):**
```tsx
// In cached function
import { cacheTag } from 'next/cache'

async function getPosts() {
  'use cache'
  cacheTag('posts')
  return await db.query('SELECT * FROM posts')
}

// In Server Action
import { revalidateTag } from 'next/cache'

export async function createPost() {
  'use server'
  await db.insert(...)
  revalidateTag('posts', 'max')  // Stale-while-revalidate
}
```

**Immediate Expiration (Read-Your-Writes):**
```tsx
import { updateTag } from 'next/cache'

export async function createPost() {
  'use server'
  const post = await db.insert(...)
  updateTag('posts')              // Expire immediately
  updateTag(`post-${post.id}`)    // Specific tag
  redirect(`/posts/${post.id}`)
}
```

**Time-Based (ISR):**
```tsx
const data = await fetch(url, {
  next: { revalidate: 3600 }  // Revalidate every hour
})
```

**Force Dynamic Rendering:**
```tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection()  // Ensures dynamic, not pre-rendered
  const time = new Date()
  return <p>{time.toISOString()}</p>
}
```

### 9. Error Handling

**Error Boundary (error.tsx):**
```tsx
'use client'  // Must be Client Component

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

**Not Found (not-found.tsx):**
```tsx
// app/not-found.tsx
export default function NotFound() {
  return <h2>Page Not Found</h2>
}

// Trigger from route
import { notFound } from 'next/navigation'

export default async function Page({ params }) {
  const post = await getPost(params.id)
  if (!post) notFound()
  return <Post data={post} />
}
```

**Global Error (global-error.tsx):**
```tsx
'use client'

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
```

**Expected Errors (Return as Values):**
```tsx
// Return errors, don't throw
export async function createPost(prevState, formData) {
  'use server'
  const result = await validate(formData)
  if (!result.success) {
    return { error: 'Invalid data' }  // Return, don't throw
  }
  // ... create post
}
```

### 10. Font Optimization

**Google Fonts (Self-Hosted Automatically):**
```tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

**Local Fonts:**
```tsx
import localFont from 'next/font/local'

const myFont = localFont({
  src: [
    { path: './fonts/Regular.woff2', weight: '400' },
    { path: './fonts/Bold.woff2', weight: '700' },
  ],
})
```

**Best Practices:**
- Use variable fonts when available (better performance)
- Always specify `subsets` to reduce file size
- Use CSS variables for flexible application
- Zero layout shift handled automatically

### 11. Metadata and OG Images

**Static Metadata:**
```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'App description',
  openGraph: {
    title: 'My App',
    description: 'App description',
    images: ['/og-image.jpg'],
  },
}
```

**Dynamic Metadata:**
```tsx
import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.id)
  return {
    title: post.title,
    description: post.excerpt,
  }
}
```

**Memoize to Avoid Duplicate Fetches:**
```tsx
import { cache } from 'react'

export const getPost = cache(async (id: string) => {
  return await db.query.posts.findFirst({ where: eq(posts.id, id) })
})

// Used in both generateMetadata and Page component
export async function generateMetadata({ params }) {
  const post = await getPost(params.id)  // Deduplicated
  return { title: post.title }
}

export default async function Page({ params }) {
  const post = await getPost(params.id)  // Same request, cached
  return <Post data={post} />
}
```

**File-Based Metadata:**
```
app/
├── favicon.ico
├── opengraph-image.jpg    # Global OG image
├── twitter-image.jpg
├── robots.txt
├── sitemap.xml
└── blog/
    └── opengraph-image.jpg  # Route-specific (overrides global)
```

**Dynamic OG Images:**
```tsx
// app/blog/[slug]/opengraph-image.tsx
import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }) {
  const post = await getPost(params.slug)

  return new ImageResponse(
    <div style={{ fontSize: 64, background: 'white', width: '100%', height: '100%' }}>
      {post.title}
    </div>
  )
}
```

### 12. Route Handlers

**Create API Endpoints:**
```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const posts = await db.query('SELECT * FROM posts')
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const post = await db.insert(posts).values(body)
  return NextResponse.json(post, { status: 201 })
}
```

**Dynamic Route Handlers:**
```tsx
// app/api/posts/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params  // Must await in Next.js 15+
  const post = await getPost(id)
  return NextResponse.json(post)
}
```

**Query Parameters:**
```tsx
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')
  // /api/search?q=hello → query = 'hello'
}
```

**Cookies and Headers:**
```tsx
import { cookies, headers } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const headersList = await headers()

  const token = cookieStore.get('token')
  const userAgent = headersList.get('user-agent')

  return NextResponse.json({ token, userAgent })
}
```

**Caching Behavior:**
```tsx
// Defaults to dynamic in Next.js 15+
// To cache:
export const revalidate = 3600  // ISR every hour
export const dynamic = 'force-static'  // Always static
```

### 13. Proxy (formerly Middleware)

**Create proxy.ts:**
```tsx
// proxy.ts (root or src/)
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  // Check auth
  const token = request.cookies.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
}
```

**Use Cases:**
```tsx
// Authentication
export function proxy(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

// CORS Headers
export function proxy(request: NextRequest) {
  const response = NextResponse.next()
  response.headers.set('Access-Control-Allow-Origin', '*')
  return response
}

// Redirects
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/old-path') {
    return NextResponse.redirect(new URL('/new-path', request.url))
  }
}
```

**Matcher Patterns:**
```tsx
export const config = {
  matcher: [
    '/api/:path*',                    // All API routes
    '/((?!_next|static|favicon).*)',  // Exclude static files
  ],
}
```

**Background Tasks:**
```tsx
import { NextFetchEvent } from 'next/server'

export function proxy(request: NextRequest, event: NextFetchEvent) {
  event.waitUntil(
    fetch('https://analytics.example.com', {
      method: 'POST',
      body: JSON.stringify({ path: request.nextUrl.pathname }),
    })
  )
  return NextResponse.next()
}
```

**Migration from Middleware:**
```bash
npx @next/codemod@canary middleware-to-proxy .
```

---

## Quick Reference

| Feature | File/Directive | Purpose |
|---------|---------------|---------|
| Server Component | (default) | Data fetching, secrets, reduced bundle |
| Client Component | `'use client'` | State, events, browser APIs |
| Server Function | `'use server'` | Mutations, form handling |
| Cache Component | `'use cache'` | Cached dynamic content |
| Proxy | `proxy.ts` | Pre-route processing |
| API Route | `route.ts` | HTTP endpoints |
| Error Boundary | `error.tsx` | Error handling UI |
| Loading State | `loading.tsx` | Suspense fallback |
