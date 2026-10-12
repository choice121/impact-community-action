export interface SiteSettings {
  legalName: string;
  shortName: string;
  tagline: string;
  ein: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone: string;
  email: string;
  defaultDonationUrl: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    x?: string;
  };
  baseCounters: {
    mealsDelivered: number;
    nightsSheltered: number;
    familiesAssisted: number;
    childrenSupported: number;
    emergencyAidDeployed: number;
    volunteersMobilized: number;
  };
}

export const siteConfig: {
  demoMode: boolean;
  settings: SiteSettings;
  donationFeeRate: number; // 2.9% + 30 cents standard non-profit card fee
  donationFixedFee: number;
} = {
  // Controlled by environment: defaults to false to run fully on live Supabase data
  demoMode: import.meta.env.VITE_DEMO_MODE === 'true',
  donationFeeRate: 0.029,
  donationFixedFee: 0.30,
  settings: {
    legalName: "Impact Community Action, Inc.",
    shortName: "ICA",
    tagline: "Small acts. Real impact.",
    ein: "84-2194820",
    address: {
      street: "742 North Highland Avenue, Suite 400",
      city: "Columbus",
      state: "OH",
      zip: "43215",
      country: "United States",
    },
    phone: "(614) 252-2799",
    email: "giving@impactaction.org",
    defaultDonationUrl: "https://donate.stripe.com/demo_ica_giving",
    socialLinks: {
      facebook: "https://facebook.com/impactaction",
      instagram: "https://instagram.com/impactaction",
      linkedin: "https://linkedin.com/company/impactaction",
      youtube: "https://youtube.com/@impactaction",
      x: "https://x.com/impactaction",
    },
    baseCounters: {
      mealsDelivered: 184520,
      nightsSheltered: 42180,
      familiesAssisted: 14650,
      childrenSupported: 8920,
      emergencyAidDeployed: 1240000,
      volunteersMobilized: 3450,
    },
  },
};

/**
 * Provider-agnostic donation URL resolver
 * Allows default org-wide link or specific pillar/project link overrides
 */
export function getDonationUrl(params: {
  amount: number;
  frequency: 'once' | 'monthly' | 'annually';
  pillarId?: string;
  projectId?: string;
  inHonorOf?: string;
  isAnonymous?: boolean;
  coverFees?: boolean;
}): string {
  const base = siteConfig.settings.defaultDonationUrl;
  const searchParams = new URLSearchParams();
  searchParams.set('amount', params.amount.toString());
  searchParams.set('freq', params.frequency);
  if (params.pillarId) searchParams.set('pillar', params.pillarId);
  if (params.projectId) searchParams.set('project', params.projectId);
  if (params.inHonorOf) searchParams.set('honor', params.inHonorOf);
  if (params.isAnonymous) searchParams.set('anon', '1');
  if (params.coverFees) searchParams.set('cover_fees', '1');
  searchParams.set('return_url', `${window.location.origin}/donate/thank-you?amount=${params.amount}&pillar=${params.pillarId || 'general'}`);

  return `${base}?${searchParams.toString()}`;
}
