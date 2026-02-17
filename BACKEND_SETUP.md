# Verixa Shop — Backend Setup Guide
## Stack: Supabase (Database + Auth) + Vercel (Frontend hosting)

---

## STEP 1 — Create a Supabase Project

1. Go to https://supabase.com and sign up (free)
2. Click **New Project**
3. Give it a name (e.g. `verixa-shop`), set a database password, choose a region close to India
4. Wait ~2 minutes for it to spin up

---

## STEP 2 — Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor** → **New Query**
2. Open the file `supabase/schema.sql` from this project
3. Paste the entire contents and click **Run**

This will create all tables (products, profiles, orders, order_items, analytics_events),
seed your 6 products, and set up Row Level Security policies.

---

## STEP 3 — Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** → looks like `https://abcdefg.supabase.co`
   - **anon / public key** → a long JWT string

---

## STEP 4 — Set Up Environment Variables Locally

1. In your project root, create a file called `.env.local`
2. Add your keys:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Run `npm install` to install the new Supabase dependency
4. Run `npm run dev` — the site should now read products from Supabase

---

## STEP 5 — Enable Authentication in Supabase

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. **Email** provider is enabled by default — no changes needed
3. Optional: Go to **Authentication** → **Email Templates** to customize signup/password reset emails
4. Optional: Under **Authentication** → **URL Configuration**, set:
   - Site URL: `https://verixa-shop.vercel.app`
   - Redirect URLs: `https://verixa-shop.vercel.app/**`

---

## STEP 6 — Add Environment Variables to Vercel

1. Go to https://vercel.com → your `verixa-shop` project
2. Click **Settings** → **Environment Variables**
3. Add both variables:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
4. Set them for **Production**, **Preview**, and **Development**
5. Push to GitHub — Vercel will redeploy automatically with the new env vars

---

## What's Now Working

| Feature | How |
|---|---|
| User Sign Up / Login | Supabase Auth (email + password) |
| User Profiles | `profiles` table, auto-created on signup |
| Products from database | `products` table in Supabase |
| Orders saved | `orders` + `order_items` tables |
| Analytics events | `analytics_events` table (page views, purchases, etc.) |
| Row Level Security | Users can only see their own orders/profile |

---

## Viewing Your Data

In Supabase dashboard → **Table Editor**, you can:
- Browse all tables visually
- See orders as they come in
- View the `orders_overview` and `top_products` views for quick analytics

---

## Managing Products

To add/edit/delete products:
1. Go to Supabase dashboard → **Table Editor** → `products`
2. Click **Insert row** to add a new product
3. Or edit/delete existing rows directly in the UI

No code changes needed!
