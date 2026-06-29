---
name: PeerUp auth session store
description: How express-session + connect-pg-simple is wired in the PeerUp api-server
---

## Rule
Use the shared `pool` from `@workspace/db` for connect-pg-simple, NOT `conString`.

**Why:** Replit's built-in PostgreSQL may require SSL settings that the raw connection string doesn't carry correctly when passed to connect-pg-simple directly. Using the already-configured `pool` from `@workspace/db` inherits those settings automatically and avoids silent session save failures.

**How to apply:** In `app.ts`, import `{ pool } from "@workspace/db"` and pass `{ pool }` to `new PgSession(...)` instead of `{ conString: process.env.DATABASE_URL }`.

## Rule
The `user_sessions` table must be created manually before first use.

**Why:** `createTableIfMissing: true` only works reliably when using `conString`. When passing a `pool`, the table may not be auto-created. Silent failure means sessions appear to set cookies but aren't persisted — requests after login return "Niste prijavljeni."

**How to apply:** Run this SQL once after provisioning the DB:
```sql
CREATE TABLE IF NOT EXISTS "user_sessions" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL,
  CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE
) WITH (OIDS=FALSE);
CREATE INDEX IF NOT EXISTS "IDX_user_sessions_expire" ON "user_sessions" ("expire");
```

## Detecting API vs demo users in frontend
`korisnik.sessionToken === "api-session"` → logged in via real API (set by `mapApiKorisnik`).
Demo users (from `INIT_CLANOVI` via `EkranDemo`) do NOT have this token.
Used in `AdminDashboard` to decide whether to fetch from `/api/admin/users` or use in-memory `clanovi`.
