export type RouteId = "home" | "dashboard" | "onboarding" | "review" | "fidel" | "conversation" | "library" | "progress";

export type LanguageId = "amharic" | "tigrinya" | "oromo" | "swahili" | "somali";

export type AppUser = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  demo: boolean;
};

export type FidelOrder = {
  fidel: string;
  transliteration: string;
  sound: string;
  english: string;
  note: string;
};

export type FidelFamily = {
  id: string;
  name: string;
  base: string;
  transliteration: string;
  category: "core" | "expanded";
  difficulty: 1 | 2 | 3;
  culturalNote: string;
  orders: FidelOrder[];
};

export type VocabularyItem = {
  id: string;
  amharic: string;
  transliteration: string;
  english: string;
  formal: string;
  street: string;
  cultural: string;
  audio: string;
};

export type ConversationLine = {
  speaker: "kid" | "elder" | "friend";
  amharic: string;
  transliteration: string;
  english: string;
  tone: "formal" | "street" | "culture";
  note: string;
};

export type ConversationLesson = {
  id: string;
  title: string;
  scenario: string;
  level: "Starter" | "Growing" | "Confident";
  xp: number;
  lines: ConversationLine[];
};

export type ProficiencyId = "beginner-1" | "beginner-2" | "conversational" | "intermediate" | "advanced" | "fluent" | "native-like";

export type ProficiencyLevel = {
  id: ProficiencyId;
  label: string;
  shortLabel: string;
  summary: string;
  speakingGoal: string;
  readingGoal: string;
  listeningGoal: string;
  cultureGoal: string;
  registerGoal: string;
  xpTarget: number;
};

export type LearnerGoal =
  | "family"
  | "confidence"
  | "reading"
  | "culture"
  | "travel"
  | "slang";

export type LearnerProfile = {
  name?: string;
  knowledge: "none" | "some-words" | "understand-some" | "can-speak" | "can-read";
  understands: boolean;
  speaks: boolean;
  reads: boolean;
  ageGroup: "kid" | "teen" | "adult";
  goals: LearnerGoal[];
  motivation?: string;
  confidenceLevel: number;
  preferredLanguage: LanguageId;
  heritage: "diaspora" | "native" | "curious";
};

export type PlacementAnswers = {
  understandsAmharic: boolean;
  canSpeak: boolean;
  canReadFidel: boolean;
  knowsGreetings: boolean;
  knowsFamilyWords: boolean;
  understandsFormalCasual: boolean;
  understandsDiasporaSpeech: boolean;
};

export type PlacementResult = {
  label: "Diaspora Beginner" | "Understands But Cannot Speak" | "Reader Beginner" | "Conversation Starter" | "Intermediate Speaker" | "Cultural Fluency Path";
  score: number;
  recommendedLevel: ProficiencyId;
  recommendedGoals: LearnerGoal[];
  takenAt: string;
  answers: PlacementAnswers;
};

export type LessonCategory =
  | "Family"
  | "Friends"
  | "Food"
  | "Daily life"
  | "Respect language"
  | "Diaspora slang"
  | "Ethiopian culture"
  | "Humor"
  | "Reading Fidel"
  | "Listening"
  | "Voice repetition"
  | "Real-world scenarios";

export type RoadmapNode = {
  id: string;
  title: string;
  category: LessonCategory;
  kind: "conversation" | "fidel" | "culture" | "listening" | "speaking";
  level: ProficiencyId;
  description: string;
  minutes: number;
  xp: number;
  route: RouteId;
  targetId?: string;
  goals: LearnerGoal[];
  unlockAfter?: string[];
};

export type PersonalizedRoadmap = {
  id: string;
  title: string;
  subtitle: string;
  focus: string;
  recommendedLevel: ProficiencyId;
  accent: string;
  nodes: RoadmapNode[];
};

export type SkillId = "speaking" | "readingFidel" | "listening" | "vocabulary" | "grammar" | "register" | "culture";

export type SkillMastery = {
  skill: SkillId;
  level: number;
  mastery: number;
  confidence: number;
  lastUpdatedAt?: string;
};

export type MasteryItemKind = "word" | "phrase" | "fidel" | "concept";

export type MasteryItem = {
  id: string;
  languageId: LanguageId;
  kind: MasteryItemKind;
  label: string;
  amharic?: string;
  transliteration?: string;
  english?: string;
  skill: SkillId;
  timesSeen: number;
  timesCorrect: number;
  timesIncorrect: number;
  confidenceScore: number;
  difficultyRating: 1 | 2 | 3 | 4 | 5;
  lastReviewedAt?: string;
  nextReviewAt: string;
};

export type ReviewItem = {
  id: string;
  masteryItemId: string;
  dueAt: string;
  reason: "new" | "weak" | "scheduled" | "mistake";
  priority: number;
};

export type Mistake = {
  id: string;
  lessonId: string;
  itemId?: string;
  skill: SkillId;
  prompt: string;
  expected: string;
  received?: string;
  note: string;
  createdAt: string;
};

export type LessonAttempt = {
  id: string;
  lessonId: string;
  lessonType: RoadmapNode["kind"] | "review";
  startedAt: string;
  completedAt: string;
  xpEarned: number;
  confidenceBefore: number;
  confidenceAfter: number;
  skillsPracticed: SkillId[];
  mistakes: Mistake[];
  summary: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  earnedAt: string;
};

export type TutorFeedback = {
  headline: string;
  improved: string[];
  missed: string[];
  review: string[];
  confidenceDelta: number;
  nextStep: string;
};

export type Progress = {
  xp: number;
  streak: number;
  completedFamilies: string[];
  completedConversations: string[];
  completedRoadmapNodes: string[];
  correctAnswers: number;
  nativeListens: number;
  speakingConfidence: number;
  skillMastery: Record<SkillId, SkillMastery>;
  masteryItems: Record<string, MasteryItem>;
  reviewQueue: ReviewItem[];
  mistakes: Mistake[];
  lessonAttempts: LessonAttempt[];
  achievements: Achievement[];
  placementResult?: PlacementResult;
  lastTutorFeedback?: TutorFeedback;
  cultureMilestones: string[];
  profile?: LearnerProfile;
  activeRoadmapId?: string;
  lastPracticedAt?: string;
};
