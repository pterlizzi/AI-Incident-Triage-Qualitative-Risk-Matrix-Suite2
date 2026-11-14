import { RiskItem, IssueItem, ContingencyReserve } from '../types/project';

export const INITIAL_PROJECT_INFO = {
  title: "New Company Website",
  datePrepared: "May 19, 2026",
  lastUpdated: "Sep 14, 2026",
  methodology: "PMBOK 8th-Edition Risk & Issues Process",
  contingencyReserveCap: 15000,
  managementReserveCap: 7500,
  projectBudgetCap: 150000,
  targetGoLive: "November 2026",
};

export const INITIAL_RISKS: RiskItem[] = [
  {
    id: "R-01",
    category: "Technical",
    statement: "CRM API integration may be more complex than expected, delaying lead-form go-live.",
    owner: "Bob (Dev)",
    probability: 3,
    impacts: { scope: 2, quality: 2, schedule: 4, cost: 3 },
    score: 12,
    level: "Medium-High",
    strategy: "Mitigate",
    actionPlan: "1. Schedule 4-hour CRM-vendor technical call in week 1 of Build (Aug 17).\n2. Build parallel test harness against CRM sandbox.\n3. If > 1-week delay risk, fall back to email-form submission with manual CRM entry for launch.",
    responsibleParty: "Bob (Dev) – primary; Marketing Lead secondary",
    triggerSymptom: "API discovery during A025 reveals missing fields or undocumented behavior.",
    residualP: 2,
    residualScore: 4,
    status: "Mitigating",
    comments: "Vendor call booked Aug 18."
  },
  {
    id: "R-02",
    category: "Technical",
    statement: "WCAG 2.1 AA audit may surface Severity-1 findings late in the project, requiring rework.",
    owner: "Bill (UX)",
    probability: 3,
    impacts: { scope: 1, quality: 5, schedule: 3, cost: 3 },
    score: 15,
    level: "High",
    strategy: "Mitigate",
    actionPlan: "1. Build accessibility checks into component library (A023).\n2. Run automated a11y linting on every PR.\n3. Conduct internal accessibility review at A024 completion (Sep 30) — before formal audit.",
    responsibleParty: "Bill (UX); Bob ensures linter in CI",
    triggerSymptom: "Audit report identifies Sev-1 findings.",
    residualP: 2,
    residualScore: 4,
    status: "Mitigating",
    comments: "Internal pre-audit booked Oct 1."
  },
  {
    id: "R-03",
    category: "External",
    statement: "Frontend contractor may be unavailable when needed, delaying frontend build.",
    owner: "Pascual Terlizzi (PM)",
    probability: 2,
    impacts: { scope: 1, quality: 1, schedule: 3, cost: 2 },
    score: 6,
    level: "Low",
    strategy: "Mitigate",
    actionPlan: "1. Sign frontend SOW by July 1, 2026.\n2. Identify backup contractor from approved-supplier list (already done: Vendor X).\n3. Pre-pay 25% to lock contractor schedule.",
    responsibleParty: "Pascual Terlizzi (PM); Procurement",
    triggerSymptom: "Contractor declines or doesn't respond to SOW by Aug 5.",
    residualP: 1,
    residualScore: 2,
    status: "Closed",
    comments: "SOW signed June 28."
  },
  {
    id: "R-04",
    category: "Organizational",
    statement: "Sponsor (Mary) may delay design approval beyond planned 5-day window, slipping the design milestone (M04).",
    owner: "Pascual Terlizzi (PM)",
    probability: 4,
    impacts: { scope: 1, quality: 1, schedule: 4, cost: 2 },
    score: 16,
    level: "Critical",
    strategy: "Mitigate",
    actionPlan: "1. Pre-book 2-hour design review on Mary's calendar for Aug 5 — confirmed with EA.\n2. Send executive summary preview 1 week in advance.\n3. Bill presents in person; PM facilitates same-day decisions.",
    responsibleParty: "Pascual Terlizzi (PM)",
    triggerSymptom: "> 5 business days elapse between design submission and Mary's response.",
    residualP: 2,
    residualScore: 4,
    status: "Mitigating",
    comments: "Calendar booked."
  },
  {
    id: "R-05",
    category: "Organizational",
    statement: "Consultants (500+) may not provide bios on time, delaying directory and content launch.",
    owner: "Christine",
    probability: 4,
    impacts: { scope: 4, quality: 3, schedule: 2, cost: 1 },
    score: 16,
    level: "Critical",
    strategy: "Mitigate",
    actionPlan: "1. Mary sends firm-wide kickoff email setting expectation.\n2. Provide 10-minute self-service form (instead of interview).\n3. Tier rollout: top 50 consultants at launch, remainder added in batches post-launch.\n4. Recognition in case studies for early submitters.",
    responsibleParty: "Christine; supported by Mary's email",
    triggerSymptom: "< 50% bio response rate by week 2 of A016.",
    residualP: 3,
    residualScore: 6,
    status: "Mitigating",
    comments: "Firm-wide email scheduled June 15."
  },
  {
    id: "R-06",
    category: "Organizational",
    statement: "Bob, Bill, or Christine may take an unplanned absence (illness, family) during build phase.",
    owner: "Pascual Terlizzi (PM)",
    probability: 2,
    impacts: { scope: 1, quality: 2, schedule: 4, cost: 3 },
    score: 8,
    level: "Medium",
    strategy: "Mitigate",
    actionPlan: "1. Document architecture, design system, and content pipeline so anyone can pick up.\n2. Cross-train: Bob shadows Bill on accessibility; Christine shadows Bill on content design.\n3. Identify backup contractors who can be onboarded in ≤ 1 week.",
    responsibleParty: "Pascual Terlizzi (PM); each team member",
    triggerSymptom: "Team member unavailable for > 5 consecutive business days.",
    residualP: 2,
    residualScore: 4,
    status: "Mitigating",
    comments: "Documentation in progress."
  },
  {
    id: "R-07",
    category: "External",
    statement: "Hosting / CMS vendor outage during cutover (A038) could prevent Go-Live.",
    owner: "Bob (Dev)",
    probability: 1,
    impacts: { scope: 1, quality: 1, schedule: 5, cost: 1 },
    score: 5,
    level: "Low",
    strategy: "Transfer / Mitigate",
    actionPlan: "1. Contractually require 99.5% SLA from vendor.\n2. Schedule cutover Tue–Thu (not Mon/Fri) to allow vendor support.\n3. Document rollback to legacy site (DNS revert) tested in advance.",
    responsibleParty: "Bob (Dev); IT/Hosting Operations",
    triggerSymptom: "Vendor status page shows incident on cutover day.",
    residualP: 1,
    residualScore: 2,
    status: "Mitigating",
    comments: "Cutover tentatively Tue Nov 24."
  },
  {
    id: "R-08",
    category: "External",
    statement: "Legal/Compliance review may identify GDPR or privacy issues late, blocking launch.",
    owner: "Pascual Terlizzi (PM)",
    probability: 2,
    impacts: { scope: 2, quality: 3, schedule: 3, cost: 2 },
    score: 6,
    level: "Low",
    strategy: "Mitigate",
    actionPlan: "1. Engage Legal at requirements (A006) and design (A011) — before build.\n2. Use firm's standard cookie-consent / privacy-policy template.\n3. Schedule Legal sign-off 4 weeks before launch.",
    responsibleParty: "Pascual Terlizzi (PM); Legal",
    triggerSymptom: "Legal flags any Sev-1 issue in privacy review.",
    residualP: 1,
    residualScore: 1,
    status: "Mitigating",
    comments: "Legal joined kickoff."
  },
  {
    id: "R-09",
    category: "Project Mgmt",
    statement: "Effort estimates for build activities (A024, A025) may be optimistic, exceeding the cost baseline.",
    owner: "Pascual Terlizzi (PM)",
    probability: 3,
    impacts: { scope: 1, quality: 1, schedule: 2, cost: 4 },
    score: 12,
    level: "Medium-High",
    strategy: "Accept (active)",
    actionPlan: "1. Hold $15,000 contingency reserve specifically for this risk pool.\n2. Track CPI weekly during build phase.\n3. Trigger management reserve request if CPI < 0.9 for 2 consecutive weeks.",
    responsibleParty: "Pascual Terlizzi (PM)",
    triggerSymptom: "EAC trends > BAC at any phase gate.",
    residualP: 3,
    residualScore: 6,
    status: "Open",
    comments: "Watch CPI weekly.",
    contingencyAllocation: 15000
  },
  {
    id: "R-10",
    category: "Technical",
    statement: "Site performance may not meet LCP < 2.5s target on image-heavy pages (case studies, directory).",
    owner: "Bob (Dev)",
    probability: 3,
    impacts: { scope: 1, quality: 4, schedule: 2, cost: 2 },
    score: 12,
    level: "Medium-High",
    strategy: "Mitigate",
    actionPlan: "1. Implement image-CDN with auto-resize from build start.\n2. Lazy-load all below-fold imagery.\n3. Performance budget enforced in CI (fail build if LCP > 2.5s).",
    responsibleParty: "Bob (Dev)",
    triggerSymptom: "Performance test (A030) shows 75th-percentile LCP > 2.5s.",
    residualP: 2,
    residualScore: 4,
    status: "Mitigating",
    comments: "CDN selected."
  },
  {
    id: "R-11",
    category: "Organizational",
    statement: "Marketing Lead may want to expand scope post-design approval (e.g., add a careers section).",
    owner: "Pascual Terlizzi (PM)",
    probability: 4,
    impacts: { scope: 4, quality: 1, schedule: 3, cost: 3 },
    score: 16,
    level: "Critical",
    strategy: "Mitigate",
    actionPlan: "1. Documented scope-statement exclusions reviewed at Marketing kickoff.\n2. Any scope-add goes through formal change-control (no exceptions).\n3. Maintain 'Phase 2 backlog' so good ideas have a home without disrupting Phase 1.",
    responsibleParty: "Pascual Terlizzi (PM); Marketing Lead",
    triggerSymptom: "Any scope-add request from Marketing Lead post-M04.",
    residualP: 3,
    residualScore: 3,
    status: "Mitigating",
    comments: "Phase 2 backlog established."
  },
  {
    id: "R-12",
    category: "Organizational",
    statement: "FY2026 budget pressure could reduce the project's funding mid-stream.",
    owner: "Mary (Sponsor)",
    probability: 1,
    impacts: { scope: 5, quality: 2, schedule: 5, cost: 5 },
    score: 5,
    level: "Low",
    strategy: "Avoid (Sponsor-managed)",
    actionPlan: "1. Sponsor secured first-call on FY2026 funding.\n2. Quarterly tranche release confirmed.\n3. PM reports on benefits early to maintain executive support.",
    responsibleParty: "Mary (Sponsor)",
    triggerSymptom: "CFO communicates budget reallocation.",
    residualP: 1,
    residualScore: 1,
    status: "Closed",
    comments: "Sponsor confirmed June 1."
  },
  {
    id: "R-13",
    category: "Project Mgmt",
    statement: "IT/Hosting Operations may not be ready to accept handoff at Go-Live, leaving the PM team holding production support.",
    owner: "Pascual Terlizzi (PM)",
    probability: 3,
    impacts: { scope: 1, quality: 2, schedule: 1, cost: 3 },
    score: 9,
    level: "Medium",
    strategy: "Mitigate",
    actionPlan: "1. Engage IT/Hosting Ops at architecture review (Aug 5).\n2. Draft runbooks during build, not at end.\n3. Joint cutover rehearsal Nov 17 (1 week before Go-Live).",
    responsibleParty: "Pascual Terlizzi (PM); IT/Hosting Operations",
    triggerSymptom: "IT raises concerns about runbooks or monitoring in late October.",
    residualP: 2,
    residualScore: 2,
    status: "Mitigating",
    comments: "IT engaged at kickoff."
  },
  {
    id: "R-14",
    category: "Opportunity",
    statement: "Consultants featured in case studies may proactively share the new site, providing free marketing reach.",
    owner: "Marketing Lead",
    probability: 4,
    impacts: { scope: 1, quality: 1, schedule: 1, cost: 2 },
    score: 8,
    level: "Medium",
    strategy: "Enhance",
    actionPlan: "1. Provide pre-written social-share copy to featured consultants.\n2. Recognize sharing leaders in firm's all-hands meeting.\n3. Track referral traffic in analytics.",
    responsibleParty: "Marketing Lead; Christine",
    triggerSymptom: "Launch announcement.",
    residualP: 4,
    residualScore: 12,
    status: "Open",
    comments: "Social-share kit drafted."
  },
  {
    id: "R-15",
    category: "Opportunity",
    statement: "WCAG 2.1 AA compliance may attract clients who require accessibility-compliant vendors (gov, healthcare, education).",
    owner: "Sales Lead",
    probability: 3,
    impacts: { scope: 1, quality: 1, schedule: 1, cost: 3 },
    score: 9,
    level: "Medium",
    strategy: "Exploit",
    actionPlan: "1. Sales Lead develops WCAG-compliance messaging post-audit.\n2. Landing page on new site for accessibility-first prospects.\n3. Add accessibility credentials to RFP responses.",
    responsibleParty: "Sales Lead; Marketing Lead",
    triggerSymptom: "Audit pass + sales messaging update.",
    residualP: 3,
    residualScore: 12,
    status: "Open",
    comments: "Sales briefed."
  }
];

export const INITIAL_ISSUES: IssueItem[] = [
  {
    id: "I-001",
    type: "Resource",
    description: "Bill (UX) had unexpected medical leave Aug 10–14. Brand-design work delayed.",
    priority: "High",
    impactOnObjectives: "Schedule (1-week slip risk)",
    owner: "Pascual Terlizzi (PM)",
    status: "Resolved",
    resolutionDate: "Aug 17, 2026",
    resolution: "Bill returned with overlapping work re-prioritized; no net schedule slip. Backup designer briefed in case of recurrence.",
    comments: "Cross-training added to action items."
  },
  {
    id: "I-002",
    type: "Technical",
    description: "Approved CMS provider's enterprise tier no longer offers 5-seat licensing — only 10-seat.",
    priority: "Medium",
    impactOnObjectives: "Cost (+$1,000)",
    owner: "Bob (Dev)",
    status: "Resolved",
    resolutionDate: "Aug 22, 2026",
    resolution: "Negotiated 5-seat legacy pricing for first year; 10-seat from year 2.",
    comments: "Year-2 cost flagged for budgeting."
  },
  {
    id: "I-003",
    type: "Stakeholder",
    description: "Marketing Lead requested earlier visibility into design mockups (before sponsor review).",
    priority: "Low",
    impactOnObjectives: "Stakeholder engagement only",
    owner: "Bill (UX)",
    status: "Resolved",
    resolutionDate: "Aug 5, 2026",
    resolution: "Bill added Marketing Lead to weekly design review meetings.",
    comments: "Improved alignment going forward."
  },
  {
    id: "I-004",
    type: "Scope",
    description: "Sales Lead asked whether the consultant directory could include LinkedIn links.",
    priority: "Low",
    impactOnObjectives: "Scope (small)",
    owner: "Pascual Terlizzi (PM)",
    status: "Resolved",
    resolutionDate: "Aug 28, 2026",
    resolution: "Added to Phase 2 backlog, not in scope for current launch. Sales Lead agreed.",
    comments: "Documented in Decision Log as out-of-scope."
  },
  {
    id: "I-005",
    type: "Quality",
    description: "Initial accessibility lint detected color-contrast issues on 3 components in the design system.",
    priority: "High",
    impactOnObjectives: "Quality (WCAG compliance)",
    owner: "Bill (UX)",
    status: "Resolved",
    resolutionDate: "Sep 4, 2026",
    resolution: "Bill updated brand colors; sponsor re-approved.",
    comments: "Linter now in CI to prevent recurrence."
  },
  {
    id: "I-006",
    type: "Technical",
    description: "CRM API does not expose 'industry vertical' field needed for lead routing per F-05.",
    priority: "High",
    impactOnObjectives: "Schedule (1-week slip on A025); Quality",
    owner: "Bob (Dev)",
    status: "In Progress",
    resolution: "Working with CRM vendor on field-mapping workaround. Fallback: collect vertical via form, store in CRM 'notes' field at launch.",
    comments: "Vendor call scheduled Sep 17."
  },
  {
    id: "I-007",
    type: "Resource",
    description: "Consultant bio submission rate at 38% vs. 60% target by Sep 12.",
    priority: "Medium",
    impactOnObjectives: "Scope (smaller directory at launch)",
    owner: "Christine",
    status: "In Progress",
    resolution: "Mary issued a second firm-wide reminder; tiered launch plan in place (top 50 at launch, remainder post-launch).",
    comments: "Trend monitored weekly."
  },
  {
    id: "I-008",
    type: "External",
    description: "Hosting vendor reported planned maintenance window on Nov 22 (2 days before Go-Live).",
    priority: "High",
    impactOnObjectives: "Schedule (Go-Live risk)",
    owner: "Bob (Dev)",
    status: "Escalated",
    resolution: "Escalated to vendor account team requesting either window deferral or guaranteed exit criteria. Awaiting response.",
    comments: "Escalated to Sponsor as a watchpoint."
  },
  {
    id: "I-009",
    type: "Process",
    description: "Editorial review queue building up — Christine bottlenecked.",
    priority: "Medium",
    impactOnObjectives: "Schedule (content track)",
    owner: "Christine",
    status: "In Progress",
    resolution: "Marketing Lead taking on review of marketing-tone copy; Christine focusing on case studies and bios.",
    comments: "Effective Sep 14."
  },
  {
    id: "I-010",
    type: "Scope",
    description: "Sponsor (Mary) requesting new Press / Media section for launch.",
    priority: "High",
    impactOnObjectives: "Scope, Cost, Schedule (per CR-007)",
    owner: "Pascual Terlizzi (PM)",
    status: "Open",
    resolution: "Change request CR-007 drafted; impact analysis complete; awaiting CCB disposition.",
    comments: "Disposition expected Sep 16."
  }
];

export const INITIAL_CONTINGENCY: ContingencyReserve = {
  totalBudget: 15000,
  managementReserve: 7500,
  draws: [
    {
      id: "DRAW-001",
      date: "Aug 22, 2026",
      amount: 1000,
      issueId: "I-002",
      description: "CMS provider 5-seat to 10-seat enterprise tier negotiated first-year differential.",
      authorizedBy: "Pascual Terlizzi (PM)",
      sponsorNotified: false
    }
  ]
};

export const PROBABILITY_DEFINITIONS = [
  { level: 5, name: "Very High", range: "> 70%", description: "Almost certain to occur within the project timeframe." },
  { level: 4, name: "High", range: "50% – 70%", description: "More likely than not to occur." },
  { level: 3, name: "Medium", range: "30% – 50%", description: "Reasonable chance of occurrence." },
  { level: 2, name: "Low", range: "10% – 30%", description: "Unlikely but plausible." },
  { level: 1, name: "Very Low", range: "< 10%", description: "Improbable; only worth tracking if impact is severe." }
];

export const IMPACT_DEFINITIONS = [
  {
    level: 5,
    name: "Very High",
    scope: "Loss of major deliverable",
    quality: "Unacceptable to sponsor",
    time: "> 4-week slip",
    cost: "> $15,000"
  },
  {
    level: 4,
    name: "High",
    scope: "Major scope reduction",
    quality: "Major quality degradation",
    time: "2–4 week slip",
    cost: "$7,500 – $15,000"
  },
  {
    level: 3,
    name: "Medium",
    scope: "Significant change required",
    quality: "Quality requires sponsor review",
    time: "1–2 week slip",
    cost: "$3,000 – $7,500"
  },
  {
    level: 2,
    name: "Low",
    scope: "Minor scope adjustment",
    quality: "Quality acceptable to sponsor",
    time: "< 1 week slip",
    cost: "$1,000 – $3,000"
  },
  {
    level: 1,
    name: "Very Low",
    scope: "Trivial / no scope impact",
    quality: "No noticeable quality impact",
    time: "Days only",
    cost: "< $1,000"
  }
];

export const MATRIX_THRESHOLDS = [
  {
    range: "16 – 25",
    min: 16,
    max: 25,
    level: "Critical" as const,
    requiredResponse: "Active mitigation required; escalate to sponsor immediately; weekly status to PM.",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    bgClass: "bg-red-100 hover:bg-red-200 text-red-900 border-red-300"
  },
  {
    range: "13 – 15",
    min: 13,
    max: 15,
    level: "High" as const,
    requiredResponse: "Mitigation plan documented within 10 days; weekly tracking; PM-managed contingency.",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
    bgClass: "bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300"
  },
  {
    range: "10 – 12",
    min: 10,
    max: 12,
    level: "Medium-High" as const,
    requiredResponse: "Mitigation plan within 15 days; bi-weekly tracking.",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    bgClass: "bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300"
  },
  {
    range: "7 – 9",
    min: 7,
    max: 9,
    level: "Medium" as const,
    requiredResponse: "Mitigation plan within 20 days; monthly tracking.",
    badgeClass: "bg-yellow-50 text-yellow-800 border-yellow-200",
    bgClass: "bg-yellow-100 hover:bg-yellow-200 text-yellow-900 border-yellow-300"
  },
  {
    range: "4 – 6",
    min: 4,
    max: 6,
    level: "Low" as const,
    requiredResponse: "Monitor; respond if conditions change.",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bgClass: "bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300"
  },
  {
    range: "1 – 3",
    min: 1,
    max: 3,
    level: "Very Low" as const,
    requiredResponse: "Watchlist only; no action unless impact increases.",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    bgClass: "bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300"
  }
];

export const STAKEHOLDER_TOLERANCES = [
  {
    stakeholder: "Sponsor (Mary)",
    tolerance: "Low tolerance for budget overrun (any spend > $150K requires formal approval). Medium tolerance for schedule slip (≤ 2 weeks acceptable). Zero tolerance for accessibility or security non-compliance."
  },
  {
    stakeholder: "Marketing Lead",
    tolerance: "Low tolerance for content-quality compromises; will accept timeline delay over publishing below-standard content."
  },
  {
    stakeholder: "IT / Hosting Operations",
    tolerance: "Zero tolerance for production stability risks; demands rollback plan for every cutover."
  },
  {
    stakeholder: "Legal / Compliance",
    tolerance: "Zero tolerance for GDPR or WCAG findings; escalates immediately."
  },
  {
    stakeholder: "Project Manager (Pascual Terlizzi)",
    tolerance: "Authority to accept risks with combined exposure ≤ $5,000 without sponsor approval."
  }
];
