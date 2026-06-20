# FoundIT — Angular → Next.js Migration

Migrating `FOUNDIT_FE` (Angular 21, standalone components, Tailwind v4) into
`foundit-fe-next` (Next.js 15 App Router, React 19, TypeScript, Tailwind v4).

**Backend stays unchanged.** The Next.js app talks to the same Spring Boot
backend `FOUNDIT_BE` at `http://localhost:8085`. API contracts, routes, styling,
and assets are preserved.

---

## Phase 0 — Preparation ✅

| Task | Status | Notes |
|------|--------|-------|
| Next.js foundation | ✅ | App Router, TS, `src/` dir, `@/*` alias |
| Tailwind | ✅ | v4 via `@tailwindcss/postcss`, `@import "tailwindcss"` in `globals.css` (same engine as Angular) |
| Assets | ✅ | `src/assets/*` → `public/assets/*`; favicons/logos → `public/*` (URLs preserved) |
| Env vars | ✅ | `.env.local` ← Angular `env.ts` (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WS_URL`) |
| Docs | ✅ | this file |

### Env var mapping

| Angular (`env.ts`) | Next.js (`.env.local`) |
|--------------------|------------------------|
| `apiUrl: 'http://localhost:8085'` | `NEXT_PUBLIC_API_URL=http://localhost:8085` |
| `webSocketUrl: 'http://localhost:8085/ws'` | `NEXT_PUBLIC_WS_URL=http://localhost:8085/ws` |

---

## Phase 1 — Inventory & Mapping

### A. Routes — Angular → Next.js App Router

`:param` → `[param]`; parent route + `children` + guard → `layout.tsx`.

| Angular Route | Next.js File (`src/app/...`) | Protection |
|---------------|------------------------------|------------|
| `maintenance` | `maintenance/page.tsx` | public |
| `account/suspended` | `account/suspended/page.tsx` | public |
| `auth/forget-password` | `auth/forget-password/page.tsx` | public |
| `auth/sign-in` | `auth/sign-in/page.tsx` | public |
| `auth/sign-up` | `auth/sign-up/page.tsx` | public |
| `auth/google/callback` | `auth/google/callback/page.tsx` | public |
| `''` (landing) | `page.tsx` | public |
| `index` (choose-role) | `index/page.tsx` | public |
| `index/ekyc` | `index/ekyc/page.tsx` | public |
| `browse-freelancers` | `browse-freelancers/page.tsx` | public |
| `browse-freelancers/freelancer/:id` | `browse-freelancers/freelancer/[id]/page.tsx` | public |
| `freelancer-view-details/:id` | `freelancer-view-details/[id]/page.tsx` | public |
| `browse-gigs` | `browse-gigs/page.tsx` | public |
| `browse-gigs/gig/:id` | `browse-gigs/gig/[id]/page.tsx` | public |
| `admin/login` | `admin/login/page.tsx` | public |
| `admin` (+children) | `admin/layout.tsx` | **adminGuard** |
| `admin/dashboard` | `admin/dashboard/page.tsx` | adminGuard |
| `admin/users` | `admin/users/page.tsx` | adminGuard |
| `admin/users/:id` | `admin/users/[id]/page.tsx` | adminGuard |
| `admin/reports` | `admin/reports/page.tsx` | adminGuard |
| `admin/settings` | `admin/settings/page.tsx` | adminGuard |
| `client` (+children) | `client/layout.tsx` | **suspendedAccountGuard** |
| `client/dashboard` | `client/dashboard/page.tsx` | suspended guard |
| `client/my-profile` | `client/my-profile/page.tsx` | suspended guard |
| `client/setting` | `client/setting/page.tsx` | suspended guard |
| `client/my-orders` | `client/my-orders/page.tsx` | suspended guard |
| `client/my-orders/:id/view-detail` | `client/my-orders/[id]/view-detail/page.tsx` | suspended guard |
| `client/browse-freelancers` | `client/browse-freelancers/page.tsx` | suspended guard |
| `client/browse-freelancers/freelancer/:id` | `client/browse-freelancers/freelancer/[id]/page.tsx` | suspended guard |
| `client/freelancer-view-details/:id` | `client/freelancer-view-details/[id]/page.tsx` | suspended guard |
| `client/browse-gigs` | `client/browse-gigs/page.tsx` | suspended guard |
| `client/browse-gigs/gig/:id` | `client/browse-gigs/gig/[id]/page.tsx` | suspended guard |
| `client/browse-gigs/gig/:id/confirm-order` | `client/browse-gigs/gig/[id]/confirm-order/page.tsx` | suspended guard |
| `client/browse-gigs/gig/:id/confirm-order/success-order` | `.../success-order/page.tsx` | suspended guard |
| `client/:id/view-transaction` | `client/[id]/view-transaction/page.tsx` | suspended guard |
| `client/chat`, `client/:roomId/chat` | `client/chat/page.tsx`, `client/[roomId]/chat/page.tsx` | suspended guard |
| `client/notification` | `client/notification/page.tsx` | suspended guard |
| `freelancer` (+children) | `freelancer/layout.tsx` | **suspendedAccountGuard** |
| `freelancer/dashboard` | `freelancer/dashboard/page.tsx` | suspended guard |
| `freelancer/chat`, `freelancer/:roomId/chat` | `freelancer/chat/page.tsx`, `freelancer/[roomId]/chat/page.tsx` | suspended guard |
| `freelancer/hire-requests` | `freelancer/hire-requests/page.tsx` | suspended guard |
| `freelancer/notification` | `freelancer/notification/page.tsx` | suspended guard |
| `freelancer/earnings` | `freelancer/earnings/page.tsx` | suspended guard |
| `freelancer/my-services` | `freelancer/my-services/page.tsx` | suspended guard |
| `freelancer/gigs/:gigId` | `freelancer/gigs/[gigId]/page.tsx` | suspended guard |
| `freelancer/profile` | `freelancer/profile/page.tsx` | suspended guard |
| `freelancer/create-new-service` | `freelancer/create-new-service/page.tsx` | suspended guard |
| `freelancer/setting` | `freelancer/setting/page.tsx` | suspended guard |
| `freelancer/active-work` | `freelancer/active-work/page.tsx` | suspended guard |
| `freelancer/client/:clientId/profile` | `freelancer/client/[clientId]/profile/page.tsx` | suspended guard |

Redirects (`'' → dashboard`, `earnings-withdrawals → earnings`, `:id/notification → notification`)
→ `redirect()` in the parent page or `next.config.ts` `redirects()`.

### B. Services — Angular → API client + React Query hook

DTO interfaces (`*Request.ts` / `*Response.ts`) carry over unchanged.

| Angular Service | Next.js API Client (`src/lib/api/...`) | Hook (`src/hooks/...`) |
|-----------------|----------------------------------------|------------------------|
| `auth/Login/login.service.ts` | `auth.ts` → `login()`, `continueWithGoogle()` | `useAuth()` |
| `auth/SignUp/sign-up.service.ts` | `auth.ts` → `signUp()` | `useSignUp()` |
| `auth/ForgetPassword/forget-password.service.ts` | `auth.ts` → send/reset/resend code | `useForgetPassword()` |
| `auth/Role/choose-role.service.ts` | `auth.ts` → `updateRole()` | `useChooseRole()` |
| `auth/Role/local-role.service.ts` | `lib/auth/role-storage.ts` | — |
| `auth/token/ExtractRoleToken.ts` | `lib/auth/jwt.ts` (pure util) | — |
| `account/account-report.service.ts` | `account.ts` → status, reports | `useAccountStatus()` |
| `admin/admin.service.ts` | `admin.ts` (dashboard/users/ekyc/settings) | `useAdmin*()` |
| `admin/admin-notification.service.ts` | `admin.ts` → notifications | `useAdminNotifications()` |
| `admin/maintenance-state.service.ts` | `lib/state/maintenance.ts` | `useMaintenance()` |
| `chat/chat.service.ts` | `chat.ts` (REST) + `lib/ws/stomp.ts` | `useChat()` (Phase 6) |
| `Client/freelancer.service.ts` | `freelancers.ts` | `useFreelancers()` |
| `Client/Profile/MeProfile.service.ts` | `client.ts` → me, project history | `useMyProfile()` |
| `Ekyc/ekyc.service.ts` | `ekyc.ts` (5-step flow) | `useEkyc()` |
| `Freelancer/Gig/gig.service.ts` | `gigs.ts` | `useGigs()` |
| `Freelancer/Profile/freelancer-profile.service.ts` | `freelancer-profile.ts` | `useFreelancerProfile()` |
| `Freelancer/Setting/setting.service.ts` | `freelancer-settings.ts` | `useFreelancerSettings()` |
| `payment/payment.service.ts` | `payment.ts` | `usePayments()` |
| `media/image-url.service.ts` | `lib/media/image-url.ts` (pure util) | — |
| `notification/notification-preference.service.ts` | `notifications.ts` | `useNotificationPrefs()` |
| `notification/notification-refresh.service.ts` | `lib/state/notification-refresh.ts` | `useNotificationRefresh()` |

### C. Guards / Interceptors → Next.js

| Angular | Purpose | Next.js Equivalent |
|---------|---------|--------------------|
| `core/interceptors/auth.interceptor.ts` | Adds `Authorization: Bearer <token>` | axios **request** interceptor in `src/lib/api/client.ts` |
| `core/interceptors/error.interceptor.ts` | Handles `503 MAINTENANCE`, `423 SUSPENDED` | axios **response** interceptor in `src/lib/api/client.ts` |
| `core/guards/admin.guard.ts` | `/admin/*` requires role `ADMIN` | `middleware.ts` (cookie) + `admin/layout.tsx` client guard |
| `core/guards/suspended-account.guard.ts` | login + `GET /account/status`; redirect if `SUSPENDED` | `client/layout.tsx` & `freelancer/layout.tsx` client guard via `useAccountStatus()` |

> **JWT storage decision (Phase 4):** Angular keeps the token in `localStorage`,
> which Next.js server `middleware.ts` cannot read. To keep middleware-based
> route protection we will also mirror the token into a cookie at login. This
> does not change any API contract.

---

## Phase status

- [x] **Phase 0** — Preparation
- [ ] **Phase 1** — Inventory & Mapping (tables above; code in later phases)
- [ ] **Phase 2** — Bootstrapping (global layout, shared components)
- [ ] **Phase 3** — Static pages (landing / marketing / public)
- [ ] **Phase 4** — Authentication (login, register, JWT, protected routes, roles)
- [ ] **Phase 5** — Dynamic features (dashboards, CRUD, React Query)
- [ ] **Phase 6** — Realtime (STOMP/SockJS chat, WS hooks)
- [ ] **Phase 7** — Admin features (dashboard, roles, OAuth callback)
- [ ] **Phase 8** — QA & cleanup
