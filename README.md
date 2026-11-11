# Smart Zakat — University Software Engineering Project (SRS V2.0)

**Tagline:** *Give your Zakat with confidence.*

Smart Zakat is a responsive, interactive fintech and charitable web application built according to **Project SRS V2.0** and the **10-Screen High-Fidelity Design Specification**. It enables donors to calculate annual Zakat, distribute funds across scholar-approved recipients, pay verified and anonymised patient medical bills, track lifetime donation history, and manage yearly automatic giving.

---

## 1. Ten High-Fidelity Screens & Routes

| Screen # | Screen Name | Route | SRS Use Case |
| :--- | :--- | :--- | :--- |
| **Screen 1** | Landing Page | `/` | UC-9 View Landing Page |
| **Screen 2** | Login / Register / OTP | `/login` | UC-1 Register / Sign In |
| **Screen 3** | Donor Dashboard | `/dashboard` | UC-8 View Dashboard |
| **Screen 4** | Zakat Calculator | `/calculator` | UC-2 Calculate Zakat |
| **Screen 5** | Choose How to Give | `/donate` | UC-3 Choose How to Give |
| **Screen 6** | General Donation Campaigns | `/donate/campaigns` | UC-5 General Donation |
| **Screen 7** | Verified Patient Cases | `/cases` | UC-6 Fund a Verified Patient Case |
| **Screen 8** | Distribute & Pay | `/pay` | UC-4 Distribute and Pay Zakat |
| **Screen 9** | Proof of Payment | `/receipt` & `/receipt/:id` | UC-7 View Proof of Payment |
| **Screen 10** | History & Auto-Pay | `/history` | UC-8 History & Manage Auto-Pay |

---

## 2. Clean Folder Structure & Architecture

The project is organized into decoupled layers to separate pure business rules, configuration, API/storage services, state management, and presentation UI:

```text
/
├── public/
│   └── _redirects                  # Netlify SPA fallback redirect rule
├── src/
│   ├── config/
│   │   └── env.ts                  # Centralized environment & business rule constants
│   ├── utils/
│   │   ├── zakatCalculation.ts     # Pure Zakat & allocation calculation logic (BR-3, BR-4, BR-8)
│   │   ├── historyStats.ts         # Pure history aggregation & 100% validation (BR-8, BR-11, BR-16)
│   │   └── zakatCalculation.test.ts# Automated Node test suite (8 unit tests)
│   ├── services/
│   │   └── api.ts                  # Adapter-based API & LocalStorage persistence service
│   ├── context/
│   │   └── AppContext.tsx          # Global React Context state management
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Badge.tsx           # Reusable Verification & Gift-Type badges
│   │   │   └── ProgressBar.tsx     # Reusable funding progress bar
│   │   ├── ErrorBoundary.tsx       # Global React error boundary
│   │   ├── Navbar.tsx              # Responsive global header navigation
│   │   └── Footer.tsx              # Global footer with demo state reset
│   ├── pages/
│   │   ├── LandingPage.tsx         # Screen 1
│   │   ├── LoginPage.tsx           # Screen 2
│   │   ├── DashboardPage.tsx       # Screen 3
│   │   ├── CalculatorPage.tsx      # Screen 4
│   │   ├── ChooseDonatePage.tsx    # Screen 5
│   │   ├── CampaignsPage.tsx       # Screen 6
│   │   ├── CasesPage.tsx           # Screen 7
│   │   ├── DistributePayPage.tsx   # Screen 8
│   │   ├── ReceiptPage.tsx         # Screen 9
│   │   └── HistoryPage.tsx         # Screen 10
│   ├── App.tsx                     # Router & layout shell
│   ├── main.tsx                    # React DOM entry point
│   └── index.css                   # Tailwind CSS & custom brand styles
├── netlify.toml                    # Netlify build & redirect configuration
├── package.json
└── vite.config.ts
```

---

## 3. Compliance with SRS Business Rules & Appendix D

- **BR-1 & BR-2 (Auth):** Validates email or Bangladesh mobile numbers (`+8801...` / `01...`), enforces minimum 8-character passwords, and locks sign-in after 5 consecutive failed attempts.
- **BR-3 & BR-4 (Zakat Formula):** `Net Wealth = Zakatable Wealth − Debts`; `Zakat Due = Net Wealth × 2.5%` when Net Wealth meets or exceeds Nisab (`BDT 107,100` 595g Silver benchmark), else `BDT 0`.
- **BR-7, BR-11 & BR-16 (Strict Gift Labelling):** Every contribution is explicitly labelled `Zakat` or `Donation`. General donations (Sadaqah) are never counted as Zakat in the yearly Zakat statement.
- **BR-8 (100% Allocation Validation):** Recipient distribution percentages must total **100%** before payment can proceed. Rounding remainders are assigned to the largest share.
- **BR-13 (Patient Privacy):** Only hospital-verified cases with anonymised patient IDs (`P-***41`, `P-***17`, `P-***88`) are displayed.
- **Appendix D Items 1 & 2 Transparency:** Includes explicit toggles and labels for the SRS Screen 4 benchmark (`BDT 530,000` zakatable / `BDT 500,000` net / `BDT 12,500` Zakat due) and Screen 10 lifetime sample figure (`BDT 87,500`) vs live calculated row sums (`BDT 92,500`).

---

## 4. Installation & Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run automated unit tests for Zakat & allocation business logic
npx tsx --test src/utils/zakatCalculation.test.ts

# 3. Start the local development server on port 3000
npm run dev

# 4. Build production bundle (outputs to /dist)
npm run build
```

---

## 5. Netlify Deployment Instructions

This repository is pre-configured for one-click static deployment on **Netlify**:

1. Push the project to a GitHub/GitLab repository or drag-and-drop the project folder into Netlify.
2. Netlify automatically reads `netlify.toml` and `public/_redirects`:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **SPA Redirect:** `/* -> /index.html (200)` ensures direct navigation and page refreshes on `/calculator`, `/donate`, `/cases`, `/pay`, `/receipt`, and `/history` work seamlessly.
