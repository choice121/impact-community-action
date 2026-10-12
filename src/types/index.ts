export type CausePillarId =
  | 'hunger'
  | 'housing'
  | 'health'
  | 'education'
  | 'families'
  | 'disaster'
  | 'seniors'
  | 'general';

export interface Pillar {
  id: CausePillarId;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  accentColor: string;
  badgeBg: string;
  iconName: string;
  coverImage: string;
  kpiLabel: string;
  kpiValue: string;
  goalCents: number;
  raisedCents: number;
  projectsCount: number;
  storiesCount: number;
  featuredStoryId?: string;
  tangibleImpactExamples: {
    amount: number;
    description: string;
  }[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
}

export interface ProjectUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
  image?: string;
  author: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  fullStory: string;
  pillarId: CausePillarId;
  status: 'active' | 'fully-funded' | 'completed';
  state: string;
  city: string;
  lat: number;
  lng: number;
  goalCents: number;
  raisedCents: number;
  donorsCount: number;
  daysRemaining: number;
  coverImage: string;
  galleryImages: string[];
  budgetBreakdown: {
    category: string;
    percentage: number;
    amountCents: number;
  }[];
  milestones: ProjectMilestone[];
  updates: ProjectUpdate[];
  createdAt: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  pillarId: CausePillarId;
  participantName: string; // First name or pseudonym per consent
  participantRole: string;
  location: string;
  state: string;
  year: number;
  quote: string;
  storyBody: string;
  amountThatMadeItPossibleCents: number;
  outcomeMetric: string;
  heroImage: string;
  beforeImage?: string;
  afterImage?: string;
  videoUrl?: string;
  relatedProjectSlug?: string;
  consentApproved: boolean;
}

export interface PublicActivityItem {
  id: string;
  donorName: string; // "Sarah M." or "Anonymous Donor"
  amountCents: number;
  pillarId: CausePillarId;
  pillarName: string;
  projectTitle?: string;
  timestamp: string;
  frequency: 'once' | 'monthly' | 'annually';
  inHonorOf?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  role: string;
  organization?: string;
  avatarUrl: string;
  pillarId?: CausePillarId;
}

export interface FinancialMetric {
  year: number;
  totalRaisedCents: number;
  programExpensePercent: number; // e.g. 88%
  adminExpensePercent: number;   // e.g. 7%
  fundraisingExpensePercent: number; // e.g. 5%
  livesImpacted: number;
  costPerOutcomeAverage: number;
}

export interface DonationRecord {
  id: string;
  donorId?: string;
  donorName: string;
  donorEmail: string;
  amountCents: number;
  currency: string;
  frequency: 'once' | 'monthly' | 'annually';
  pillarId: CausePillarId;
  projectId?: string;
  isAnonymous: boolean;
  inHonorOf?: string;
  message?: string;
  status: 'confirmed' | 'pending' | 'refunded';
  createdAt: string;
  receiptNumber: string;
}

// ==========================================
// PHASE 2 EXTENDED MODELS
// ==========================================

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  location: string;
  state: string;
  pillarId: CausePillarId;
  dateTime: string;
  durationHours: number;
  slotsAvailable: number;
  slotsFilled: number;
  requirements?: string[];
  coordinatorName: string;
}

export interface VolunteerSignup {
  id: string;
  opportunityId: string;
  opportunityTitle?: string;
  userId?: string;
  volunteerName: string;
  volunteerEmail: string;
  volunteerPhone: string;
  status: 'confirmed' | 'attended' | 'cancelled';
  createdAt: string;
}

export interface VolunteerHoursRecord {
  id: string;
  userId: string;
  opportunityTitle: string;
  date: string;
  hoursLogged: number;
  status: 'approved' | 'pending';
  pillarId: CausePillarId;
}

export interface HelpApplicationRecord {
  id: string;
  referenceNumber: string;
  pillarId: CausePillarId;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  city: string;
  state: string;
  householdSize: number;
  urgency: 'immediate' | 'week' | 'ongoing';
  preferredContact: 'phone' | 'email' | 'text';
  description: string;
  status: 'received' | 'under_review' | 'approved' | 'disbursed';
  assignedTo?: string;
  internalNotes?: string;
  createdAt: string;
}

export interface CommunityEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  isVirtual: boolean;
  eventDate: string;
  coverImage: string;
  capacity?: number;
  registeredCount: number;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  pillarId?: CausePillarId;
  category: 'Press Release' | 'Field Report' | 'Community Story' | 'Policy';
  coverImage: string;
  author: string;
  publishedAt: string;
}

export interface StorySubmissionRecord {
  id: string;
  pillarId: CausePillarId;
  authorName: string;
  locationCity: string;
  storyBody: string;
  firstNameOnly: boolean;
  consentGranted: boolean;
  status: 'pending_review' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AuditLogRecord {
  id: string;
  action: string;
  actorId?: string;
  entityType: string;
  entityId: string;
  payload: Record<string, any>;
  createdAt: string;
}
