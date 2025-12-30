Here's a clean, simple `README.md` that matches your current **ATC application**, removes the conflict markers, and keeps it professional:

---

# **atc**

A web application for managing and visualizing the **Air Training Command (ATC)** organizational structure and related components.
Built with **Next.js**, **React**, **TailwindCSS**, and additional UI/animation libraries.

## 🚀 Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open:

```
http://localhost:3000
```

The app will auto-reload as you edit files in the `app/` directory.

## 🧩 Tech Stack

- **Next.js 14+**
- **React 18**
- **TailwindCSS**
- **Framer Motion**
- **react-flow** for organogram structures

## 📁 Development Notes

Main files to edit:

- `app/page.tsx` – homepage
- `components/` – UI components
- `lib/` – utilities and shared logic

<!-- NEWS PAGE -->

## Features

- Next.js (App Router)
- MongoDB Atlas + GridFS for images
- Admin auth (bcrypt + JWT cookie)
- News CRUD with TipTap rich editor
- Image upload to GridFS and served via API
- Deployable to Vercel

## Setup

1. Install dependencies:

npm install

2. Create `.env.local` with:
   MONGODB_URI=...
   MONGODB_DB=atc_db
   JWT_SECRET=...
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

3. Seed admin (locally):

ADMIN_USERNAME=admin ADMIN_PASSWORD=P@ssw0rd node -r ts-node/register scripts/seedAdmin.ts

4. Run locally:

npm run dev

## Deploy

- Push to GitHub and connect repository to Vercel.
- Add env vars in Vercel Dashboard.
