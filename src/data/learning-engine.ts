import { conversations, fidelFamilies, vocabulary } from "@/data/curriculum";
import { createRoadmap, defaultLearnerProfile, getProficiencyForProgress } from "@/data/learning-architecture";
import type {
  LearnerProfile,
  MasteryItem,
  Mistake,
  PersonalizedRoadmap,
  PlacementAnswers,
  PlacementResult,
  Progress,
  ReviewItem,
  RoadmapNode,
  SkillId,
  SkillMastery,
  TutorFeedback,
} from "@/types/learning";

const skillSeeds: Record<SkillId, SkillMastery> = {
  speaking: { skill: "speaking", level: 1, mastery: 28, confidence: 34 },
  readingFidel: { skill: "readingFidel", level: 1, mastery: 32, confidence: 38 },
  listening: { skill: "listening", level: 1, mastery: 24, confidence: 31 },
  vocabulary: { skill: "vocabulary", level: 1, mastery: 36, confidence: 42 },
  grammar: { skill: "grammar", level: 0, mastery: 18, confidence: 24 },
  register: { skill: "register", level: 0, mastery: 16, confidence: 22 },
  culture: { skill: "culture", level: 1, mastery: 40, confidence: 45 },
};

const skillByKind: Record<RoadmapNode["kind"], SkillId[]> = {
  conversation: ["speaking", "listening", "register"],
  fidel: ["readingFidel"],
  culture: ["culture", "register"],
  listening: ["listening", "vocabulary"],
  speaking: ["speaking", "vocabulary"],
};

export function createInitialSkillMastery(): Record<SkillId, SkillMastery> {
  return structuredClone(skillSeeds);
}

export function createInitialMasteryItems(now = new Date()): Record<string, MasteryItem> {
  const tomorrow = addDays(now, 1).toISOString();
  const wordItems = vocabulary.slice(0, 6).map((word, index) => ({
    id: `word-${word.id}`,
    languageId: "amharic" as const,
    kind: "word" as const,
    label: word.english,
    amharic: word.amharic,
    transliteration: word.transliteration,
    english: word.english,
    skill: "vocabulary" as SkillId,
    timesSeen: index < 2 ? 2 : 0,
    timesCorrect: index < 2 ? 1 : 0,
    timesIncorrect: index === 1 ? 1 : 0,
    confidenceScore: index < 2 ? 48 : 18,
    difficultyRating: (index < 2 ? 2 : 3) as 1 | 2 | 3 | 4 | 5,
    nextReviewAt: addDays(now, index < 3 ? 0 : 1).toISOString(),
  }));

  const fidelItems = fidelFamilies.slice(0, 5).map((family, index) => ({
    id: `fidel-${family.id}`,
    languageId: "amharic" as const,
    kind: "fidel" as const,
    label: family.name,
    amharic: family.base,
    transliteration: family.transliteration,
    english: `${family.transliteration} sound family`,
    skill: "readingFidel" as SkillId,
    timesSeen: index < 2 ? 1 : 0,
    timesCorrect: index === 0 ? 1 : 0,
    timesIncorrect: index === 1 ? 1 : 0,
    confidenceScore: index === 0 ? 60 : 24,
    difficultyRating: family.difficulty,
    nextReviewAt: index < 3 ? now.toISOString() : tomorrow,
  }));

  return Object.fromEntries([...wordItems, ...fidelItems].map((item) => [item.id, item]));
}

export function buildReviewQueue(progress: Progress, now = new Date()): ReviewItem[] {
  return Object.values(progress.masteryItems)
    .filter((item) => new Date(item.nextReviewAt) <= now || item.confidenceScore < 45)
    .map((item) => {
      const reason: ReviewItem["reason"] =
        item.confidenceScore < 35 ? "weak" : item.timesIncorrect > item.timesCorrect ? "mistake" : item.timesSeen === 0 ? "new" : "scheduled";
      return {
        id: `review-${item.id}`,
        masteryItemId: item.id,
        dueAt: item.nextReviewAt,
        reason,
        priority: Math.max(1, 100 - item.confidenceScore + item.timesIncorrect * 8),
      };
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 8);
}

export function runPlacement(answers: PlacementAnswers): PlacementResult {
  const score =
    Number(answers.understandsAmharic) * 18 +
    Number(answers.canSpeak) * 20 +
    Number(answers.canReadFidel) * 18 +
    Number(answers.knowsGreetings) * 12 +
    Number(answers.knowsFamilyWords) * 10 +
    Number(answers.understandsFormalCasual) * 12 +
    Number(answers.understandsDiasporaSpeech) * 10;

  const label: PlacementResult["label"] =
    score >= 72
      ? "Intermediate Speaker"
      : answers.canReadFidel && !answers.canSpeak
        ? "Reader Beginner"
        : answers.understandsAmharic && !answers.canSpeak
          ? "Understands But Cannot Speak"
          : answers.understandsFormalCasual || answers.understandsDiasporaSpeech
            ? "Cultural Fluency Path"
            : answers.canSpeak
              ? "Conversation Starter"
              : "Diaspora Beginner";

  return {
    label,
    score,
    recommendedLevel: score >= 72 ? "intermediate" : score >= 48 ? "conversational" : score >= 25 ? "beginner-2" : "beginner-1",
    recommendedGoals: [
      answers.canReadFidel ? "confidence" : "reading",
      answers.canSpeak ? "culture" : "confidence",
      answers.understandsDiasporaSpeech ? "slang" : "family",
    ],
    takenAt: new Date().toISOString(),
    answers,
  };
}

export function profileFromPlacement(profile: LearnerProfile, placement: PlacementResult): LearnerProfile {
  return {
    ...profile,
    understands: placement.answers.understandsAmharic,
    speaks: placement.answers.canSpeak,
    reads: placement.answers.canReadFidel,
    confidenceLevel: Math.max(profile.confidenceLevel, Math.round(placement.score / 1.2)),
    goals: [...new Set([...profile.goals, ...placement.recommendedGoals])],
  };
}

export function getAdaptiveRoadmap(progress: Progress): PersonalizedRoadmap {
  const profile = progress.profile ?? defaultLearnerProfile;
  const roadmap = createRoadmap(profile, progress.completedRoadmapNodes, progress.xp);
  const weakSkills = getWeakSkills(progress).map((skill) => skill.skill);
  return {
    ...roadmap,
    nodes: [...roadmap.nodes].sort((a, b) => {
      const aWeak = skillByKind[a.kind].some((skill) => weakSkills.includes(skill)) ? 1 : 0;
      const bWeak = skillByKind[b.kind].some((skill) => weakSkills.includes(skill)) ? 1 : 0;
      const aDone = progress.completedRoadmapNodes.includes(a.id) ? -1 : 0;
      const bDone = progress.completedRoadmapNodes.includes(b.id) ? -1 : 0;
      return bWeak - aWeak || bDone - aDone;
    }),
  };
}

export function getWeakSkills(progress: Progress): SkillMastery[] {
  return Object.values(progress.skillMastery).sort((a, b) => a.mastery + a.confidence - (b.mastery + b.confidence)).slice(0, 3);
}

export function getRecommendedNode(progress: Progress): RoadmapNode {
  const dueReviews = buildReviewQueue(progress);
  const roadmap = getAdaptiveRoadmap(progress);
  if (dueReviews.length >= 3) {
    return {
      id: "daily-review",
      title: "Daily adaptive review",
      category: "Listening",
      kind: "listening",
      level: getProficiencyForProgress(progress.xp).id,
      description: "Review the exact words, Fidel rows, and concepts your memory model says are due today.",
      minutes: 5,
      xp: 12,
      route: "review",
      goals: ["confidence", "reading"],
    };
  }
  return roadmap.nodes.find((node) => !progress.completedRoadmapNodes.includes(node.id)) ?? roadmap.nodes[0];
}

export function completeRoadmapNode(progress: Progress, node: RoadmapNode): Progress {
  const now = new Date();
  const skills = skillByKind[node.kind];
  const next = applySkillDelta(progress, skills, 8, 5, now);
  const attempt = createAttempt(node.id, node.kind, node.xp, skills, [], `You completed ${node.title}. Fidel will adapt your next step from this result.`);
  return refreshMemory({
    ...next,
    xp: next.completedRoadmapNodes.includes(node.id) ? next.xp : next.xp + node.xp,
    completedRoadmapNodes: [...new Set([...next.completedRoadmapNodes, node.id])],
    lessonAttempts: [attempt, ...next.lessonAttempts].slice(0, 30),
    lastTutorFeedback: createTutorFeedback(node.title, skills, [], getWeakSkills(next).map((skill) => skill.skill)),
    lastPracticedAt: now.toISOString(),
  });
}

export function completeLesson(progress: Progress, lessonId: string, kind: RoadmapNode["kind"], xp: number, missedSkill?: SkillId): Progress {
  const now = new Date();
  const skills = skillByKind[kind];
  const mistakes = missedSkill ? [createMistake(lessonId, missedSkill)] : [];
  const next = applySkillDelta(progress, skills, missedSkill ? 4 : 9, missedSkill ? 1 : 6, now);
  const attempt = createAttempt(lessonId, kind, xp, skills, mistakes, mistakes.length ? "Good progress, with one weak area marked for review." : "Clean pass. Your memory model moved this skill forward.");
  return refreshMemory({
    ...next,
    xp: next.xp + xp,
    mistakes: [...mistakes, ...next.mistakes].slice(0, 40),
    lessonAttempts: [attempt, ...next.lessonAttempts].slice(0, 30),
    lastTutorFeedback: createTutorFeedback(lessonId, skills, mistakes, missedSkill ? [missedSkill] : []),
    lastPracticedAt: now.toISOString(),
  });
}

export function answerReview(progress: Progress, masteryItemId: string, correct: boolean): Progress {
  const item = progress.masteryItems[masteryItemId];
  if (!item) return progress;
  const now = new Date();
  const nextItem: MasteryItem = {
    ...item,
    timesSeen: item.timesSeen + 1,
    timesCorrect: item.timesCorrect + Number(correct),
    timesIncorrect: item.timesIncorrect + Number(!correct),
    confidenceScore: clamp(item.confidenceScore + (correct ? 14 : -10), 0, 100),
    lastReviewedAt: now.toISOString(),
    nextReviewAt: addDays(now, correct ? intervalFor(item.confidenceScore) : 1).toISOString(),
  };
  const next = applySkillDelta(
    { ...progress, masteryItems: { ...progress.masteryItems, [masteryItemId]: nextItem } },
    [item.skill],
    correct ? 5 : 1,
    correct ? 4 : -4,
    now
  );
  return refreshMemory({
    ...next,
    xp: next.xp + (correct ? 5 : 2),
    lastTutorFeedback: createTutorFeedback("Daily review", [item.skill], correct ? [] : [createMistake("daily-review", item.skill, item)]),
    lastPracticedAt: now.toISOString(),
  });
}

function applySkillDelta(progress: Progress, skills: SkillId[], masteryDelta: number, confidenceDelta: number, now: Date): Progress {
  const skillMastery = { ...progress.skillMastery };
  for (const skill of skills) {
    const current = skillMastery[skill];
    const mastery = clamp(current.mastery + masteryDelta, 0, 100);
    skillMastery[skill] = {
      ...current,
      mastery,
      confidence: clamp(current.confidence + confidenceDelta, 0, 100),
      level: Math.floor(mastery / 20),
      lastUpdatedAt: now.toISOString(),
    };
  }
  return {
    ...progress,
    skillMastery,
    speakingConfidence: skillMastery.speaking.confidence,
  };
}

function refreshMemory(progress: Progress): Progress {
  return {
    ...progress,
    reviewQueue: buildReviewQueue(progress),
  };
}

function createAttempt(lessonId: string, lessonType: RoadmapNode["kind"] | "review", xpEarned: number, skills: SkillId[], mistakes: Mistake[], summary: string) {
  const now = new Date().toISOString();
  return {
    id: `attempt-${lessonId}-${Date.now()}`,
    lessonId,
    lessonType,
    startedAt: now,
    completedAt: now,
    xpEarned,
    confidenceBefore: 0,
    confidenceAfter: 0,
    skillsPracticed: skills,
    mistakes,
    summary,
  };
}

function createMistake(lessonId: string, skill: SkillId, item?: MasteryItem): Mistake {
  return {
    id: `mistake-${lessonId}-${skill}-${Date.now()}`,
    lessonId,
    itemId: item?.id,
    skill,
    prompt: item?.label ?? skill,
    expected: item?.amharic ?? "stronger recall",
    note: `Fidel noticed ${skill} needs another pass and added it to review.`,
    createdAt: new Date().toISOString(),
  };
}

function createTutorFeedback(title: string, skills: SkillId[], mistakes: Mistake[], weakSkills: SkillId[] = []): TutorFeedback {
  const missed = mistakes.map((mistake) => `${mistake.skill}: ${mistake.note}`);
  return {
    headline: mistakes.length ? "Good work. I found one thing to bring back soon." : "Nice. This moved your roadmap forward.",
    improved: skills.map((skill) => `Your ${skillLabel(skill)} got stronger.`),
    missed,
    review: weakSkills.length ? weakSkills.map((skill) => `${skillLabel(skill)} will appear in review.`) : ["No urgent review added from this lesson."],
    confidenceDelta: mistakes.length ? 1 : 5,
    nextStep: mistakes.length
      ? "We will bring the weak form back naturally instead of making you restart."
      : "Continue to the next recommended lesson while the memory is fresh.",
  };
}

function skillLabel(skill: SkillId) {
  const labels: Record<SkillId, string> = {
    speaking: "speaking confidence",
    readingFidel: "Fidel reading",
    listening: "listening",
    vocabulary: "vocabulary",
    grammar: "grammar sense",
    register: "formal vs casual control",
    culture: "cultural understanding",
  };
  return labels[skill];
}

function intervalFor(confidence: number) {
  if (confidence > 85) return 14;
  if (confidence > 70) return 7;
  if (confidence > 50) return 3;
  return 1;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
