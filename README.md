# Supabase Auth Explore

This is a small React + TypeScript + Vite project where I learned Supabase while building a simple task manager.

The app demonstrates:

- Authentication (sign up / sign in) with Supabase Auth
- CRUD operations on a `tasks` table via Supabase JS client
- File uploads to Supabase Storage for task images
- Realtime updates using Supabase Realtime channels

This README explains how to get the project running locally, how the code is organized, and highlights what I learned about Supabase while building it.

**Repository**: https://github.com/abubakkar-js-dev/supabase-auth-explore

**Quick Clone**

```bash
git clone https://github.com/abubakkar-js-dev/supabase-auth-explore.git
cd supabase-auth-explore
```

**Prerequisites**

- Node.js (16+ recommended)
- npm or yarn
- A Supabase project (free-tier is fine) with a table named `tasks` and a storage bucket `tasks-images`

Getting started

1. Install dependencies

```bash
npm install
```

2. Create a `.env` (or set environment variables) with your Supabase credentials. Example `.env` (Vite uses `VITE_` prefix):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the dev server

```bash
npm run dev
```

Open `http://localhost:5173` (or the port shown) to use the app.

Project structure (relevant files)

- `src/App.tsx` — top-level component, handles session state and renders `Auth` or `TaskManager`.
- `src/components/auth.tsx` — simple sign up / sign in form using `supabase.auth`.
- `src/components/task-manager.tsx` — CRUD UI for tasks, image upload to Supabase Storage, and realtime channel subscription.
- `src/supabase-client.ts` — Supabase client initialization (reads `VITE_` env vars).

Supabase hints & what I learned

- Auth: Using `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()` is straightforward for email/password flows.
- Sessions: `supabase.auth.getSession()` and `onAuthStateChange` let you keep track of the current user session.
- Database: `supabase.from('tasks').select('*')`, `.insert()`, `.update()`, and `.delete()` are the core methods for CRUD.
- Storage: Use `supabase.storage.from('bucket').upload()` to store files and `getPublicUrl()` to retrieve a public link.
- Realtime: Subscribing to Postgres changes with `supabase.channel(...).on('postgres_changes', ...)` allows live UI updates when tasks are inserted.

Notes about types and small caveats

- The `TaskManager` component defines a `Task` interface for stronger typing.
- For local state that maps task IDs to values (e.g. `newDescription`), use `Record<number, string>` or `Record<string, string>` depending on your ID type to avoid TypeScript indexing errors.

How to adapt for production

- Replace anon keys with server-side session handling where appropriate.
- Secure storage rules and row-level security (RLS) policies in Supabase: enable RLS and create policies so only authenticated users can modify their tasks.
- Use signed URLs for private files if you don't want public file URLs.

Where to go next

- Add better error handling and user feedback in the UI.
- Add pagination or infinite scroll for tasks.
- Harden permissions with RLS and JWT usage for server-side operations.

If you'd like, I can:

- Add a `scripts` section to `package.json` for common tasks
- Create a minimal `.env.example` file
- Add step-by-step Supabase SQL for the `tasks` table and RLS policies

Enjoy exploring Supabase — this project is a compact, hands-on way to learn authentication, storage, database, and realtime features.
