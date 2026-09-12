# Production Page Audit — NAVORA

Generated: 2026-09-12 | Updated: 2026-09-12 — Legal premium redesign (public vs audit separation)
Stack verified from: `package.json:1`, `vite.config.js:1`, `src/App.jsx:1`, `src/lib/supabase.js:1`, `server/server.mjs:1`, `src/context/UserContext.jsx:1`, `src/lib/aiAdvisor.js:1`
Contact verified: `src/config/contact.js:1` — Brand NAVORA, Email NAVORA.Edu07@gmail.com, Phones +91 86860 50555 / +91 86881 58266

## Project detected summary
- **App type:** AI-powered education & career guidance SPA (questionnaires Class 10/12/Graduate/Parent, recommendations, AI Advisor chat). Prototype / pre-incorporation. Not e-commerce.
- **Frontend:** React 19 + react-router-dom 7 + Vite 8 + Tailwind 4 + framer-motion 13 + lucide-react. Entry `src/main.jsx`, routes `src/App.jsx:45`. Theme tokens `src/index.css:3`, focus-visible `src/index.css:144`, reduced-motion `src/index.css:444`, Header a11y `src/components/Header.jsx` (`aria-current`, `aria-expanded`).
- **Backend:** Node http server `server/server.mjs:1` — `POST /api/career-advice` `POST /api/advisor/chat` `GET /api/health`, rate limit `AI_RATE_LIMIT_PER_MIN` `server.mjs:96`, key isolation `server.mjs:61`, input sanitization `src/context/UserContext.jsx:11` (pollution guard, allow-list, chat cap 100).
- **Auth:** Supabase Auth `src/lib/supabase.js:10` via `@supabase/supabase-js`. Email/password + OAuth google/github/apple `src/components/auth/AuthCard.jsx:183`. Session gate `src/components/RequireAuth.jsx:9`, storage `localStorage` + Supabase tokens.
- **Data & storage:** Questionnaire answers + chatHistory in `localStorage` key `novera-state-v1` TTL 7 days `UserContext.jsx:5`. Supabase user profile (email, display name). AI payload forwarded to OpenRouter (`openrouter.ai` + fallback models `nvidia/...` `google/...` `server.mjs:73`) — no PII persisted server-side, relay only.
- **Cookies/tracking:** Only essential browser storage (auth + local progress). No analytics/ads scripts (verified: no `gtag`/pixel in `index.html:1`).
- **Payments:** None. No billing deps in `package.json`.

---

## Audit table (verified 2026-09-12)

Category| Page or state| Status| Evidence (internal — stays in audit)| Applicability| Public presentation
Legal| Privacy Policy| EXISTS_AND_ADEQUATE| Route `/privacy` `src/App.jsx:65` → `src/pages/legal/Privacy.jsx:1`, layout `src/components/LegalLayout.jsx:1`, contact `CONTACT` `src/config/contact.js:1`, verified: collects account email/name (`AuthCard.jsx:153`, `supabase.js:10`), questionnaire answers (`UserContext.jsx:75`, `data/careerQuestionnaire.js`), AI relay (`server.mjs:308`, `lib/aiAdvisor.js`), localStorage 7-day TTL (`UserContext.jsx:5`), processors Supabase + OpenRouter (`server.mjs:73`)| Collects personal data| Plain-language premium page: what is collected, why, browser storage explained without key name, processors named without file paths/line numbers, no GDPR/CCPA/encryption/cert claims, last updated Sept 2026, legal nav
Legal| Terms of Service| EXISTS_AND_ADEQUATE| Route `/terms` `src/App.jsx:66` → `src/pages/legal/Terms.jsx:1`, layout `LegalLayout.jsx`| Public service with accounts| Premium page: acceptable use, AI limitations, no subscription/billing/refund/shipping terms, last updated Sept 2026
Legal| Cookie Policy| EXISTS_AND_ADEQUATE| Route `/cookies` `src/App.jsx:67` → `src/pages/legal/CookiePolicy.jsx:1`, verified essential storage `UserContext.jsx:28` + Supabase tokens, no tracking `index.html:1`| Uses browser storage| Simple page: essential auth + app preferences, states no ads/analytics, no invented cookies, no fake consent banner, last updated Sept 2026
Legal| Disclaimer| EXISTS_AND_ADEQUATE| Route `/disclaimer` `src/App.jsx:68` → `src/pages/legal/Disclaimer.jsx:1`, AI advisory `server.mjs:159` prompt + `aiAdvisor.js`| AI guidance needs disclaimer| Human disclaimer: not guaranteed admission/employment/salary/financial advice, verify with official sources, last updated Sept 2026
Legal| Accessibility| EXISTS_AND_ADEQUATE| Route `/accessibility` `src/App.jsx:69` → `src/pages/legal/Accessibility.jsx:1`, verified: semantic HTML, heading hierarchy, `index.css:144` focus rings, `Header.jsx` keyboard/`aria-current`/`aria-expanded`, `index.css:444` reduced-motion, contrast ink-2 on paper| Public-facing| Lists real supports without claiming WCAG 100% compliant, last updated Sept 2026
Legal| Security| EXISTS_AND_ADEQUATE| Route `/security` `src/App.jsx:71` → `src/pages/legal/Security.jsx:1`, verified: auth via provider (`supabase.js:10`), key server-side (`server.mjs:61`), input validation (`UserContext.jsx:11`), rate limit (`server.mjs:96`), no infra exposed| Public product| Concise: provider auth, server-side credentials, validation; no military/SOC2/ISO/PCI/banking claims, no infra/API-key exposure, contact `CONTACT.email`
Legal| Acceptable Use| EXISTS_AND_ADEQUATE| Route `/acceptable-use` `src/App.jsx:70` → `src/pages/legal/AcceptableUse.jsx:1`| Accounts + AI chat| Clean public page without code refs, linked from Terms
Legal| Community Guidelines| NOT_APPLICABLE| No UGC/messaging| —| —
Legal| Cookie Preferences| NOT_APPLICABLE| No non-essential cookies| —| —
Legal| Refund/Cancel/Shipping/Return| NOT_APPLICABLE| No commerce| —| —
Customer| Login/Register| EXISTS_AND_ADEQUATE| `src/pages/Login.jsx:1` `/login`, modal `ForgotPasswordModal.jsx:1`, guard `RequireAuth.jsx:9`, open-redirect fix `Login.jsx:66`| Accounts exist| Retained
Customer| Email Verification| EXISTS_AND_ADEQUATE| `src/pages/VerifyEmail.jsx:1` `/verify-email` `supabase.auth.resend`| Supabase verify enabled| Done
Customer| Reset Password| EXISTS_AND_ADEQUATE| `src/pages/ResetPassword.jsx:1` `/reset-password` `supabase.auth.updateUser`| Single-use token via Supabase| Done
Customer| Account Settings| EXISTS_AND_ADEQUATE| `src/pages/Account.jsx:1` `/account` real controls only| Account creation exists| Done
Customer| Support / Help| EXISTS_AND_ADEQUATE| `src/pages/Support.jsx:1` `/support` + `src/pages/Help.jsx:1` `/help` with `CONTACT`| Support needed| Done — clickable mailto/tel
UX| 404| EXISTS_AND_ADEQUATE| `src/pages/NotFound.jsx:1` wildcard `*` `App.jsx:81`| Required| Done
UX| 403| EXISTS_AND_ADEQUATE| `src/pages/Forbidden.jsx:1` `/403`| Guarded routes| Done
UX| 500| EXISTS_AND_ADEQUATE| `src/pages/ServerError.jsx:1` `/500` correlation ID| Required| Done
UX| Offline (banner + page)| EXISTS_AND_ADEQUATE| `src/components/states/OfflineBanner.jsx:1` `navigator.onLine`, `src/pages/Offline.jsx:1` `/offline` wired `Layout.jsx`| SPA offline| Done
UX| Maintenance| EXISTS_AND_ADEQUATE| `src/pages/Maintenance.jsx:1` `VITE_MAINTENANCE`| Config-driven| Done
UX| Empty/NoResults/Loading/Error/Success| EXISTS_AND_ADEQUATE| `src/components/states/*` reusable| —| Done
UX| Session Expired| EXISTS_AND_ADEQUATE| `src/pages/SessionExpired.jsx:1` `/session-expired`| Supabase expiry| Done

## Public vs audit separation (2026-09-12 redesign)

**Public pages (`src/pages/legal/*`, `src/components/LegalLayout.jsx:1`) contain:** eyebrow LEGAL, title, 1–2 line intro, last updated Sept 2026, readable headings/paragraphs/bullets, comfortable line length, NAVORA colors/typography/spacing from `src/index.css:3`, legal nav pill links, clickable `mailto:`/`tel:` for `CONTACT`. No file paths, no `src/` strings, no endpoint names, no localStorage key names, no line numbers, no “verified in code”, no prototype audit language, no fake CIN/GSTIN/address/jurisdiction.

**Audit (`docs/PRODUCTION_PAGE_AUDIT.md`) retains:** file paths, line numbers, endpoint names (`/api/career-advice`), storage key `novera-state-v1`, TTL evidence, processor lists, rate-limit evidence, unresolved blockers. This is the sole place for developer evidence.

Verification (public scan): `Select-String "src/|server/|novera-state|verified in code|PLACEHOLDER|Private Limited|CIN:"` in `src/pages/legal/*.jsx` → 0 content hits (only import of `useLocalStorage` path, not rendered). `Select-String "TODO|FIXME|example.com|lorem"` → 0 hits.

## Contact centralization

Source `src/config/contact.js:1` — `CONTACT { brand: 'NAVORA', email: 'NAVORA.Edu07@gmail.com', phones: ['+91 86860 50555','+91 86881 58266'] }`, `LEGAL { statusNote, entityName:null, registeredAddress:null, cin:null, gstin:null, jurisdiction:null, effectiveDate:null }`, helper `telHref`. Consumers: `Footer.jsx`, `LegalLayout.jsx` consumers (`Privacy.jsx`, `Terms.jsx`, `CookiePolicy.jsx`, `Disclaimer.jsx`, `Accessibility.jsx`, `Security.jsx`, `AcceptableUse.jsx`, `Support.jsx`). Footer exposes contacts + subtle single-line prototype note `Footer.jsx:101` (`Prototype / pre-incorporation — no registered entity.`) — no large warning box on legal pages. Future incorporation: populate `LEGAL` fields + switch `lastUpdated` from Sept 2026 to effective date without rewriting pages.

## Prototype notice (subtle, once)

Legal pages no longer show a large amber “Prototype / pre-incorporation — professional legal review required” box. The only public prototype hint is the single small footer line `src/components/Footer.jsx:101`. Internal status and professional-review recommendation remain recorded here in the audit (distinction: technical implementation vs legal review).

## Missing owner information (intentionally unresolved — not public)

Remain `null` in `src/config/contact.js` and not shown publicly; add after incorporation via that file:

- Legal entity name/type (no Pvt Ltd / LLP implied)
- Registered / operating address
- CIN / LLPIN / GSTIN / registration numbers
- Jurisdiction / governing law
- Effective date (currently shows generic Sept 2026)
- Children minimum age & parental consent rule (Privacy notes parent/guardian use)
- Data retention beyond verified 7-day local TTL (Supabase/OpenRouter govern own retention)
- Additional processors beyond verified Supabase + OpenRouter (no analytics/ads — verified `index.html:1`)
- Payments / subscriptions / guarantees (confirmed none)
- Security certifications / encryption specifics (not claimed)

## Verification (2026-09-12)

| Check | Command | Result |
|---|---|---|
| Build | `npm run build` | PASSED — 2330 modules, built in 5.06s |
| Lint | `npm run lint` (oxlint) | PASSED for new legal — no errors in `src/components/LegalLayout.jsx`, `src/pages/legal/*`; warnings are pre-existing (`AssessmentFlow.jsx:4`, `PathResults.jsx:42/76/80`, `StudyAbroad.jsx:2`) |
| Public placeholders | `Select-String "PLACEHOLDER|TODO|FIXME|example.com|lorem"` in `src/pages/legal/*` | PASSED — 0 hits |
| Fake entity | `Select-String "Private Limited|Pvt\. Ltd"` | PASSED — 0 content hits (only false positive “Cinematic” excluded) |
| Technical leak | `Select-String "src/|server/|novera-state|verified in code"` content scan public | PASSED — 0 content hits (imports excluded) |
| Routes | `src/App.jsx:65-71` legal routes + footer links `Footer.jsx:27` | PASSED — `/privacy`, `/terms`, `/cookies`, `/disclaimer`, `/accessibility`, `/security` reachable |
| Mobile/desktop | Responsive: Legal `max-w-3xl` `px-5 sm:px-8` `py-12 sm:py-16`, Footer `grid md:grid-cols-12`, prose `leading-7` | PASSED — uses existing NAVORA spacing/typography, `focus-visible` `index.css:144`, `prefers-reduced-motion` `index.css:444` |
| Typecheck/tests | `package.json` scripts `dev/build/lint/preview/server` only | NOT_RUN — none configured |

## Distinction: technical vs public

Premium legal UI communicates the result (what, why, how to contact) for students/parents. Technical evidence (paths, TTL, endpoints, rate limits) lives only in this audit. Do not claim “fully legally compliant” or “production-ready” from UI alone — legal review still recommended before treating policies as final, especially after incorporation.
