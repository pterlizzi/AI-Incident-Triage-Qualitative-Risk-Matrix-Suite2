# RiskPilot: AI Incident Triage & Qualitative Risk Matrix Suite

An executive-grade project management application designed for PMs to automate the recurring, error-prone workflow of incident triage (Issue Log vs. Risk Register), qualitative probability and impact scoring ($P \times \max(\text{Impact})$), threshold evaluation, and contingency reserve governance.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed based on your preferences in Phase 1:

- **Confirmed Decision 1 (Core Scope)**: Prioritizing the **full incident triage and automated risk matrix scoring suite**, linking incident classification directly into the 5×5 qualitative probability/impact matrix, required response timelines, and contingency action planning.
- **Confirmed Decision 2 (Dataset & Rules)**: Pre-populating the app with the complete baseline from **Mary's Consulting – New Company Website** (Issue Log items `I-001` through `I-010`, Risk Register items `R-01` through `R-15`, the 4 RBS categories, stakeholder tolerance profiles, and the $15,000 contingency pool).
- **Confirmed Decision 3 (UX Layout)**: A **tabbed PM command dashboard** featuring:
  1. *Incident Triage Wizard & AI Assessor*: Step-by-step evaluation modal/panel to classify any new incident or threat, calculate P×I scores across Scope/Quality/Time/Cost, and recommend immediate action.
  2. *Interactive 5×5 Risk Matrix Visualizer*: Visual heatmap plotting all active risks by probability and highest objective impact, with cell drilldowns and score thresholds.
  3. *Risk Register & Response Plan*: Searchable, filterable table showing R-01–R-15 with initial scores, residual scores, owners, and trigger symptoms.
  4. *Issue Log*: Live table of realized problems (`I-001`–`I-010`), priority, objective impacts, resolutions, and status.
  5. *Contingency & Governance Tracker*: Visual drawdown monitor for the PM's $15,000 contingency reserve, tracking allocated risk line items vs. executed expenditures and $5,000 single-event notification triggers.

---

### 1. Overview & Core Concept

- **What It Does**: 
  When an incident or emerging uncertainty surfaces on a project, the PM pastes or types the description into RiskPilot. Powered by Gemini on the backend:
  1. **Triage Classification**: Determines whether the event has already occurred (Realized problem $\rightarrow$ **Issue Log**) or represents an uncertain future event ($\rightarrow$ **Risk Register**).
  2. **Contingency Detection**: Cross-references existing project risks (e.g., checks if a CMS license change, WCAG audit finding, or contractor unavailability was anticipated) and immediately retrieves the pre-agreed action plan and contingency allocation.
  3. **Automated 5×5 Qualitative Matrix Scoring**: Evaluates the incident against PMBOK definitions across Scope, Quality, Time, and Cost ($1$–$5$), calculates $\text{Score} = P \times \max(\text{Impact})$, and matches the score against the project's risk tolerance thresholds:
     - **Critical (16–25)**: Active mitigation required; escalate to sponsor immediately; weekly status to PM.
     - **High (13–15)**: Mitigation plan documented within 10 days; weekly tracking; PM-managed contingency.
     - **Medium-High (10–12)**: Mitigation plan within 15 days; bi-weekly tracking.
     - **Medium (7–9)**: Mitigation plan within 20 days; monthly tracking.
     - **Low (4–6)**: Monitor; respond if conditions change.
     - **Very Low (1–3)**: Watchlist only.
  4. **One-Click Log Update**: Seamlessly commits the triage result directly into either the Issue Log or the Risk Register with all calculated fields populated.

- **Target Persona**: Project Managers, Risk Managers, Scrum Masters, and Delivery Leads managing projects where contractual SLAs, tight budgets, and cross-functional teams require strict PMBOK governance without tedious manual paperwork.

- **Key Value**: Replaces 30+ minutes of manual matrix lookup, cross-referencing, and rubric checks per incident with a 10-second automated assessment that is 100% compliant with the documented Risk Management Plan.

---

### 2. User Experience & Visual Design

Following the **Universal Frontend Design Constitution** and **SaaS Dashboard Design Guidelines**:

- **Visual Theme & Atmosphere**:
  - *Palette*: Crisp neutral canvas (`#F8FAFC` slate-50 light background, `#0F172A` deep navy slate for high-contrast structural text), with subtle hairline dividers (`border-slate-200`).
  - *Risk Heatmap Colors*: Standard risk grade palette strictly bound to matrix levels:
    - Critical (16–25): Crimson (`bg-red-50 text-red-700 border-red-200`)
    - High (13–15): Coral/Rose (`bg-rose-50 text-rose-700 border-rose-200`)
    - Medium-High (10–12): Amber (`bg-amber-50 text-amber-800 border-amber-200`)
    - Medium (7–9): Warm Yellow (`bg-yellow-50 text-yellow-800 border-yellow-200`)
    - Low (4–6): Emerald Green (`bg-emerald-50 text-emerald-700 border-emerald-200`)
    - Very Low (1–3): Soft Slate/Teal (`bg-slate-100 text-slate-700 border-slate-200`)
  - *Typography*: `Plus Jakarta Sans` for clean, professional executive dashboard typography; `JetBrains Mono` / `tabular-nums` for all scores, dollar figures, dates, and metric cells.
  - *Zero-Pill Discipline*: Unboxed text metadata with clean typographic separators (`·` and `/`), clean segmented navigation tabs, and no decorative colored pulsing dots or AI buzzword badges.

- **Key Dashboard Views**:
  1. **Top Bar**: Clean 3-zone contract displaying brand wordmark `RiskPilot`, quick project selector (`Mary's Consulting – New Company Website`), and a primary `"Triage New Incident"` CTA button.
  2. **Hero KPI Strip**: Four high-density metric counters displaying:
     - Active Open Issues (`I-006`, `I-007`, `I-008`, `I-010`)
     - Monitored Critical & High Risks (`R-04`, `R-05`, `R-11`, `R-01`, `R-02`, etc.)
     - PM Contingency Reserve Status (`$15,000` total, committed vs. available)
     - Average Objective Impact Severity
  3. **Triage & Assessment Studio (Wizard Mode & Quick Evaluate)**:
     - Natural language input: "Vendor reported that lead routing API does not return vertical field" or "Bill has unexpected medical leave during brand design".
     - AI Triage Analysis with streaming or structured reasoning:
       - Problem Nature: Realized Issue vs. Future Risk vs. Opportunity
       - Documented Match: Linked to existing ID (e.g. `R-01` or `R-06`) or flagged as Newly Identified
       - P×I Breakdown: Probability rating ($1$–$5$), Objective impacts: Scope ($1$–$5$), Quality ($1$–$5$), Schedule ($1$–$5$), Cost ($1$–$5$)
       - Final Score = $P \times \max(\text{Impact})$, Risk Level badge, and documented Required Response protocol
       - Formatted action button to append directly to Issue Log or Risk Register.
  4. **Interactive 5×5 Matrix Visualizer**:
     - 5 rows (Probability: Very Low to Very High) $\times$ 5 columns (Impact: Very Low to Very High).
     - Color-coded cells showing the PMBOK product score ($1$ to $25$).
     - Risk badges inside cells showing active risks (e.g. `R-04`, `R-05`, `R-11` in cell P4, I4).
     - Interactive click on any cell filters the table below to show risks in that score band.
  5. **Risk Register Table & Response Plan**:
     - Dual view: Identification & Initial Analysis (ID, Category, Statement, Owner, P, Sc, Qu, Sch, Co, Score, Level, Strategy) AND Response Plan & Monitoring (Trigger/Symptom, Residual P, Residual Score, Status, Action Plan).
  6. **Issue Log Table**:
     - Full table with ID, Type, Description, Priority, Impact on Objectives, Owner, Status (Open, In Progress, Resolved, Escalated), Resolution Date, Resolution, and Comments.
  7. **Contingency Reserve & Governance Inspector**:
     - Breakdown of the $15,000 PM Contingency Reserve and $7,500 Sponsor Management Reserve.
     - Protocol rule cards (PM authority $\le \$5,000$ without approval; $>\$5,000$ triggers sponsor notification).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full Client-Side Local State with Preloaded Seed Data + Server-Side Gemini API Proxy**:
  - *Chosen Approach*: Store the living Issue Log and Risk Register in local state (`localStorage`) initialized with Mary's Consulting data, while all AI triage evaluations run server-side via `/api/triage` using `@google/genai` with `process.env.GEMINI_API_KEY`.
  - *Why*: Gives the user instantaneous zero-latency edits, custom entry additions, status changes, and filter capabilities, while keeping the AI key secure and enabling real Gemini 3.8 Flash intelligence.
- **Decision 2: Strict PMBOK 8th-Edition 5×5 Matrix Formula ($P \times \max(\text{Impact})$)**:
  - *Chosen Approach*: Follow the project plan's exact mathematical rule: $\text{Score} = P \times \max(\text{Scope}, \text{Quality}, \text{Schedule}, \text{Cost})$.
  - *Why*: Aligns 100% with Mary's Consulting Risk Management Plan page 1 and page 5, guaranteeing accurate scoring without hallucinated formulas.
- **Decision 3: Dual Manual & AI Input Modes**:
  - *Chosen Approach*: Users can let Gemini evaluate any raw incident prompt automatically OR manually tweak sliders for Probability ($1$–$5$) and the 4 impact objectives to immediately see the real-time matrix update and required response.
  - *Why*: Accommodates both fast AI automation and hands-on PM calibration during team meetings.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        RiskPilot Browser App                           │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Navigation & Header   │  │   Hero KPI & Contingency Strip      │  │
│  └───────────┬─────────────┘  └──────────────────┬──────────────────┘  │
│              │                                   │                     │
│  ┌───────────▼───────────────────────────────────▼──────────────────┐  │
│  │                       Tabbed Workspace                           │  │
│  │  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────┐  │  │
│  │  │  Triage & AI  │ │  5x5 Matrix   │ │ Risk Register │ │Issue │  │  │
│  │  │  Evaluator    │ │  Heatmap      │ │ & Responses   │ │Log   │  │  │
│  │  └───────┬───────┘ └───────┬───────┘ └───────┬───────┘ └──────┘  │  │
│  └──────────┼─────────────────┼─────────────────┼───────────────────┘  │
│             │                 │                 │                      │
│  ┌──────────▼─────────────────▼─────────────────▼───────────────────┐  │
│  │     Client State Store (Issue Log, Risk Register, Reserves)      │  │
│  │          - Preloaded Mary's Consulting Baseline Data             │  │
│  │          - Reactive CRUD, Filters, Cell Selection               │  │
│  └────────────────────────────┬─────────────────────────────────────┘  │
└───────────────────────────────┼────────────────────────────────────────┘
                                │ POST /api/triage
                                ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Vite Server / Node Middleware                      │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │   Gemini 3.8 Flash Service (@google/genai SDK)                   │  │
│  │   - Grounded with Mary's Consulting Risk Management Plan Schema  │  │
│  │   - Classifies: Realized Issue vs. Anticipated Risk              │  │
│  │   - Scores: P, Scope, Quality, Schedule, Cost (1-5)              │  │
│  │   - Matches: Documented Contingency Plan / Required Response     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Model**:
  - `RiskItem`: `id`, `category` (Technical, External, Organizational, Project Mgmt, Opportunity), `statement`, `owner`, `probability` ($1$–$5$), `impact`: `{ scope: 1-5, quality: 1-5, schedule: 1-5, cost: 1-5 }`, `score`, `level`, `strategy`, `actionPlan`, `responsibleParty`, `triggerSymptom`, `residualP`, `residualScore`, `status`, `comments`.
  - `IssueItem`: `id`, `type` (Resource, Technical, Stakeholder, Scope, Quality, External, Process), `description`, `priority` (High, Medium, Low), `impactOnObjectives`, `owner`, `status` (Open, In Progress, Resolved, Escalated), `resolutionDate`, `resolution`, `comments`.
  - `ContingencyPool`: `total: 15000`, `drawn: 0`, `managementReserve: 7500`, `drawHistory: []`.
  - `TriageAssessmentResult`: `triageType` ('issue' | 'risk'), `matchedExistingId` (optional), `isNew`: boolean, `probability`: number, `impacts`: { scope, quality, schedule, cost }, `calculatedScore`: number, `riskLevel`: string, `requiredResponse`: string, `suggestedActionPlan`: string, `contingencyImpact`: string, `reasoning`: string.
