# AfterWord (Project Crimson Viking)

## Project Overview
**AfterWord** is a digital legacy service hosted in Switzerland. It ensures that your story doesn't end when you do, allowing users to securely store messages ("Secrets") that are delivered to loved ones after they pass away.

**Core Value Proposition:**
- **Swiss Hosted:** Physically located in neutral territory for privacy.
- **AES-256 Encryption:** Mathematical impossibility of unauthorized access.
- **Sovereignty:** Your data is yours, even in death.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Internationalization:** next-intl (EN, DE, FR, IT)
- **Icons:** Lucide React

## Development Workflow

### Getting Started
```bash
npm install
npm run dev
# Server starts on localhost:3000 (or 3001 if occupied)
```

### Directory Structure
- `app/[locale]/`: Localized routes.
- `components/`: React components.
- `messages/`: Localization JSON files (en, de, fr, it).
- `public/`: Static assets.

## Roadmap & Checklist

### Phase 1: Foundation (Current)
- [x] Initial Next.js Setup
- [x] Localization Setup (next-intl)
- [x] Landing Page (Hero, Trust Signals, Footer)

### Phase 2: Core Features (Planned)
- [ ] **Authentication**: "Work First, Pay Last" flow. Guest access by default.
- [ ] **The Vault**: "Swiss Bank" Safe Deposit Box UI.
- [ ] **Protocol Configuration**: 4-Step Wizard (Pulse, Keyholder, Verification, Payment).
- [ ] **Dead Man's Switch**: Mechanism to detect user inactivity/death.

### Phase 3: Monetization & Polish
- [ ] **Payments**: Stripe integration.
- [ ] **Legal**: Terms of Service & Privacy Policy generator.
- [ ] **Marketing**: SEO optimization & Blog.