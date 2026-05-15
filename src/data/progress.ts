import type { Progress } from "@/types/learning";
import { defaultLearnerProfile } from "@/data/learning-architecture";
import { buildReviewQueue, createInitialMasteryItems, createInitialSkillMastery } from "@/data/learning-engine";

export const progressKey = "fidel-labs-progress-v5";
export const demoUserKey = "fidel-labs-demo-user";

const masteryItems = createInitialMasteryItems();

export const defaultProgress: Progress = {
  xp: 180,
  streak: 4,
  completedFamilies: ["ha", "le"],
  completedConversations: [],
  completedRoadmapNodes: ["warm-greetings"],
  correctAnswers: 0,
  nativeListens: 0,
  speakingConfidence: 34,
  skillMastery: createInitialSkillMastery(),
  masteryItems,
  reviewQueue: [],
  mistakes: [],
  lessonAttempts: [],
  achievements: [],
  cultureMilestones: ["Greeting respect"],
  profile: defaultLearnerProfile,
  activeRoadmapId: "diaspora-family-path",
};

defaultProgress.reviewQueue = buildReviewQueue(defaultProgress);

export function readProgress(): Progress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const saved = window.localStorage.getItem(progressKey);
    return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

export function writeProgress(progress: Progress) {
  window.localStorage.setItem(progressKey, JSON.stringify(progress));
}
