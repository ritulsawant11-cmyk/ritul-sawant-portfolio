export type ReadinessStatus = 'have' | 'look' | 'unsure';

export interface KnowledgeOption {
  id: string;
  title: string;
  hint: string;
  icon: string;
  isExclusive?: boolean;
}

export interface ReadinessChecklistItem {
  id: string;
  title: string;
  description: string;
  securityNote?: string;
  hint?: string;
  relevantIf?: (known: string[]) => boolean;
}

export interface GuidanceBranch {
  id: string;
  badge: string;
  title: string;
  summary: string;
  keyPoints: string[];
  suggestedQuestions: string[];
  officialLink?: {
    url: string;
    label: string;
    description: string;
  };
  isActive: (known: string[], readiness: Record<string, ReadinessStatus>) => boolean;
}

export interface OldPensionJourneyState {
  knownDetails: string[];
  readinessStatus: Record<string, ReadinessStatus>;
  selectedQuestionIds: Record<string, boolean>;
  userNotes: string;
  activeStep: number; // 1 to 4
}
