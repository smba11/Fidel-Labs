export type RouteId = "home" | "dashboard" | "onboarding" | "fidel" | "conversation" | "library" | "progress";

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
  knowledge: "none" | "some-words" | "understand-some" | "can-speak" | "can-read";
  understands: boolean;
  speaks: boolean;
  reads: boolean;
  ageGroup: "kid" | "teen" | "adult";
  goals: LearnerGoal[];
  heritage: "diaspora" | "native" | "curious";
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

export type Progress = {
  xp: number;
  streak: number;
  completedFamilies: string[];
  completedConversations: string[];
  completedRoadmapNodes: string[];
  correctAnswers: number;
  nativeListens: number;
  speakingConfidence: number;
  cultureMilestones: string[];
  profile?: LearnerProfile;
  activeRoadmapId?: string;
  lastPracticedAt?: string;
};
