# Daily Coding Challenges Website

## Environment Variables

This app requires Supabase credentials at runtime via Vite environment variables.

Create a `.env` file in the project root (you can copy from `.env.example`) and set:

- `VITE_SUPABASE_URL` — your Supabase project URL (e.g. `https://your-project-ref.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` — your Supabase anon/public API key

```bash
cp .env.example .env
```

Then update `.env` with your real values before running the app.
