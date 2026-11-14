# RiskPilot: AI Incident Triage & Risk Matrix Suite

## 🎯 Executive Summary
RiskPilot is an AI-powered, PMBOK 8th-Edition project management copilot built for the **New Company Website** project (managed by **Pascual Terlizzi**). It eliminates the recurring manual overhead of distinguishing realized operational problems from uncertain future threats—automatically routing incidents between the **Issue Log** and **Risk Register**, cross-referencing existing mitigation plans to block duplicate risk entries, computing multidimensional 5×5 Probability & Impact scores (`P × max(Scope, Quality, Schedule, Cost)`), and governing drawdowns against the **$15,000 PM Contingency Reserve**.

## 🏗️ Architecture & Flow
RiskPilot runs as a unified full-stack TypeScript application where an Express backend serves both the API proxy and the Vite-bundled React SPA on port `3000`:

1. **Incident Ingestion (Frontend):** A project manager enters a raw incident or selects a project preset inside the **Interactive Triage Studio** (`TriageWizardModal`) and submits a `POST /api/triage` request containing the description along with current risks and issues.
2. **AI Evaluation & Structured Output (`server.ts`):** The Express backend evaluates the incident via the `@google/genai` SDK (`gemini-3.8-flash`) using a strict JSON response schema grounded in the Risk Management Plan, RBS categories, and stakeholder tolerances. If `GEMINI_API_KEY` is absent or an API call fails, the server falls back gracefully to a deterministic local heuristic engine (`heuristicTriage`).
3. **Duplicate Detection & Governance Guardrails:** Both the backend AI prompt/heuristic and frontend similarity checks (`findSimilarRisk`) cross-reference incoming threats against existing Risk Register entries (`R-01`–`R-15` and any user-added entries). Matching threats surface the pre-planned contingency action and block duplicate risk creation.
4. **Interactive Matrix & State Persistence (`src/App.tsx`):** The client renders live KPI metrics, an interactive 5×5 matrix heatmap, dual-mode Risk Register and Issue Log tables, and the Contingency Reserve tracker, persisting mutations in browser `localStorage` with one-click baseline reset support.

## 🛠️ Tech Stack & Tooling
- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide React, Motion
- **Backend & Runtime:** Node.js, Express 4, `tsx`, `dotenv`
- **AI & Structured Triage:** Google GenAI SDK (`@google/genai`) with `gemini-3.8-flash` JSON schema enforcement + local deterministic heuristic fallback
- **Persistence & Seeding:** Pre-populated project baseline (`src/data/seedData.ts`) with browser `localStorage` synchronization

## 🚀 Key Features
- **AI Incident Triage Studio:** Classifies incoming events as either a *Realized Impediment* (Issue Log) or *Future Uncertainty* (Risk Register), provides interactive Probability/Impact override sliders, and maps scores to required SLA response timelines.
- **Duplicate Risk Prevention:** Automatically detects similarity to documented risks across both the Triage Studio and manual Risk Register creation modal, surfacing established mitigation plans and preventing redundant entries.
- **Interactive 5×5 Risk Matrix Heatmap:** Visualizes risk concentration across Probability (`1–5`) and max Impact (`1–5` across Scope, Quality, Schedule, and Cost) with click-to-filter drilldowns into matching Risk Register items.
- **Dual-Mode Risk Register & Issue Log:** Supports toggling between *Identification & Initial Analysis* and *Detailed Response Plans*, expandable audit drawers, status updates, and one-click promotion of realized risks directly into the Issue Log.
- **Contingency Reserve Governance:** Tracks the **$15,000 PM Contingency Reserve** and **$7,500 Management Reserve**, automatically flagging single-event draws exceeding **$5,000** for mandatory sponsor notification.
- **First-Time Onboarding & Governance Reference:** Includes an interactive welcome guide (`WelcomeModal`) and full PMBOK Risk Management Plan reference (`GovernanceReferenceModal`).

## ⚙️ Getting Started / Local Deployment
```bash
# 1. Clone the repository
git clone https://github.com/pterlizzi/repository-name.git
cd repository-name

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Add your GEMINI_API_KEY to .env (optional: app falls back to local heuristic scoring if omitted)

# 4. Run in development (Express + Vite middleware on http://localhost:3000)
npm run dev

# 5. Type-check and build for production
npm run lint
npm run build
NODE_ENV=production npm start
```
