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
src/lib/api.js        fetch wrapper — always use api('/path', { method, body }); throws ApiError
src/auth/             AuthProvider (useAuth: status, user, login, logout; restores session via /auth/me),
                      RequireAuth (guests → /login), RequireRole (wrong role → 403 page in place),
                      roles.js (ROLE_LABELS, ROLE_HOME: desa → /desa, rt → /rt)
src/layouts/          AppLayout (sidebar + header + login welcome modal), navigation.js (menu per role;
                      router builds /desa/* and /rt/* from it, unbuilt pages → ComingSoonPage)
src/components/       shared UI (Brand, Modal, ThemePicker, FullPageSpinner)
src/pages/            route-level components
src/theme/themes.js   color themes (constants) + applyTheme; ThemeProvider.jsx exposes useTheme()
src/index.css         Tailwind entry; maps --theme-* vars to Tailwind colors (@theme inline)
```

To build a menu page: create it in `src/pages/` and add it to `PAGES` in `router.jsx` under its nav path.
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
- Colors: use the theme tokens (`bg-primary`, `text-primary-fg`, `bg-surface`, `bg-surface-alt`,
  `text-fg`, `text-fg-muted`, `border-border`, `bg-sidebar`, `text-success`, `bg-danger/10`, ...),
  never raw palette classes like `bg-blue-600` — the user can switch themes at runtime
  (`useTheme().setThemeId`, saved in localStorage). Add/change colors only in `src/theme/themes.js`
  (every theme must define the same keys) and map new keys in `index.css`.
- React Router 8 data mode: `createBrowserRouter` / `Link` / `useNavigate` from `react-router`,
  `RouterProvider` from `react-router/dom`.
