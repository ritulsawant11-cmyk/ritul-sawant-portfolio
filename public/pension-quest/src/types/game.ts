export type Screen =
  | 'welcome'
  | 'map'
  | 'story'
  | 'document'
  | 'question'
  | 'feedback'
  | 'enquiry'
  | 'completion'
  | 'journal';

export type MapViewMode = 'map' | 'list';

export type ChapterId = 'ch1' | 'ch2' | 'ch3' | 'ch4' | 'ch5';

export type ChapterStatus = 'available' | 'completed' | 'locked';

export type AnswerChoiceId = 'A' | 'B' | 'C';

export interface AnswerChoice {
  id: AnswerChoiceId;
  label: string;
  text: string;
  isCorrect: boolean;
  shortFeedback: string;
}

export interface MoneyHelperResource {
  title: string;
  topic: string;
  description: string;
  url: string;
  verifiedSource: string;
  reviewDate: string;
}

export interface FictionalDocument {
  title: string;
  issuer: string;
  recipient: string;
  date: string;
  referenceNumber: string;
  summary: string;
  keyDetails: { label: string; value: string }[];
  importantNotice: string;
}

export interface EnquiryOption {
  id: string;
  question: string;
  isUseful: boolean;
  category: 'address' | 'charges' | 'online_portal' | 'cash_withdrawal' | 'investment_guarantee';
  whyItHelps: string;
  practicalContext: string;
}

export interface Chapter {
  id: ChapterId;
  number: number;
  title: string;
  subtitle: string;
  status: ChapterStatus;
  summary: string;
  topic: string;
  isPlayable: boolean;
  comingSoonLabel?: string;
  storyIntro: string[];
  keyFacts: string[];
  document?: FictionalDocument;
  questionPrompt: string;
  choices: AnswerChoice[];
  correctChoiceId: AnswerChoiceId;
  primaryFeedback: string;
  schemeDependenceNote: string;
  nextStepsAdvice: string;
  enquiryTask?: {
    prompt: string;
    scenario: string;
    options: EnquiryOption[];
  };
  keyTakeaway: string;
  journalEntry: {
    title: string;
    keyTakeaway: string;
    misconceptionClarified: string;
    usefulQuestionsToAsk: string[];
    whatAlexLearned: string[];
    practicalTip: string;
  };
  moneyHelper: MoneyHelperResource;
}

export interface GameState {
  currentScreen: Screen;
  activeChapterId: ChapterId;
  selectedAnswerId: AnswerChoiceId | null;
  selectedEnquiryIds: string[];
  hasSubmittedEnquiry: boolean;
  attemptsCount: number;
  completedChapterIds: ChapterId[];
  unlockedJournalChapterIds: ChapterId[];
  mapViewMode: MapViewMode;
  showDisclaimerModal: boolean;
  showRestartModal: boolean;
  showSampleJournal: boolean;
}
