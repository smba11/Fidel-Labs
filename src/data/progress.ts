import type { Progress } from "@/types/learning";
import { defaultLearnerProfile } from "@/data/learning-architecture";

export const progressKey = "fidel-labs-progress-v4";
export const demoUserKey = "fidel-labs-demo-user";

export const defaultProgress: Progress = {
  xp: 180,
  streak: 4,
  completedFamilies: ["ha", "le"],
  completedConversations: [],
  completedRoadmapNodes: ["warm-greetings"],
  correctAnswers: 0,
  nativeListens: 0,
  speakingConfidence: 34,
  cultureMilestones: ["Greeting respect"],
  profile: defaultLearnerProfile,
  activeRoadmapId: "diaspora-family-path",
};

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
