# Made by Me Workshop — Lily Edition

"Make Your Scented Bouquet" at Social Addis, with tea from Sene.

The RSVP & event site for **Made by Me Crafts** — no external platform dependency.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind + shadcn/ui |
| Backend | Express.js (Node) |
| Database | SQLite via better-sqlite3 |
| File uploads | Multer (stored locally in `backend/uploads/`) |

## Quick start

```bash
# 1. Install everything
npm run install:all

# 2. Start both servers in parallel
npm run dev
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:3001/api

## Project structure

```
project/
├── frontend/          # Vite + React app
│   └── src/
│       ├── api/client.js               # Fetch wrapper
│       ├── components/craft/
│       │   ├── packages.js             # ← Edit event details, activities & ticket here
│       │   ├── Hero.jsx
│       │   ├── CraftCurriculum.jsx
│       │   ├── ActivityCard.jsx
│       │   ├── RSVPForm.jsx
│       │   └── SiteFooter.jsx
│       └── pages/Home.jsx
├── backend/           # Express API
│   ├── server.js
│   ├── routes/
│   │   ├── rsvp.js    # POST /api/rsvp, GET /api/rsvp, PATCH /api/rsvp/:id/status
│   │   └── upload.js  # POST /api/upload → { file_url }
│   ├── uploads/       # Payment screenshots stored here
│   └── db.sqlite      # Auto-created on first run
└── package.json       # Root scripts (concurrently)
```

## Customising event details

Everything lives in one file — edit it and the whole site updates:

```
frontend/src/components/craft/packages.js
```

- `eventDetails` — date, venue, ticket price, contact links
- `hosts` — who guides the workshop
- `activities` — scented bouquet & flower key chain
- `experience`, `ticketIncludes`, `takeHome` — what the day and ticket include

Lily artwork (transparent line art + tileable patterns) lives in `frontend/public/floral/`.
The pattern is applied with the `.lily-pattern*` classes in `src/index.css`.

## Colour picks (cart)

Guests choose a colourway for their scented bouquet and flower key chain from two carousels and
add them to a cart. Each ticket = 1 bouquet + 1 key chain, so the picks must match the ticket count.
Picks are saved with the RSVP (`color_selections`), and the admin page (`/admin`) shows a **prep list**
of how many of each colour to prepare, plus a Colours column and CSV column.

- Edit / add colourways in `frontend/src/components/craft/colorways.js`
- Photos live in `frontend/public/colorways/` (`bouquet-<id>.webp`, `keychain-<id>.webp`). To add a colour, drop a transparent image there and add an entry in `colorways.js`.
- Existing databases are upgraded automatically (a `color_selections` column is added on start).

## API reference

### POST /api/rsvp
Submit an RSVP. Required: `full_name`, `email`, `selected_package`, `phone`, payment proof, and `color_selections` (JSON list of `{product, variant_id, name, qty}`; bouquet and key chain totals must each equal `number_of_seats`).

### GET /api/rsvp
List all RSVPs (protect this route in production).

### PATCH /api/rsvp/:id/status
Update status: `"pending"`, `"confirmed"`, or `"declined"`.

### POST /api/upload
Upload a payment screenshot (multipart, field: `file`). Returns `{ file_url }`.

## Deployment

**Frontend:** `npm run build --prefix frontend` → deploy `frontend/dist/` to Vercel, Netlify, or Cloudflare Pages.

**Backend:** Deploy `backend/` to Railway, Render, Fly.io, or any Node host. Set `FRONTEND_URL` in `.env`.

Set `VITE_API_URL` in `frontend/.env` to your production backend URL before building the frontend.
