export interface PlanInfo {
  name: string;
  pricePerSeat: number;
  minSeats?: number;
  maxSeats?: number;
  bestFor: string[];
}

export interface ToolPricing {
  plans: Record<string, PlanInfo>;
  sourceUrl: string;
  verifiedDate: string;
}

export const PRICING_DATA: Record<string, ToolPricing> = {
  cursor: {
    sourceUrl: 'https://cursor.sh/pricing',
    verifiedDate: '2026-05-06',
    plans: {
      hobby: {
        name: 'Hobby',
        pricePerSeat: 0,
        bestFor: ['solo', 'learning'],
      },
      pro: {
        name: 'Pro',
        pricePerSeat: 20,
        bestFor: ['solo', 'coding'],
      },
      business: {
        name: 'Business',
        pricePerSeat: 40,
        minSeats: 1,
        bestFor: ['team', 'coding'],
      },
      enterprise: {
        name: 'Enterprise',
        pricePerSeat: 100,
        minSeats: 20,
        bestFor: ['large_team', 'coding'],
      },
    },
  },
  github_copilot: {
    sourceUrl: 'https://github.com/features/copilot#pricing',
    verifiedDate: '2026-05-06',
    plans: {
      individual: {
        name: 'Individual',
        pricePerSeat: 10,
        bestFor: ['solo', 'coding'],
      },
      business: {
        name: 'Business',
        pricePerSeat: 19,
        bestFor: ['team', 'coding'],
      },
      enterprise: {
        name: 'Enterprise',
        pricePerSeat: 39,
        bestFor: ['large_team', 'coding'],
      },
    },
  },
  claude: {
    sourceUrl: 'https://www.anthropic.com/pricing',
    verifiedDate: '2026-05-06',
    plans: {
      free: { name: 'Free', pricePerSeat: 0, bestFor: ['casual'] },
      pro: { name: 'Pro', pricePerSeat: 20, bestFor: ['solo', 'writing', 'research'] },
      max: { name: 'Max', pricePerSeat: 100, bestFor: ['power_user'] },
      team: { name: 'Team', pricePerSeat: 30, minSeats: 5, bestFor: ['team'] },
      enterprise: { name: 'Enterprise', pricePerSeat: 60, bestFor: ['large_team'] },
      api: { name: 'API Direct', pricePerSeat: 0, bestFor: ['developers'] },
    },
  },
  chatgpt: {
    sourceUrl: 'https://openai.com/chatgpt/pricing',
    verifiedDate: '2026-05-06',
    plans: {
      free: { name: 'Free', pricePerSeat: 0, bestFor: ['casual'] },
      plus: { name: 'Plus', pricePerSeat: 20, bestFor: ['solo'] },
      team: { name: 'Team', pricePerSeat: 30, minSeats: 2, bestFor: ['team'] },
      enterprise: { name: 'Enterprise', pricePerSeat: 60, bestFor: ['large_team'] },
      api: { name: 'API Direct', pricePerSeat: 0, bestFor: ['developers'] },
    },
  },
  anthropic_api: {
    sourceUrl: 'https://www.anthropic.com/pricing',
    verifiedDate: '2026-05-06',
    plans: {
      payg: { name: 'Pay As You Go', pricePerSeat: 0, bestFor: ['developers'] },
    },
  },
  openai_api: {
    sourceUrl: 'https://openai.com/api/pricing',
    verifiedDate: '2026-05-06',
    plans: {
      payg: { name: 'Pay As You Go', pricePerSeat: 0, bestFor: ['developers'] },
    },
  },
  gemini: {
    sourceUrl: 'https://ai.google.dev/pricing',
    verifiedDate: '2026-05-06',
    plans: {
      free: { name: 'Free', pricePerSeat: 0, bestFor: ['casual'] },
      pro: { name: 'Gemini Advanced', pricePerSeat: 20, bestFor: ['solo'] },
      ultra: { name: 'Ultra', pricePerSeat: 30, bestFor: ['power_user'] },
      api: { name: 'API', pricePerSeat: 0, bestFor: ['developers'] },
    },
  },
  windsurf: {
    sourceUrl: 'https://codeium.com/windsurf/pricing',
    verifiedDate: '2026-05-06',
    plans: {
      free: { name: 'Free', pricePerSeat: 0, bestFor: ['solo', 'coding'] },
      pro: { name: 'Pro', pricePerSeat: 15, bestFor: ['solo', 'coding'] },
      team: { name: 'Team', pricePerSeat: 35, bestFor: ['team', 'coding'] },
    },
  },
};