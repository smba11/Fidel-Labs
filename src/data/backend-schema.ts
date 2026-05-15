import type { Achievement, LearnerProfile, LessonAttempt, MasteryItem, Mistake, PersonalizedRoadmap, PlacementResult, ReviewItem, SkillMastery } from "@/types/learning";

export type FirestoreUserDocument = {
  profile: {
    name: string;
    email: string;
    photoURL: string | null;
  };
  learnerProfile: LearnerProfile;
  activeRoadmap: PersonalizedRoadmap;
  placementResult?: PlacementResult;
  skillMastery: Record<string, SkillMastery>;
  masteryItems: Record<string, MasteryItem>;
  reviewQueue: ReviewItem[];
  lessonAttempts: LessonAttempt[];
  mistakes: Mistake[];
  achievements: Achievement[];
  xp: number;
  streak: number;
  lastActiveDate?: string;
  updatedAt: unknown;
  createdAt?: unknown;
};

export const firestoreCollections = {
  users: "users",
  profiles: "profiles",
  languages: "languages",
  roadmaps: "roadmaps",
  units: "units",
  lessons: "lessons",
  userProgress: "userProgress",
  skillMastery: "skillMastery",
  masteryItems: "masteryItems",
  reviewQueue: "reviewQueue",
  lessonAttempts: "lessonAttempts",
  mistakes: "mistakes",
  achievements: "achievements",
  placementResults: "placementResults",
} as const;

export const backendPlan = [
  "users/{uid}: identity, app preferences, account metadata",
  "users/{uid}/profile/current: learner profile, motivation, goals, heritage, preferred language",
  "users/{uid}/progress/current: XP, streak, proficiency, skill mastery, active roadmap",
  "users/{uid}/masteryItems/{itemId}: spaced repetition state for words, phrases, Fidel, and concepts",
  "users/{uid}/lessonAttempts/{attemptId}: lesson history, confidence changes, mistakes, skills practiced",
  "users/{uid}/mistakes/{mistakeId}: repeated weak areas and correction notes",
  "languages/{languageId}: language metadata for Amharic, Tigrinya, Oromo, Swahili, Somali",
  "languages/{languageId}/lessons/{lessonId}: reusable lesson content and steps",
  "languages/{languageId}/roadmaps/{roadmapId}: base roadmap templates",
] as const;
