import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_RISKS } from './src/data/seedData';
import { findSimilarRisk } from './src/utils/matrixCalculations';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback heuristic scoring logic based on New Company Website Risk Management Plan
function heuristicTriage(description: string, currentRisks: any[] = []) {
  const desc = description.toLowerCase();
  const risksPool = (currentRisks && currentRisks.length > 0) ? currentRisks : INITIAL_RISKS;
  
  // Realized vs Potential detection
  const isRealized = desc.includes('already') || 
    desc.includes('occurred') || 
    desc.includes('happened') || 
    desc.includes('detected') || 
    desc.includes('failed') || 
    desc.includes('left') || 
    desc.includes('absence') || 
    desc.includes('announced') || 
    desc.includes('refuses') || 
    desc.includes('reported') || 
    desc.includes('delaying') || 
    desc.includes('bottlenecked') ||
    desc.includes('requested') ||
    desc.includes('requesting');

  const triageType = isRealized ? 'issue' : 'risk';

  // Check matching existing risks using both findSimilarRisk and keyword checks
  let matchedRisk: any = findSimilarRisk(description, risksPool);
  if (!matchedRisk) {
    if (desc.includes('crm') || desc.includes('lead-form') || desc.includes('vertical') || (desc.includes('api') && (desc.includes('field') || desc.includes('vendor')))) {
      matchedRisk = risksPool.find(r => r.id === 'R-01');
    } else if (desc.includes('wcag') || desc.includes('accessibility') || desc.includes('color-contrast') || desc.includes('contrast') || desc.includes('a11y')) {
      matchedRisk = risksPool.find(r => r.id === 'R-02');
    } else if (desc.includes('contractor') || desc.includes('frontend sow') || desc.includes('vendor x') || desc.includes('frontend build delay')) {
      matchedRisk = risksPool.find(r => r.id === 'R-03');
    } else if (desc.includes('mary') && (desc.includes('approval') || desc.includes('design review') || desc.includes('sponsor delay') || desc.includes('5-day'))) {
      matchedRisk = risksPool.find(r => r.id === 'R-04');
    } else if (desc.includes('bio') || desc.includes('consultant') || desc.includes('500+') || desc.includes('directory submission')) {
      matchedRisk = risksPool.find(r => r.id === 'R-05');
    } else if (desc.includes('medical') || desc.includes('leave') || desc.includes('sick') || desc.includes('absence') || desc.includes('bill') || desc.includes('bob')) {
      matchedRisk = risksPool.find(r => r.id === 'R-06');
    } else if (desc.includes('outage') || desc.includes('cutover') || desc.includes('hosting') || desc.includes('maintenance window') || desc.includes('cms vendor outage')) {
      matchedRisk = risksPool.find(r => r.id === 'R-07');
    } else if (desc.includes('gdpr') || desc.includes('privacy') || desc.includes('compliance review') || desc.includes('cookie-consent')) {
      matchedRisk = risksPool.find(r => r.id === 'R-08');
    } else if (desc.includes('cost') || desc.includes('budget baseline') || desc.includes('effort estimate') || desc.includes('optimistic') || desc.includes('overrun')) {
      matchedRisk = risksPool.find(r => r.id === 'R-09');
    } else if (desc.includes('lcp') || desc.includes('performance') || desc.includes('speed') || desc.includes('2.5s') || desc.includes('page load')) {
      matchedRisk = risksPool.find(r => r.id === 'R-10');
    } else if (desc.includes('scope') || desc.includes('careers') || desc.includes('press') || desc.includes('media') || desc.includes('feature add') || desc.includes('post-design')) {
      matchedRisk = risksPool.find(r => r.id === 'R-11');
    } else if (desc.includes('fy2026') || desc.includes('funding') || desc.includes('budget pressure') || desc.includes('cfo')) {
      matchedRisk = risksPool.find(r => r.id === 'R-12');
    } else if (desc.includes('handoff') || desc.includes('it ops') || desc.includes('production support') || desc.includes('runbook')) {
      matchedRisk = risksPool.find(r => r.id === 'R-13');
    } else if (desc.includes('share') || desc.includes('referral') || desc.includes('marketing reach') || desc.includes('case study')) {
      matchedRisk = risksPool.find(r => r.id === 'R-14');
    } else if (desc.includes('rfp') || desc.includes('accessible clients') || desc.includes('compliance messaging')) {
      matchedRisk = risksPool.find(r => r.id === 'R-15');
    }
  }

  // Calculate impacts
  let p = isRealized ? 5 : 3;
  let sc = 2;
  let qu = 2;
  let sch = 3;
  let co = 2;

  if (desc.includes('critical') || desc.includes('blocking') || desc.includes('outage') || desc.includes('wcag')) {
    qu = 5;
    sch = 4;
  }
  if (desc.includes('schedule') || desc.includes('slip') || desc.includes('delay') || desc.includes('week')) {
    sch = 4;
  }
  if (desc.includes('cost') || desc.includes('budget') || desc.includes('$')) {
    co = 4;
  }
  if (desc.includes('scope') || desc.includes('deliverable')) {
    sc = 4;
  }

  if (matchedRisk) {
    p = matchedRisk.probability;
    sc = matchedRisk.impacts.scope;
    qu = matchedRisk.impacts.quality;
    sch = matchedRisk.impacts.schedule;
    co = matchedRisk.impacts.cost;
  }

  const maxImpact = Math.max(sc, qu, sch, co);
  const score = p * maxImpact;

  let riskLevel = 'Low';
  let requiredResponse = 'Monitor; respond if conditions change.';
  if (score >= 16) {
    riskLevel = 'Critical';
    requiredResponse = 'Active mitigation required; escalate to sponsor immediately; weekly status to PM.';
  } else if (score >= 13) {
    riskLevel = 'High';
    requiredResponse = 'Mitigation plan documented within 10 days; weekly tracking; PM-managed contingency.';
  } else if (score >= 10) {
    riskLevel = 'Medium-High';
    requiredResponse = 'Mitigation plan within 15 days; bi-weekly tracking.';
  } else if (score >= 7) {
    riskLevel = 'Medium';
    requiredResponse = 'Mitigation plan within 20 days; monthly tracking.';
  } else if (score >= 4) {
    riskLevel = 'Low';
    requiredResponse = 'Monitor; respond if conditions change.';
  } else {
    riskLevel = 'Very Low';
    requiredResponse = 'Watchlist only; no action unless impact increases.';
  }

  const stakeholderAlerts: string[] = [];
  if (qu >= 4 || desc.includes('wcag') || desc.includes('accessibility')) {
    stakeholderAlerts.push("Sponsor (Mary) & Compliance: Zero tolerance for accessibility non-compliance (WCAG 2.1 AA). Immediate remediation required.");
  }
  if (sch >= 4) {
    stakeholderAlerts.push("Sponsor (Mary): Schedule slip is approaching/exceeding acceptable 2-week tolerance buffer.");
  }
  if (desc.includes('hosting') || desc.includes('outage') || desc.includes('cutover')) {
    stakeholderAlerts.push("IT / Hosting Operations: Zero tolerance for production stability risks; demands documented rollback plan.");
  }

  const isSimilarToExistingRisk = Boolean(matchedRisk);
  const similarRiskId = matchedRisk ? matchedRisk.id : undefined;
  const similarityExplanation = matchedRisk 
    ? `This incident directly matches documented risk ${matchedRisk.id} ("${matchedRisk.statement}"). The agreed action plan and contingency allocation are already established in the Risk Management Plan. Creating a new duplicate risk entry is prohibited.`
    : undefined;
  const allowNewRiskCreation = !matchedRisk;

  return {
    triageType,
    classificationReason: isRealized 
      ? "This event has already occurred or materialized as an operational impediment, so it must be tracked in the Issue Log." 
      : "This is an uncertain potential event with future probability, so it belongs in the Risk Register.",
    isRealized,
    matchedRiskId: matchedRisk ? matchedRisk.id : undefined,
    matchedRiskStatement: matchedRisk ? matchedRisk.statement : undefined,
    matchedContingencyPlan: matchedRisk ? matchedRisk.actionPlan : undefined,
    category: matchedRisk ? matchedRisk.category : (desc.includes('vendor') ? 'External' : (desc.includes('code') || desc.includes('api') ? 'Technical' : 'Organizational')),
    recommendedOwner: matchedRisk ? matchedRisk.owner : (desc.includes('api') || desc.includes('dev') ? 'Bob (Dev)' : 'Pascual Terlizzi (PM)'),
    probability: p,
    probabilityReasoning: isRealized ? "Event has already occurred (Probability = 5 / realized)." : `Assessed at level ${p} based on current project cadence and historical milestones.`,
    impacts: { scope: sc, quality: qu, schedule: sch, cost: co },
    impactReasoning: {
      scope: `Level ${sc} impact assessed against deliverables.`,
      quality: `Level ${qu} impact assessed against WCAG and sponsor standards.`,
      schedule: `Level ${sch} impact on target November 2026 Go-Live milestone.`,
      cost: `Level ${co} impact assessed against project baseline.`
    },
    maxImpact,
    calculatedScore: score,
    riskLevel,
    requiredResponse,
    responseStrategy: matchedRisk ? matchedRisk.strategy : (score >= 13 ? 'Mitigate' : 'Monitor'),
    recommendedActionPlan: matchedRisk ? matchedRisk.actionPlan : "Assess immediate workaround, assign primary owner, and monitor against scheduled milestone gates.",
    contingencyImpactAdvice: matchedRisk?.contingencyAllocation 
      ? `Covered by pre-allocated contingency line item ($${matchedRisk.contingencyAllocation.toLocaleString()}).` 
      : "Draw from PM $15,000 Contingency Reserve if costs exceed $1,000. Note: Draws > $5,000 trigger mandatory sponsor notification.",
    stakeholderAlerts,
    isSimilarToExistingRisk,
    similarRiskId,
    similarityExplanation,
    allowNewRiskCreation
  };
}

// POST /api/triage endpoint
app.post('/api/triage', async (req, res) => {
  try {
    const { description, currentRisks, currentIssues } = req.body;
    if (!description || typeof description !== 'string') {
      return res.status(400).json({ error: 'Incident description is required' });
    }

    if (!ai) {
      // Return heuristic response if API key not available
      const result = heuristicTriage(description, currentRisks);
      return res.json(result);
    }

    const systemPrompt = `You are an expert Project Management Risk & Issue Triage Copilot grounded strictly in the PMBOK 8th-Edition methodology and the documented "New Company Website" Risk Management Plan.

PROJECT CONTEXT & GOVERNANCE:
- Target Go-Live: November 2026. Total Project Budget Cap: $150,000.
- Contingency Reserve: $15,000 held by PM specifically for known risks in the Risk Register. PM can release without sponsor approval. Drawing > $5,000 in a single event triggers immediate sponsor notification.
- Management Reserve: $7,500 held by Sponsor for unknown-unknowns.
- Sponsor (Mary) Tolerances: Low tolerance for budget overrun (> $150K requires formal approval). Medium tolerance for schedule slip (≤ 2 weeks acceptable). ZERO tolerance for accessibility (WCAG 2.1 AA) or security non-compliance.
- IT/Hosting Tolerances: Zero tolerance for production stability risks; demands rollback plan for every cutover.
- Marketing Lead Tolerances: Zero tolerance for content-quality compromises.
- PM (Pascual Terlizzi) Authority: Authority to accept risks with combined exposure ≤ $5,000 without sponsor approval.

EVALUATION METHODOLOGY:
1. CLASSIFICATION:
   - "issue": An incident that has ALREADY OCCURRED or is currently an active impediment (e.g. "Bill is on medical leave", "CRM API lacks field", "accessibility lint failed", "vendor announced maintenance window"). Tracks in ISSUE LOG.
   - "risk": An uncertain event or condition that, IF it occurs, has a positive or negative effect in the future (e.g. "contractor might decline SOW", "LCP speed may exceed 2.5s", "Sponsor may delay approval"). Tracks in RISK REGISTER.

2. CONTINGENCY / PREVIOUS IDENTIFICATION:
   - Check if this incident matches or is pretty similar to any existing Risk in New Company Website project:
     - R-01 (CRM API integration complexity / missing fields)
     - R-02 (WCAG 2.1 AA accessibility audit Severity-1 findings)
     - R-03 (Frontend contractor unavailable / SOW)
     - R-04 (Sponsor Mary delays design approval beyond 5 days)
     - R-05 (Consultants 500+ late bio submission)
     - R-06 (Bob, Bill, or Christine unplanned absence / illness)
     - R-07 (Hosting/CMS vendor cutover outage)
     - R-08 (Legal/Compliance GDPR / privacy issue)
     - R-09 (Effort estimates optimistic / cost overrun, $15K contingency)
     - R-10 (Site performance LCP > 2.5s)
     - R-11 (Marketing Lead scope expansion post-M04)
     - R-12 (FY2026 budget pressure)
     - R-13 (IT/Hosting ops not ready for handoff)
     - R-14 (Consultant social share opportunity)
     - R-15 (WCAG compliant vendor market opportunity)
   - If matched, explicitly link to that Risk ID, retrieve its documented contingency/action plan, and state whether contingency reserve funds should be drawn.

3. 5x5 PROBABILITY AND IMPACT SCORING:
   - Probability (1-5): 5: >70% (Very High, or 5 if realized issue), 4: 50-70% (High), 3: 30-50% (Medium), 2: 10-30% (Low), 1: <10% (Very Low).
   - Impact by Objective (1-5 each):
     - Scope: 1 (Trivial), 2 (Minor), 3 (Significant change), 4 (Major reduction), 5 (Loss of deliverable)
     - Quality: 1 (No impact), 2 (Acceptable), 3 (Requires sponsor review), 4 (Major degradation), 5 (Unacceptable to sponsor)
     - Schedule: 1 (Days only), 2 (<1 week slip), 3 (1-2 week slip), 4 (2-4 week slip), 5 (>4 week slip)
     - Cost: 1 (<$1,000), 2 ($1,000-$3,000), 3 ($3,000-$7,500), 4 ($7,500-$15,000), 5 (>$15,000)
   - Formula: Score = Probability * max(Scope, Quality, Schedule, Cost)
   - Risk Level & Required Response:
     - 16-25 Critical: "Active mitigation required; escalate to sponsor immediately; weekly status to PM."
     - 13-15 High: "Mitigation plan documented within 10 days; weekly tracking; PM-managed contingency."
     - 10-12 Medium-High: "Mitigation plan within 15 days; bi-weekly tracking."
     - 7-9 Medium: "Mitigation plan within 20 days; monthly tracking."
     - 4-6 Low: "Monitor; respond if conditions change."
     - 1-3 Very Low: "Watchlist only; no action unless impact increases."

4. CRITICAL MANDATORY DUPLICATE RISK DETECTION:
   - Check if the incident or threat is pretty similar, related to, or an instance of any risk ALREADY DOCUMENTED in the Risk Register (R-01 through R-15).
   - If it is similar to any existing documented risk:
     - You MUST set "isSimilarToExistingRisk": true
     - You MUST set "similarRiskId": the ID of the matched risk (e.g. "R-01", "R-02", etc.)
     - You MUST set "similarityExplanation": Clearly explain why it is similar and that the mitigation action is already established under that risk entry.
     - You MUST set "allowNewRiskCreation": false (DO NOT allow creating a new risk entry because the action is already identified in the documented risk).
   - If and only if it is a genuinely new, unprecedented risk with no similarity to R-01–R-15:
     - Set "isSimilarToExistingRisk": false
     - Set "allowNewRiskCreation": true`;

    const userPrompt = `Evaluate this project incident/event description:\n"${description}"\n\nCross-reference against New Company Website Risk Register and Issue Log. Provide complete structured evaluation. Check if it is similar to any documented risk and enforce duplicate creation blocking if similar.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            triageType: { type: Type.STRING, description: "'issue' or 'risk'" },
            classificationReason: { type: Type.STRING },
            isRealized: { type: Type.BOOLEAN },
            matchedRiskId: { type: Type.STRING, description: "e.g. 'R-01' or empty if none" },
            matchedRiskStatement: { type: Type.STRING },
            matchedContingencyPlan: { type: Type.STRING },
            category: { type: Type.STRING },
            recommendedOwner: { type: Type.STRING },
            probability: { type: Type.INTEGER, description: "1 to 5" },
            probabilityReasoning: { type: Type.STRING },
            impacts: {
              type: Type.OBJECT,
              properties: {
                scope: { type: Type.INTEGER },
                quality: { type: Type.INTEGER },
                schedule: { type: Type.INTEGER },
                cost: { type: Type.INTEGER }
              },
              required: ['scope', 'quality', 'schedule', 'cost']
            },
            impactReasoning: {
              type: Type.OBJECT,
              properties: {
                scope: { type: Type.STRING },
                quality: { type: Type.STRING },
                schedule: { type: Type.STRING },
                cost: { type: Type.STRING }
              },
              required: ['scope', 'quality', 'schedule', 'cost']
            },
            maxImpact: { type: Type.INTEGER },
            calculatedScore: { type: Type.INTEGER },
            riskLevel: { type: Type.STRING },
            requiredResponse: { type: Type.STRING },
            responseStrategy: { type: Type.STRING },
            recommendedActionPlan: { type: Type.STRING },
            triggerSymptom: { type: Type.STRING },
            contingencyImpactAdvice: { type: Type.STRING },
            stakeholderAlerts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            isSimilarToExistingRisk: { type: Type.BOOLEAN },
            similarRiskId: { type: Type.STRING },
            similarityExplanation: { type: Type.STRING },
            allowNewRiskCreation: { type: Type.BOOLEAN }
          },
          required: [
            'triageType',
            'classificationReason',
            'isRealized',
            'category',
            'recommendedOwner',
            'probability',
            'probabilityReasoning',
            'impacts',
            'impactReasoning',
            'maxImpact',
            'calculatedScore',
            'riskLevel',
            'requiredResponse',
            'responseStrategy',
            'recommendedActionPlan',
            'contingencyImpactAdvice',
            'stakeholderAlerts',
            'isSimilarToExistingRisk',
            'allowNewRiskCreation'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini triage error:', error);
    // Fall back gracefully to heuristic triage
    const fallback = heuristicTriage(req.body.description, req.body.currentRisks);
    return res.json(fallback);
  }
});

// Configure Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
