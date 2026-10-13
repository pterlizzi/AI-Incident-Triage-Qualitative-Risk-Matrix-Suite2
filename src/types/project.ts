export type RiskCategory = 'Technical' | 'External' | 'Organizational' | 'Project Mgmt' | 'Opportunity';

export type RiskLevel = 'Critical' | 'High' | 'Medium-High' | 'Medium' | 'Low' | 'Very Low';

export type RiskStrategy = 'Mitigate' | 'Transfer / Mitigate' | 'Accept (active)' | 'Avoid' | 'Avoid (Sponsor-managed)' | 'Enhance' | 'Exploit';

export type RiskStatus = 'Open' | 'Mitigating' | 'Closed' | 'Realized';

export type IssuePriority = 'High' | 'Medium' | 'Low';

export type IssueStatus = 'Open' | 'In Progress' | 'Resolved' | 'Escalated';

export type IssueType = 'Resource' | 'Technical' | 'Stakeholder' | 'Scope' | 'Quality' | 'External' | 'Process';

export interface ObjectiveImpacts {
  scope: number; // 1-5
  quality: number; // 1-5
  schedule: number; // 1-5
  cost: number; // 1-5
}

export interface RiskItem {
  id: string; // e.g. R-01
  category: RiskCategory;
  statement: string;
  owner: string;
  probability: number; // 1-5
  impacts: ObjectiveImpacts;
  score: number; // probability * max(impacts)
  level: RiskLevel;
  strategy: RiskStrategy;
  actionPlan: string;
  responsibleParty: string;
  triggerSymptom: string;
  residualP: number;
  residualScore: number;
  status: RiskStatus;
  comments: string;
  contingencyAllocation?: number;
}

export interface IssueItem {
  id: string; // e.g. I-001
  type: IssueType;
  description: string;
  priority: IssuePriority;
  impactOnObjectives: string;
  owner: string;
  status: IssueStatus;
  resolutionDate?: string;
  resolution?: string;
  comments: string;
}

export interface ContingencyDraw {
  id: string;
  date: string;
  amount: number;
  riskId?: string;
  issueId?: string;
  description: string;
  authorizedBy: string;
  sponsorNotified: boolean; // required if amount > 5000
}

export interface ContingencyReserve {
  totalBudget: number; // $15,000 PM contingency
  managementReserve: number; // $7,500 Sponsor reserve
  draws: ContingencyDraw[];
}

export interface TriageAssessmentResult {
  triageType: 'issue' | 'risk';
  classificationReason: string;
  isRealized: boolean;
  matchedRiskId?: string;
  matchedRiskStatement?: string;
  matchedContingencyPlan?: string;
  matchedIssueId?: string;
  category: RiskCategory | IssueType;
  recommendedOwner: string;
  probability: number; // 1-5
  probabilityReasoning: string;
  impacts: ObjectiveImpacts;
  impactReasoning: {
    scope: string;
    quality: string;
    schedule: string;
    cost: string;
  };
  maxImpact: number;
  calculatedScore: number;
  riskLevel: RiskLevel;
  requiredResponse: string;
  responseStrategy: RiskStrategy | string;
  recommendedActionPlan: string;
  triggerSymptom?: string;
  contingencyImpactAdvice: string;
  estimatedCostImpact?: number;
  stakeholderAlerts: string[];
}
