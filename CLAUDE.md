# spk-bansos-web

Frontend for SPK Penerima Bansos (SAW method). React 19 + Vite 8 + React Router 8 (data mode) +
Tailwind CSS 4. Plain JavaScript (.jsx). API lives in the separate `spk-bansos-api` repo.

> If a workspace-level `../../CLAUDE.md` exists, read it too: it has the domain summary
> (roles, criteria C1–C5, SAW formulas) and open decisions.

## Rules

- Never commit, push, pull, fetch, or change git remotes/config — the user handles git.
- UI text is Indonesian; code identifiers English, domain nouns may stay Indonesian (kriteria, survei, kk).

## Commands

```bash
npm install
npm run dev       # http://localhost:5173 — proxies /api → http://localhost:3000 (start the API first)
npm run lint      # oxlint
npm run build     # production build to dist/
```

Docker: built by the backend repo's `docker-compose.yml` (multi-stage → nginx, see `Dockerfile`,
`nginx.conf`). nginx serves the SPA and proxies `/api/` to the `api` container.

## Layout

```
src/main.jsx          entry: RouterProvider (from react-router/dom)
src/router.jsx        route table (createBrowserRouter from react-router)
src/lib/api.js        fetch wrapper — always use api('/path', { method, body }); throws ApiError;
                      withQuery(path, params) drops empty params; a 401 outside /auth/* logs the user out
src/lib/hooks.js      useApiQuery(path | null) → { data, error, loading, reload } (null = don't fetch yet);
                      useForm(initial) → field(name),
                      submit(action, validate?), errors/setErrors (list keys like 'opsi.0.label'), error,
                      submitting; useDebouncedValue
src/lib/format.js     formatRt(rt) → "RT 001 / RW 001" (null → "Seluruh desa"); formatBobot(0.3) → "0,300";
                      parseDecimal("0,3" | "0.3") → 0.3 (NaN if not a number)
                      formatTanggal(iso) → "28 Okt 2026, 14.05"
                      formatAngka(4.3333) → "4,333"
src/lib/kriteria.js   SIFAT (label, tone, rumus), SIFAT_OPTIONS, rumusKonversi(kriteria) → "C2 = (2a + 2b) / 2", MIN_OPSI,
                      nilaiKriteria(kriteria, { [pertanyaanId]: skor }) → { nilai, rumus "C2 = (5 + 4) / 2" }
src/lib/periode.js    pilihPeriode(list, selectedId) (default: open, else newest), periodeOptions(list)
src/lib/survei.js     STATUS_SURVEI (label, tone), PROGRESS_SEGMENTS + BELUM_DISURVEI (progress bar), JENIS_FOTO,
                      FOTO_TYPES, MAX_FOTO_BYTES, fotoUrl(surveiId, fotoId)
src/auth/             AuthProvider (useAuth: status, user, login, logout, refreshUser; restores session via /auth/me),
                      RequireAuth (guests → /login), RequireRole (wrong role → 403 page in place),
                      roles.js (ROLE_LABELS, ROLE_HOME: desa → /desa, rt → /rt)
src/navigation.js     menu per role; router builds /desa/* and /rt/* from it, unbuilt pages → ComingSoonPage
src/components/       UI in Atomic Design levels (see below)
src/pages/            route-level components, one flat file per route
src/theme/themes.js   color themes (constants) + applyTheme; ThemeProvider.jsx exposes useTheme()
src/index.css         Tailwind entry; maps --theme-* vars to Tailwind colors (@theme inline)
```

### Atomic Design (`src/components/`)

A component imports only from its own level or lower ones (atoms → molecules → organisms → templates → pages).

```
atoms/       single elements, no app data: Button, IconButton, Badge, Spinner, Label,
             Input (invalid, size sm|md, leading icon / trailing), Select (options, placeholder), Textarea,
             control.js (shared Input/Select/Textarea classes)
molecules/   small groups of atoms: TextField/TextAreaField/SelectField (FormField.jsx), Alert (danger |
             warning | info), Card (title + description + header actions + body), InfoRow, PageHeader,
             Pagination, Tabs, Stepper (multi-step forms), StatTile (KPI number, optional link),
             StackedBar + StackedBarLegend (part-to-whole bar), Brand, ThemePicker, FullPageSpinner
organisms/   self-contained sections; generic ones at the top level (Modal size sm|md, FormModal,
             ConfirmDialog, DataTable, Toast → ToastProvider/useToast), feature ones in a folder per
             feature: layout/ (Sidebar, Topbar, WelcomeModal), login/, settings/,
             dashboard/ (ActionItems, SurveiProgressCard, RtProgressTable, AccountInfoCard, MenuShortcuts),
             akun/ (UsersPanel, RtPanel + their modals), kk/ (KkFormModal, RtFilter), periode/,
             kriteria/ (KriteriaTable, KuesionerSection, Kriteria/Bobot/Pertanyaan/OpsiFormModal),
             survei/ (MulaiSurveiModal, SurveiWizard → PertanyaanStep, FotoStep, RingkasanStep),
             verifikasi/ (JawabanReview, FotoGallery, VerifikasiFormModal)
templates/   page skeletons without data: DashboardTemplate (route element: sidebar + header + <Outlet/>),
             PageTemplate (title/description/actions + content column), AuthTemplate (login split screen),
             StatusTemplate (403/404)
```

Pages hold the route's state and data (queries, filters, `dialog`) and compose a template with organisms.
A piece used by one page only still goes in `organisms/<feature>/` rather than inline in the page.

To build a menu page: create it in `src/pages/` (wrapped in `PageTemplate`) and add it to `PAGES` in
`router.jsx` under its nav path; put its forms/panels in `components/organisms/<feature>/`.
Pages that aren't menu items (detail/form pages such as `/rt/survei/:id` → `SurveiFormPage`,
`/desa/verifikasi/:id` → `VerifikasiDetailPage`) go in
`EXTRA_ROUTES` in `router.jsx`, per role.

Charts (dashboard progress bars): survey statuses use the status tokens (success = verified,
info = submitted, danger = rejected, muted = draft, surface-alt track = not surveyed), always with a
legend/label and the exact counts as text; text never takes the segment color.

Survei form: answers are not shown with their scores to the RT (the answer should describe the
household, not aim at a result). Changed answers are saved as a draft on every step change.

CRUD page pattern (see `pages/PeriodePage.jsx`): `useApiQuery` for the list → `DataTable`;
one `dialog` state `{ type, item }`; render `FormModal`/`ConfirmDialog` only while open so forms start
fresh; on success `toast.success(...)`, close, `query.reload()`. Validate on the client for quick
feedback, but the API is the source of truth: its `error.details` show under the matching fields.
Icons: `lucide-react` (per the design style guide).

## Conventions

- Same-origin API: always call relative `/api/...` (via `lib/api.js`), never a hard-coded host.
  Session cookie auth relies on this (Vite proxy in dev, nginx in Docker).
- Current priority: desktop website only, for both roles. Don't build mobile-specific UI or spend
  time on mobile polish yet; keep the existing responsive bits (sidebar drawer) as they are.
  Later goal (workspace domain summary): `rt` pages mobile-first, `desa` pages desktop dashboards.
- Code style (owner's preference): avoid long lines that run far to the right. Break objects,
  arrays, function arguments and JSX props one item per line once they hold several items, always
  starting a new line right after the opening `{` / `[` (never `{ icon: X,` on the brace line), e.g.
  ```js
  const HIGHLIGHTS = [
    {
      icon: Calculator,
      title: 'Metode SAW',
      text: 'Perangkingan dengan Simple Additive Weighting.',
    },
  ]
  ```
  Very long className strings may be split across lines with a template literal.
- Styling with Tailwind utility classes only; no extra CSS files unless unavoidable.
- Flat, solid colors only: no gradients (`bg-linear-*`, `from-*/to-*`, `linear-gradient(...)`)
  for backgrounds, buttons, cards or swatches — the owner wants a hand-crafted, natural look.
- Colors: use the theme tokens (`bg-primary`, `text-primary-fg`, `bg-surface`, `bg-surface-alt`,
  `text-fg`, `text-fg-muted`, `border-border`, `bg-sidebar`, `text-success`, `bg-danger/10`, ...),
  never raw palette classes like `bg-blue-600` — the user can switch themes at runtime
  (`useTheme().setThemeId`, saved in localStorage). Add/change colors only in `src/theme/themes.js`
  (every theme must define the same keys) and map new keys in `index.css`.
- React Router 8 data mode: `createBrowserRouter` / `Link` / `useNavigate` from `react-router`,
  `RouterProvider` from `react-router/dom`.
