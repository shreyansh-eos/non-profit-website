export type StoryStatus = 'Pending Review' | 'Approved' | 'Published' | 'Rejected' | 'Archived';

export type StoryCategory =
  | 'Survivor Experiences'
  | 'Anonymous Stories'
  | 'Awareness Stories'
  | 'Personal Reflections'
  | 'Recovery and Support';

export type AuthorCreditPreference =
  | 'Anonymous'
  | 'Anonymous with a pseudonym'
  | 'First name only'
  | 'Other';

export interface Story {
  id: string;
  authorName: string; // e.g. "Anonymous Survivor" or preferred name
  creditPreference?: AuthorCreditPreference;
  category: StoryCategory;
  title: string;
  excerpt?: string;
  content: string;
  date: string;
  status: StoryStatus;
  consentGiven: boolean; // Publication consent (optional for private submission, required for publishing)
  privacySanitized: boolean;
  submittedAt: string;
  email?: string;
  allowContact?: boolean;
}

export type ResourceCategory =
  | 'Emergency Support'
  | 'Government Support'
  | "Women's Support Organizations"
  | 'Support for Men'
  | 'Legal Awareness'
  | 'Mental Health Support'
  | 'Child Protection Resources';

export interface SupportResource {
  id: string;
  name: string;
  category: ResourceCategory;
  typeOfSupport: string;
  phone?: string;
  tollFree?: string;
  whatsapp?: string;
  website: string;
  hours: string;
  languages: string[];
  description: string;
  isGovernment?: boolean;
  lastVerifiedDate: string; // e.g. "November 2026"
}

export interface MythFact {
  id: string;
  myth: string;
  fact: string;
  explanation: string;
  category: string;
}

export interface AwarenessCard {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  details: string[];
  keyTakeaway: string;
  category: 'Consent & Boundaries' | 'Survivor Support' | 'Legal Rights' | 'Gender Equality' | 'Due Process';
  readTime: string;
}

export type FAQCategory =
  | 'All'
  | 'Survivor Support'
  | 'Legal Rights'
  | "Aawaaz Setu's Mission"
  | 'Story Submission'
  | 'General';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Survivor Support' | 'Legal Rights' | "Aawaaz Setu's Mission" | 'Story Submission' | 'General' | string;
  highlight?: string;
}

export interface ContactMessage {
  id: string;
  name?: string;
  email?: string;
  subject: string;
  message: string;
  submittedAt: string;
  consentAcknowledged: boolean;
}

export interface SiteConfig {
  email: string;
  googleFormUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
}
