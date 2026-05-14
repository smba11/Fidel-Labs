import type { LearnerGoal, LearnerProfile, PersonalizedRoadmap, ProficiencyId, ProficiencyLevel, RoadmapNode } from "@/types/learning";

export const defaultLearnerProfile: LearnerProfile = {
  knowledge: "some-words",
  understands: false,
  speaks: false,
  reads: false,
  ageGroup: "teen",
  goals: ["family", "confidence", "reading", "culture"],
  heritage: "diaspora",
};

export const proficiencyLevels: ProficiencyLevel[] = [
  {
    id: "beginner-1",
    label: "Beginner 1",
    shortLabel: "B1",
    summary: "Build sound confidence, family greetings, and first Fidel recognition.",
    speakingGoal: "Introduce yourself, greet elders, and answer simple family questions.",
    readingGoal: "Recognize core Fidel families and connect symbols to sounds.",
    listeningGoal: "Catch slow greetings, names, food words, and common responses.",
    cultureGoal: "Understand greeting respect, family titles, and coffee-table warmth.",
    registerGoal: "Know when to use safe formal phrases instead of casual shortcuts.",
    xpTarget: 0,
  },
  {
    id: "beginner-2",
    label: "Beginner 2",
    shortLabel: "B2",
    summary: "Move from memorized words into small real-life phrases.",
    speakingGoal: "Ask for food, water, directions, and simple help with confidence.",
    readingGoal: "Read high-frequency syllables in names, signs, and home words.",
    listeningGoal: "Understand repeated family-table phrases at natural speed.",
    cultureGoal: "Recognize hospitality cues, respect phrases, and celebration language.",
    registerGoal: "Compare full polite speech with common family shortcuts.",
    xpTarget: 240,
  },
  {
    id: "conversational",
    label: "Conversational",
    shortLabel: "C",
    summary: "Hold short conversations with family, cousins, and community.",
    speakingGoal: "Carry 2-4 minute conversations about school, home, food, and plans.",
    readingGoal: "Decode common Fidel words without relying on transliteration first.",
    listeningGoal: "Follow mixed Amharic-English speech and familiar accent patterns.",
    cultureGoal: "Understand family humor, gentle teasing, and diaspora code-switching.",
    registerGoal: "Switch between elder-safe language and cousin-friendly speech.",
    xpTarget: 620,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    shortLabel: "I",
    summary: "Speak with nuance and read everyday Amharic with support.",
    speakingGoal: "Explain opinions, memories, preferences, and daily routines.",
    readingGoal: "Read short posts, captions, menus, and simple stories.",
    listeningGoal: "Understand common media clips and community conversations.",
    cultureGoal: "Notice idioms, social expectations, and emotional subtext.",
    registerGoal: "Choose formal, neutral, or street phrasing intentionally.",
    xpTarget: 1150,
  },
  {
    id: "advanced",
    label: "Advanced",
    shortLabel: "A",
    summary: "Express identity, humor, and cultural context with range.",
    speakingGoal: "Tell stories, negotiate meaning, and recover from misunderstandings.",
    readingGoal: "Read longer passages with unfamiliar words and infer meaning.",
    listeningGoal: "Follow faster conversations across generations.",
    cultureGoal: "Understand proverbs, jokes, hospitality norms, and regional references.",
    registerGoal: "Use respectful forms, slang, and indirect phrasing with control.",
    xpTarget: 1900,
  },
  {
    id: "fluent",
    label: "Fluent",
    shortLabel: "F",
    summary: "Use Amharic naturally across family, travel, media, and culture.",
    speakingGoal: "Speak spontaneously across emotional, practical, and cultural topics.",
    readingGoal: "Read most everyday Fidel with speed and confidence.",
    listeningGoal: "Understand natural speech with accents, jokes, and interruptions.",
    cultureGoal: "Participate in culturally specific moments without overthinking.",
    registerGoal: "Adjust tone for elders, peers, service situations, and humor.",
    xpTarget: 3000,
  },
  {
    id: "native-like",
    label: "Native-like",
    shortLabel: "N",
    summary: "Refine accent, cultural instinct, and expressive depth.",
    speakingGoal: "Sound natural, fluid, emotionally precise, and culturally grounded.",
    readingGoal: "Read diverse formal and informal Amharic without scaffolding.",
    listeningGoal: "Follow fast, layered, regional, and humorous speech.",
    cultureGoal: "Understand subtle references, timing, silence, and implied meaning.",
    registerGoal: "Shape tone like a confident community insider.",
    xpTarget: 4500,
  },
];

export const roadmapNodes: RoadmapNode[] = [
  {
    id: "warm-greetings",
    title: "Warm greetings with elders",
    category: "Family",
    kind: "conversation",
    level: "beginner-1",
    description: "Practice a respectful first call with mom, grandma, or auntie.",
    minutes: 6,
    xp: 20,
    route: "conversation",
    targetId: "greeting-grandma",
    goals: ["family", "confidence", "culture"],
  },
  {
    id: "core-fidel-sounds",
    title: "Core Fidel sound map",
    category: "Reading Fidel",
    kind: "fidel",
    level: "beginner-1",
    description: "Learn the first rows as sounds, not just symbols.",
    minutes: 8,
    xp: 25,
    route: "fidel",
    targetId: "ha",
    goals: ["reading"],
  },
  {
    id: "food-table",
    title: "At the table",
    category: "Food",
    kind: "conversation",
    level: "beginner-2",
    description: "Ask for food, say thank you, and sound warm with family.",
    minutes: 7,
    xp: 25,
    route: "conversation",
    targetId: "at-the-table",
    goals: ["family", "travel", "culture"],
    unlockAfter: ["warm-greetings"],
  },
  {
    id: "daily-confidence",
    title: "Daily speaking reps",
    category: "Voice repetition",
    kind: "speaking",
    level: "beginner-2",
    description: "Repeat short phrases until they feel automatic.",
    minutes: 5,
    xp: 18,
    route: "library",
    goals: ["confidence"],
    unlockAfter: ["warm-greetings"],
  },
  {
    id: "cousin-code-switching",
    title: "With cousins",
    category: "Diaspora slang",
    kind: "conversation",
    level: "conversational",
    description: "Practice casual mixed-language rhythm without losing respect.",
    minutes: 8,
    xp: 30,
    route: "conversation",
    targetId: "with-cousins",
    goals: ["slang", "confidence"],
    unlockAfter: ["food-table"],
  },
  {
    id: "respect-registers",
    title: "Respect language",
    category: "Respect language",
    kind: "culture",
    level: "conversational",
    description: "Know what sounds warm, rude, polite, or too formal.",
    minutes: 6,
    xp: 22,
    route: "library",
    goals: ["culture", "family"],
    unlockAfter: ["food-table"],
  },
  {
    id: "travel-survival",
    title: "Airport and taxi survival",
    category: "Real-world scenarios",
    kind: "listening",
    level: "intermediate",
    description: "Prepare for quick, practical exchanges while traveling.",
    minutes: 9,
    xp: 35,
    route: "library",
    goals: ["travel", "confidence"],
    unlockAfter: ["daily-confidence"],
  },
  {
    id: "humor-and-softness",
    title: "Humor, teasing, and warmth",
    category: "Humor",
    kind: "culture",
    level: "advanced",
    description: "Learn why meaning often lives in tone, timing, and family context.",
    minutes: 10,
    xp: 40,
    route: "library",
    goals: ["culture", "slang"],
    unlockAfter: ["cousin-code-switching", "respect-registers"],
  },
];

export function getProficiencyForProgress(xp: number): ProficiencyLevel {
  return [...proficiencyLevels].reverse().find((level) => xp >= level.xpTarget) ?? proficiencyLevels[0];
}

export function getNextProficiency(current: ProficiencyId): ProficiencyLevel | undefined {
  const index = proficiencyLevels.findIndex((level) => level.id === current);
  return index >= 0 ? proficiencyLevels[index + 1] : undefined;
}

export function createRoadmap(profile: LearnerProfile, completedNodeIds: string[] = [], xp = 0): PersonalizedRoadmap {
  const baseLevel = inferStartingLevel(profile, xp);
  const priorityGoals = profile.goals.length ? profile.goals : defaultLearnerProfile.goals;
  const weighted = roadmapNodes
    .map((node) => ({
      node,
      score:
        node.goals.filter((goal) => priorityGoals.includes(goal)).length * 4 +
        (profile.heritage === "diaspora" && node.goals.includes("family") ? 2 : 0) +
        (profile.reads || profile.goals.includes("reading") ? (node.category === "Reading Fidel" ? 3 : 0) : 0) +
        (profile.speaks ? (node.kind === "conversation" ? 1 : 0) : node.kind === "speaking" ? 3 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.node.minutes - b.node.minutes)
    .map(({ node }) => node);

  const starter = weighted.slice(0, 5);
  const remainder = roadmapNodes.filter((node) => !starter.some((item) => item.id === node.id));
  const title = roadmapTitle(profile);

  return {
    id: title.toLowerCase().replaceAll(" ", "-"),
    title,
    subtitle: roadmapSubtitle(profile),
    focus: roadmapFocus(priorityGoals),
    recommendedLevel: baseLevel,
    accent: profile.goals.includes("culture") ? "amber" : profile.goals.includes("reading") ? "teal" : "champagne",
    nodes: [...starter, ...remainder].map((node, index) => ({
      ...node,
      unlockAfter: index < 2 ? undefined : node.unlockAfter,
      description: completedNodeIds.includes(node.id) ? `${node.description} Mastery saved.` : node.description,
    })),
  };
}

function inferStartingLevel(profile: LearnerProfile, xp: number): ProficiencyId {
  if (xp >= 1150 || (profile.speaks && profile.reads)) return "intermediate";
  if (xp >= 620 || profile.speaks || profile.knowledge === "can-speak") return "conversational";
  if (xp >= 240 || profile.understands || profile.knowledge === "understand-some" || profile.knowledge === "can-read") return "beginner-2";
  return "beginner-1";
}

function roadmapTitle(profile: LearnerProfile) {
  if (profile.goals.includes("reading")) return "Fidel Reading Path";
  if (profile.goals.includes("family")) return profile.heritage === "diaspora" ? "Diaspora Family Path" : "Family Conversation Path";
  if (profile.goals.includes("slang")) return "Speaking Confidence Path";
  if (profile.goals.includes("culture")) return "Cultural Fluency Path";
  return "Amharic Confidence Path";
}

function roadmapSubtitle(profile: LearnerProfile) {
  if (profile.heritage === "diaspora") return "Built around home, elders, identity, and real conversation.";
  if (profile.heritage === "native") return "A refinement path for reading, register, and expressive confidence.";
  return "A guided route into Amharic sound, culture, and everyday meaning.";
}

function roadmapFocus(goals: LearnerGoal[]) {
  const labels: Record<LearnerGoal, string> = {
    family: "family communication",
    confidence: "speaking confidence",
    reading: "Fidel reading",
    culture: "cultural fluency",
    travel: "travel readiness",
    slang: "casual conversation",
  };
  return goals.slice(0, 3).map((goal) => labels[goal]).join(" + ");
}
