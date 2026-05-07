export type ToolName =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface ToolInput {
  tool: ToolName;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export interface Recommendation {
  action: 'downgrade' | 'switch' | 'keep' | 'use_credits';
  targetPlan?: string;
  targetTool?: string;
  reason: string;
  monthlySavings: number;
  annualSavings: number;
}

export interface ToolAuditResult {
  tool: ToolName;
  currentPlan: string;
  currentSpend: number;
  recommendation: Recommendation;
}

export interface AuditResult {
  auditId: string;
  input: AuditInput;
  results: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  createdAt: string;
}

export interface LeadData {
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  auditId: string;
}