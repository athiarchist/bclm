# Project Context: Black Cow Lives Matter (BCLM)

This document outlines the architecture, features, database configuration, and current status of the **Black Cow Lives Matter (BCLM)** web project so any future session can resume seamlessly.

---

## 📌 Project Overview

- **Name**: Black Cow Lives Matter (BCLM)
- **Core Narrative**: Built around the true story of stepping in at auction to save a sweet black steer from slaughter, giving him a lifelong home as a cherished pasture pet.
- **GitHub Repository**: [https://github.com/athiarchist/bclm.git](https://github.com/athiarchist/bclm.git)
- **Live Local Address**: `http://localhost:3000/`

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom tokens, Glassmorphism, Responsive Grid/Flexbox), Client-side JavaScript (ES Modules).
- **Tooling & Dev Server**: Vite (`npm run dev`).
- **Database & Serverless API**: **Turso Cloud SQLite** connected via `@libsql/client` with Vercel Serverless Functions (`/api/guestbook.js`, `/api/like.js`).
- **Deployment Platform**: Vercel (Auto-deploys from GitHub `main` branch).

---

## 🌟 Key Features & Architecture

### 1. **Live 3-in-1 Theme Switcher Explorer**
Fixed top toolbar allowing visitors to instantly toggle between 3 distinct visual themes:
- **Concept 1: Modern Gold** (`data-theme="movement"`) — Dark onyx background (`#09090b`), gold highlights (`#f59e0b`), `Oswald` headlines.
- **Concept 2: B&W Documentary** (`data-theme="noir"`) — High-contrast minimalist editorial style with `Playfair Display` serif headlines.
- **Concept 3: Warm Pasture** (`data-theme="pasture"`) — Earthy forest green (`#162219`), warm cream, terracotta (`#e07a5f`), and `Lora` serif typography.

### 2. **Navigation & Brand Header**
- Logo Emblem: `public/assets/BCLM_big.png`
- Title: **BLACK COW LIVES MATTER**

### 3. **The Steer Rescue Story Timeline**
Step-by-step interactive narrative:
1. *The Turning Point*: Saved from slaughter at auction.
2. *First Day Home*: Stepping off the trailer into green pasture grass.
3. *Pasture Pet Life Today*: Sunbathing, apple treats, and chin scratches.

### 4. **Official BCLM Store Collection**
Integrated product cards showcasing Fourthwall collection items:
- **BCLM Flagship Hat**: `$15.00 USD`
- **BCLM Flagship Triblend Tee**: `$15.00 USD`
- Direct collection link: `https://spite-network-shop.fourthwall.com/collections/bclm`

### 5. **"Give Him a Moo 🐮" Web Audio Soundboard**
Natively synthesizes an authentic cow moo sound using browser AudioContext:
- Tone pitch control slider ("Deep Moo" to "High Calf").
- Visualizer bar animation and live counter.

### 6. **Interactive Guestbook & Photo Upload Wall (Turso Cloud SQLite)**
- Drag-and-drop / browse photo upload with live FileReader preview.
- Stores messages, locations, Base64 photos, timestamps, and likes.
- **Database Backend**: Connected to Turso Cloud SQLite (`libsql://bclm-db-athiarchist.aws-us-west-2.turso.io`).
- **Mobile & Desktop UX**: Displays uncropped full-height photos without scroll traps on mobile devices.

### 7. **Sanctuary Gallery & Lightbox Modal**
Click-to-enlarge full-screen blurred lightbox viewer.

---

## 🔒 Environment Variables (Vercel & Local)

Configured in `.env.local` (and set up in Vercel Environment Variables):

```env
TURSO_DATABASE_URL="libsql://bclm-db-athiarchist.aws-us-west-2.turso.io"
TURSO_AUTH_TOKEN="eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9..."
```

---

## 📁 File Structure Map

```text
BCLM/
├── api/
│   ├── guestbook.js       # SQLite GET/POST API for guestbook entries & photo uploads
│   └── like.js            # SQLite POST API to increment/decrement post likes
├── BCLM_assets/           # Original logo files (.png, .jpeg, .psd)
├── public/
│   └── assets/            # Static assets & gallery images
│       ├── BCLM_big.png
│       └── gallery/ (cow1.png, cow2.png, cow3.png)
├── app.js                 # Theme switcher, audio synth, guestbook UI & API fetch logic
├── index.html             # Single-page HTML structure & semantic layout
├── styles.css             # 3-in-1 CSS design system & responsive styling
├── package.json           # Vite dev server scripts & dependencies
├── project-context.md     # Current context & roadmap reference
└── .gitignore             # Credential & build protection rules
```

---

## 🎯 Future Extension Roadmap

1. **Actual Photo Swap**: Replace gallery/hero placeholders with real high-resolution photos of the rescued steer when available.
2. **Additional Store Products**: Easily add new hat/shirt designs or stickers to `#merch` section.
3. **Custom Domain**: Point custom domain (e.g. `blackcowlivesmatter.com`) to Vercel deployment.
