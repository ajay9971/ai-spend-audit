import { AuditInput, AuditResult, ToolAuditResult, Recommendation, ToolName } from '@/types';
import { PRICING_DATA } from './pricingData';
import { v4 as uuidv4 } from 'uuid';

function auditCursor(tool: { plan: string; monthlySpend: number; seats: number }, teamSize: number): Recommendation {
  const { plan, monthlySpend, seats } = tool;

  // Business plan for small teams is overkill
  if (plan === 'business' && seats <= 2) {
    const savings = (40 - 20) * seats;
    return {
      action: 'downgrade',
      targetPlan: 'Pro',
      reason: `Business plan at $40/seat is overkill for ${seats} user(s). Pro at $20/seat has the same core features for small teams.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  }

  // Enterprise for small team
  if (plan === 'enterprise' && seats < 20) {
    const savings = (100 - 40) * seats;
    return {
      action: 'downgrade',
      targetPlan: 'Business',
      reason: `Enterprise is designed for 20+ seats. At ${seats} seats, Business plan covers all your needs at $40/seat.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  }

  // Compare with Windsurf if on Pro
  if (plan === 'pro') {
    const windsurfCost = 15 * seats;
    const cursorCost = 20 * seats;
    if (windsurfCost < cursorCost) {
      return {
        action: 'switch',
        targetTool: 'Windsurf Pro',
        reason: `Windsurf Pro at $15/seat offers comparable AI coding assistance. Switching saves $${cursorCost - windsurfCost}/mo for ${seats} seat(s).`,
        monthlySavings: cursorCost - windsurfCost,
        annualSavings: (cursorCost - windsurfCost) * 12,
      };
    }
  }

  return {
    action: 'keep',
    reason: `Your Cursor ${plan} plan is well-matched to your team size and usage.`,
    monthlySavings: 0,
    annualSavings: 0,
  };
}

function auditCopilot(tool: { plan: string; monthlySpend: number; seats: number }, useCase: string): Recommendation {
  const { plan, seats } = tool;

  // If not coding, Copilot is wrong tool entirely
  if (useCase !== 'coding' && useCase !== 'mixed') {
    const savings = tool.monthlySpend;
    return {
      action: 'switch',
      targetTool: 'Claude Pro or ChatGPT Plus',
      reason: `GitHub Copilot is optimized for code completion. For ${useCase} tasks, Claude or ChatGPT provides far better value at the same price point.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  }

  // Enterprise for small team
  if (plan === 'enterprise' && seats < 10) {
    const savings = (39 - 19) * seats;
    return {
      action: 'downgrade',
      targetPlan: 'Business',
      reason: `Copilot Enterprise adds policy controls and audit logs — unnecessary for teams under 10. Business plan saves $20/seat/month.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  }

  return {
    action: 'keep',
    reason: `GitHub Copilot ${plan} is appropriate for your team's coding workflow.`,
    monthlySavings: 0,
    annualSavings: 0,
  };
}

function auditClaude(tool: { plan: string; monthlySpend: number; seats: number }, teamSize: number): Recommendation {
  const { plan, seats } = tool;

  // Team plan minimum is 5 — if fewer users, Pro is cheaper
  if (plan === 'team' && seats < 5) {
    const teamCost = 30 * seats;
    const proCost = 20 * seats;
    return {
      action: 'downgrade',
      targetPlan: 'Pro (individual)',
      reason: `Claude Team requires a 5-seat minimum at $30/seat. With ${seats} users, individual Pro plans at $20/seat save $${teamCost - proCost}/mo.`,
      monthlySavings: teamCost - proCost,
      annualSavings: (teamCost - proCost) * 12,
    };
  }

  // Max plan — very expensive, check if Pro suffices
  if (plan === 'max' && seats >= 1) {
    const savings = (100 - 20) * seats;
    return {
      action: 'downgrade',
      targetPlan: 'Pro',
      reason: `Claude Max at $100/seat is for extremely high-volume users. Unless you're hitting Pro's limits daily, Claude Pro at $20/seat covers most use cases.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  }

  return {
    action: 'keep',
    reason: `Claude ${plan} is well-suited to your current usage pattern.`,
    monthlySavings: 0,
    annualSavings: 0,
  };
}

function auditChatGPT(tool: { plan: string; monthlySpend: number; seats: number }, useCase: string): Recommendation {
  const { plan, seats } = tool;

  // If coding, Cursor or Copilot is better
  if (useCase === 'coding' && (plan === 'plus' || plan === 'team')) {
    return {
      action: 'switch',
      targetTool: 'Cursor Pro or GitHub Copilot',
      reason: `For coding workflows, Cursor Pro ($20/seat) or GitHub Copilot Individual ($10/seat) provide inline IDE integration that ChatGPT can't match. You'd save money and get a better tool.`,
      monthlySavings: tool.monthlySpend * 0.3,
      annualSavings: tool.monthlySpend * 0.3 * 12,
    };
  }

  if (plan === 'team' && seats < 3) {
    const savings = (30 - 20) * seats;
    return {
      action: 'downgrade',
      targetPlan: 'Plus (individual)',
      reason: `ChatGPT Team adds collaboration features that aren't useful for ${seats} user(s). Individual Plus at $20/seat saves $${savings}/mo.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  }

  return {
    action: 'keep',
    reason: `ChatGPT ${plan} is a reasonable fit for your use case.`,
    monthlySavings: 0,
    annualSavings: 0,
  };
}

function auditAPISpend(tool: { plan: string; monthlySpend: number; seats: number }, toolName: string): Recommendation {
  const { monthlySpend } = tool;

  // High API spend — suggest credits
  if (monthlySpend > 200) {
    const savings = monthlySpend * 0.25;
    return {
      action: 'use_credits',
      reason: `At $${monthlySpend}/mo on ${toolName}, you're a strong candidate for discounted AI credits. Companies like Credex source unused enterprise credits at 20–40% below retail.`,
      monthlySavings: savings,
      annualSavings: savings * 12,
    };
  }

  return {
    action: 'keep',
    reason: `Your ${toolName} spend is within a normal range for your usage level.`,
    monthlySavings: 0,
    annualSavings: 0,
  };
}

export function runAudit(input: AuditInput): AuditResult {
  const results: ToolAuditResult[] = input.tools.map((toolInput) => {
    let recommendation: Recommendation;

    switch (toolInput.tool) {
      case 'cursor':
        recommendation = auditCursor(toolInput, input.teamSize);
        break;
      case 'github_copilot':
        recommendation = auditCopilot(toolInput, input.useCase);
        break;
      case 'claude':
        recommendation = auditClaude(toolInput, input.teamSize);
        break;
      case 'chatgpt':
        recommendation = auditChatGPT(toolInput, input.useCase);
        break;
      case 'anthropic_api':
      case 'openai_api':
        recommendation = auditAPISpend(toolInput, toolInput.tool);
        break;
      default:
        recommendation = {
          action: 'keep',
          reason: 'No specific optimization found for this tool at your current usage.',
          monthlySavings: 0,
          annualSavings: 0,
        };
    }

    return {
      tool: toolInput.tool,
      currentPlan: toolInput.plan,
      currentSpend: toolInput.monthlySpend,
      recommendation,
    };
  });

  const totalMonthlySavings = results.reduce(
    (sum, r) => sum + r.recommendation.monthlySavings, 0
  );

  return {
    auditId: uuidv4(),
    input,
    results,
    totalMonthlySavings: Math.round(totalMonthlySavings),
    totalAnnualSavings: Math.round(totalMonthlySavings * 12),
    createdAt: new Date().toISOString(),
  };
}