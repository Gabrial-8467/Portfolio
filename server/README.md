# Portfolio CMS Server

A production-grade, **multi-tenant headless CMS** for React portfolios. Anyone can register, create their own portfolio, manage sections (projects, skills, experience, …) as flexible JSON, and plug in any frontend design.

Built with Express, MongoDB (Mongoose), and JWT auth.

## Why multi-tenant?

Every portfolio is scoped to its owner. You host **one** server that powers **many** portfolios:

- Each user gets one or more portfolios (`Portfolio` docs — `slug`, `name`, `settings`).
- Content lives in `Section` docs (`key`, `label`, `content`, `order`, `isPublished`) owned by a portfolio.
- The public API (`/api/p/:slug`) returns a full portfolio — config + published sections — so the frontend only ever needs the slug.

## Quick start

```bash
cp .env.example .env     # then fill in values
npm install
npm run seed             # creates the admin + a demo portfolio (gabrial-deora)
npm run dev              # or npm start
```

Copy the demo portfolio content into a registered user's account:

```bash
EMAIL=you@example.com npm run seed:user   # add the seed sections to their first portfolio
EMAIL=you@example.com FORCE=1 npm run seed:user   # replace existing sections
```

Requirements: Node.js >= 18, and a MongoDB database (local or Atlas).

## Environment variables

| Variable              | Default                | Description                                          |
| --------------------- | ---------------------- | ---------------------------------------------------- |
| `PORT`                | `5000`                 | Server port                                          |
| `NODE_ENV`            | `development`          | `production` enforces required vars                  |
| `MONGODB_URI`         | _(required in prod)_   | MongoDB connection string                            |
| `JWT_SECRET`          | `dev-secret-change-me` | Long random string; required for security in prod    |
| `JWT_EXPIRES_IN`      | `24h`                  | Token lifetime                                       |
| `CORS_ORIGINS`        | `http://localhost:3000`| Comma-separated allowed frontend origins             |
| `SEED_ADMIN_EMAIL`    | `admin@gabrialdeora.com` | Admin email used by the seed script                |
| `SEED_ADMIN_PASSWORD` | `ChangeMe123!`         | Admin password used by the seed script               |

## Data model

- **User** — `email`, `password` (bcrypt), `name`, `role` (`admin` | `editor`), `isActive`, `lastLogin`.
- **Portfolio** — `slug` (unique), `name`, `owner` (User), `settings` (free-form JSON for design config), `isActive`.
- **Section** — `portfolio` (ref), `key` (unique per portfolio), `label`, `content` (free-form JSON), `order`, `isPublished`.
- **ApiKey** — `owner` (User), `portfolio` (ref), `name`, `prefix`, `keyHash` (sha256, unique). The full key is stored **hashed** and shown in plaintext only once, at creation.

Ownership is enforced on every portfolio/section route via `loadPortfolio` middleware.

## API

All JSON. Responses are wrapped as `{ success, data }`; errors as `{ success: false, error, details? }`.

### Public (no auth)

| Method | Path                          | Description                                   |
| ------ | ----------------------------- | --------------------------------------------- |
| GET    | `/api/p/:slug`                | Portfolio config + all published sections.    |
| GET    | `/api/p/:slug/section/:key`   | One published section by key.                 |
| GET    | `/health`                     | Liveness check.                               |

### Public (API key auth)

Use these when integrating your own portfolio frontend. Authenticate with the API key via any of:

- `Authorization: Bearer <key>`
- `x-api-key: <key>`

| Method | Path                     | Description                                    |
| ------ | ------------------------ | ---------------------------------------------- |
| GET    | `/api/v1/portfolio`      | Portfolio config + all published sections.     |
| GET    | `/api/v1/section/:key`   | One published section by key.                  |

`/api/v1` (like `/api/p`) is open to any origin — no CORS restrictions — so external developers can call it directly from the browser.

### Auth

| Method | Path                | Body                                              |
| ------ | ------------------- | ------------------------------------------------- |
| POST   | `/api/auth/register`| `{ email, password, name, portfolioName? }` — creates the user **and** a portfolio **and** an API key. The response includes the plaintext `apiKey` (shown only once). |
| POST   | `/api/auth/login`   | `{ email, password }`                             |
| GET    | `/api/auth/me`      | Authenticated — returns the user + their portfolios. |

### Owner APIs (Bearer token required)

Portfolio routes: `/api/portfolios`
- `GET /` · `GET /:id` · `POST /` (auto-unique slug) · `PUT /:id` · `DELETE /:id`
- `GET /:id/settings` · `PUT /:id/settings` (`{ settings }`)

Section routes: `/api/portfolios/:portfolioId/sections`
- `GET /` · `GET /:sectionId` · `POST /` · `PUT /:sectionId` · `DELETE /:sectionId`
- `PUT /order/reorder` (`{ ids }` — sets order by array position)

Create/update sections accept `key`, `label`, `content`, `isPublished`, `order`.
Keys must be unique per portfolio and are lowercased automatically.

API key routes: `/api/api-keys`
- `GET /` — list your keys (full key is never returned; only the `prefix`).
- `POST /` — `{ portfolioId, name? }` → `{ key, apiKey }` where `key` is the full plaintext key (shown this one time only).
- `DELETE /:id` — revoke (immediate, irreversible).

Image uploads: `POST /api/uploads`
- Multipart form field `file`, image types only (jpg/png/webp/gif/avif), max 5 MB.
- Returns `{ url }` (e.g. `/uploads/1234-abcd.png`), served statically from `GET /uploads/:file`.
- `uploads/` is gitignored. Note: on ephemeral hosts (Render free tier) files wipe on redeploy — for production attach object storage (S3/Cloudinary) and keep the URL in section content.

## Example: public payload

```json
{
  "slug": "gabrial-deora",
  "name": "Gabrial Deora — Full Stack Portfolio",
  "config": { "siteName": "Gabrial Deora" },
  "sections": [
    { "key": "site",       "label": "Site Settings", "content": { ... } },
    { "key": "projects",   "label": "Projects",      "content": [ { "title": "..." } ] },
    { "key": "skills",     "label": "Skills",        "content": {... } }
  ]
}
```

## Frontend

Point any frontend at the public API with a portfolio slug. Example client:

```js
fetch(`/api/p/${slug}`).then((r) => r.json()).then(({ data }) => data.sections)
```

If you use the dashboard-style admin panel, set:
- `VITE_API_URL` — backend base URL (e.g. `https://your-api.onrender.com`)
- `VITE_PORTFOLIO_SLUG` — the slug to render by default

Alternatively, authenticate with an API key so no slug is needed:

```js
const res = await fetch(`${VITE_API_URL}/api/v1/portfolio`, {
  headers: { Authorization: `Bearer ${API_KEY}` },
});
const { data } = await res.json();
```

Set `VITE_API_KEY` on your frontend build and it will call `/api/v1/portfolio` instead of the slug route.

## Deployment (Render + MongoDB Atlas)

1. Create a free cluster on MongoDB Atlas and copy the connection string into `MONGODB_URI`.
2. Deploy this folder to Render as a **Web Service** with build command `npm install` and start command `npm start`.
3. Set `NODE_ENV=production`, `JWT_SECRET`, `CORS_ORIGINS` (your Vercel URL), and the seed admin vars.
4. Run `npm run seed` once to create the initial admin and demo portfolio.
5. Reset CORS if you later add more frontends.

## Layout

```
src/
  config/       env loading + db connection
  middleware/   auth (JWT + role), api key auth, validation, error handler
  models/       User, Portfolio, Section, ApiKey
  controllers/  auth, portfolio, section, public, api keys
  routes/       matching route groups
  data/         seed data for the demo portfolio
  utils/        slugify, api key generation/hashing
  index.js      app entry
  seed.js       seed script
```