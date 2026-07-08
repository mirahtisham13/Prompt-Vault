# PromptVault ⚡

**The world's best AI prompt library.** A premium, open-source prompt discovery platform for Gemini, ChatGPT, Midjourney, DALL·E, Claude, Stable Diffusion, Sora, and Runway.

## ✨ Features

- 🎨 **Premium dark/light mode** with smooth transitions
- 🔍 **Fuzzy search** across title, text, tags, and platform
- 🗂️ **Category + Platform filtering** with pill UI
- 📊 **Sort by** Newest, Most Liked, Most Copied, Featured
- ❤️ **Likes & copy tracking** with optimistic UI
- 📤 **Social sharing** (Twitter/X, WhatsApp, Copy link)
- 🖼️ **Image expand modal** with fullscreen view
- ♾️ **Infinite scroll** with intersection observer
- 🛡️ **Proper admin dashboard** (no hidden tricks!)
- 📱 **Fully responsive** mobile-first design
- 🏎️ **Vercel-optimized** for production deployment

## 🚀 Quick Start

```bash
# 1. Clone / navigate to project
cd prompt-library

# 2. Copy environment variables
cp .env.local.example .env.local

# 3. Fill in your Supabase credentials in .env.local

# 4. Install dependencies
npm install

# 5. Run locally
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase-schema.sql`
3. Copy your **Project URL** and **anon key** from Settings → API
4. Add them to `.env.local`

## 🚢 Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
```

Or click: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📁 Project Structure

```
prompt-library/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout + SEO
│   ├── globals.css           # Design system
│   └── admin/
│       ├── page.tsx          # Admin dashboard
│       └── login/page.tsx    # Admin login
├── components/               # All UI components
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── types.ts              # TypeScript types
│   ├── utils.ts              # Utilities
│   └── mockData.ts           # Demo data
└── supabase-schema.sql       # Database schema
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Vanilla CSS Modules
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React
- **Fonts**: Space Grotesk + Inter (Google Fonts)
- **Deployment**: Vercel

## 📄 License

MIT — free to use, modify, and deploy.
