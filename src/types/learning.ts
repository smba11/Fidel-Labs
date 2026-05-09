export type RouteId = "home" | "dashboard" | "fidel" | "conversation" | "library" | "progress";

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

export type Progress = {
  xp: number;
  streak: number;
  completedFamilies: string[];
  completedConversations: string[];
  correctAnswers: number;
  nativeListens: number;
  lastPracticedAt?: string;
};
