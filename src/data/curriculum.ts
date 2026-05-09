import type { ConversationLesson, FidelFamily, VocabularyItem } from "@/types/learning";

const orderLabels = [
  ["first order", "base vowel"],
  ["second order", "u sound"],
  ["third order", "i sound"],
  ["fourth order", "a sound"],
  ["fifth order", "e sound"],
  ["sixth order", "closed consonant"],
  ["seventh order", "o sound"],
] as const;

function family(
  id: string,
  base: string,
  transliteration: string,
  forms: string[],
  category: "core" | "expanded" = "core",
  difficulty: 1 | 2 | 3 = 1
): FidelFamily {
  const firstOrder = transliteration === "h" ? `${transliteration}a` : `${transliteration}e`;
  const sounds = [firstOrder, `${transliteration}u`, `${transliteration}i`, `${transliteration}a`, `${transliteration}e`, transliteration, `${transliteration}o`];
  return {
    id,
    name: `${base} family`,
    base,
    transliteration,
    category,
    difficulty,
    culturalNote: `The ${base} row helps learners spot ${transliteration}-sound patterns inside real Amharic words.`,
    orders: forms.map((fidel, index) => ({
      fidel,
      transliteration: sounds[index],
      sound: sounds[index],
      english: orderLabels[index][0],
      note: orderLabels[index][1],
    })),
  };
}

export const fidelFamilies: FidelFamily[] = [
  family("ha", "ሀ", "h", ["ሀ", "ሁ", "ሂ", "ሃ", "ሄ", "ህ", "ሆ"], "core", 1),
  family("le", "ለ", "l", ["ለ", "ሉ", "ሊ", "ላ", "ሌ", "ል", "ሎ"], "core", 1),
  family("hha", "ሐ", "h", ["ሐ", "ሑ", "ሒ", "ሓ", "ሔ", "ሕ", "ሖ"], "expanded", 2),
  family("me", "መ", "m", ["መ", "ሙ", "ሚ", "ማ", "ሜ", "ም", "ሞ"], "core", 1),
  family("sze", "ሠ", "s", ["ሠ", "ሡ", "ሢ", "ሣ", "ሤ", "ሥ", "ሦ"], "expanded", 2),
  family("re", "ረ", "r", ["ረ", "ሩ", "ሪ", "ራ", "ሬ", "ር", "ሮ"], "core", 1),
  family("se", "ሰ", "s", ["ሰ", "ሱ", "ሲ", "ሳ", "ሴ", "ስ", "ሶ"], "core", 1),
  family("she", "ሸ", "sh", ["ሸ", "ሹ", "ሺ", "ሻ", "ሼ", "ሽ", "ሾ"], "core", 1),
  family("qe", "ቀ", "q", ["ቀ", "ቁ", "ቂ", "ቃ", "ቄ", "ቅ", "ቆ"], "core", 2),
  family("be", "በ", "b", ["በ", "ቡ", "ቢ", "ባ", "ቤ", "ብ", "ቦ"], "core", 1),
  family("ve", "ቨ", "v", ["ቨ", "ቩ", "ቪ", "ቫ", "ቬ", "ቭ", "ቮ"], "expanded", 3),
  family("te", "ተ", "t", ["ተ", "ቱ", "ቲ", "ታ", "ቴ", "ት", "ቶ"], "core", 1),
  family("che", "ቸ", "ch", ["ቸ", "ቹ", "ቺ", "ቻ", "ቼ", "ች", "ቾ"], "core", 2),
  family("hne", "ኀ", "h", ["ኀ", "ኁ", "ኂ", "ኃ", "ኄ", "ኅ", "ኆ"], "expanded", 3),
  family("ne", "ነ", "n", ["ነ", "ኑ", "ኒ", "ና", "ኔ", "ን", "ኖ"], "core", 1),
  family("nye", "ኘ", "ny", ["ኘ", "ኙ", "ኚ", "ኛ", "ኜ", "ኝ", "ኞ"], "core", 2),
  family("a", "አ", "'", ["አ", "ኡ", "ኢ", "ኣ", "ኤ", "እ", "ኦ"], "core", 1),
  family("ke", "ከ", "k", ["ከ", "ኩ", "ኪ", "ካ", "ኬ", "ክ", "ኮ"], "core", 1),
  family("xe", "ኸ", "kh", ["ኸ", "ኹ", "ኺ", "ኻ", "ኼ", "ኽ", "ኾ"], "expanded", 3),
  family("we", "ወ", "w", ["ወ", "ዉ", "ዊ", "ዋ", "ዌ", "ው", "ዎ"], "core", 1),
  family("ayin", "ዐ", "'", ["ዐ", "ዑ", "ዒ", "ዓ", "ዔ", "ዕ", "ዖ"], "expanded", 2),
  family("ze", "ዘ", "z", ["ዘ", "ዙ", "ዚ", "ዛ", "ዜ", "ዝ", "ዞ"], "core", 1),
  family("zhe", "ዠ", "zh", ["ዠ", "ዡ", "ዢ", "ዣ", "ዤ", "ዥ", "ዦ"], "expanded", 3),
  family("ye", "የ", "y", ["የ", "ዩ", "ዪ", "ያ", "ዬ", "ይ", "ዮ"], "core", 1),
  family("de", "ደ", "d", ["ደ", "ዱ", "ዲ", "ዳ", "ዴ", "ድ", "ዶ"], "core", 1),
  family("je", "ጀ", "j", ["ጀ", "ጁ", "ጂ", "ጃ", "ጄ", "ጅ", "ጆ"], "core", 2),
  family("ge", "ገ", "g", ["ገ", "ጉ", "ጊ", "ጋ", "ጌ", "ግ", "ጎ"], "core", 1),
  family("tte", "ጠ", "t'", ["ጠ", "ጡ", "ጢ", "ጣ", "ጤ", "ጥ", "ጦ"], "core", 2),
  family("chhe", "ጨ", "ch'", ["ጨ", "ጩ", "ጪ", "ጫ", "ጬ", "ጭ", "ጮ"], "core", 2),
  family("ppe", "ጰ", "p'", ["ጰ", "ጱ", "ጲ", "ጳ", "ጴ", "ጵ", "ጶ"], "expanded", 3),
  family("tse", "ጸ", "ts", ["ጸ", "ጹ", "ጺ", "ጻ", "ጼ", "ጽ", "ጾ"], "core", 2),
  family("tshe", "ፀ", "ts'", ["ፀ", "ፁ", "ፂ", "ፃ", "ፄ", "ፅ", "ፆ"], "expanded", 3),
  family("fe", "ፈ", "f", ["ፈ", "ፉ", "ፊ", "ፋ", "ፌ", "ፍ", "ፎ"], "core", 1),
  family("pe", "ፐ", "p", ["ፐ", "ፑ", "ፒ", "ፓ", "ፔ", "ፕ", "ፖ"], "expanded", 2),
];

export const vocabulary: VocabularyItem[] = [
  { id: "selam", amharic: "ሰላም", transliteration: "selam", english: "hello / peace", formal: "Use it with anyone.", street: "Works like hi, hey, or peace.", cultural: "Peace is built into the greeting.", audio: "placeholder" },
  { id: "ameseginalehu", amharic: "አመሰግናለሁ", transliteration: "ameseginalehu", english: "thank you", formal: "Full polite thank-you.", street: "You may also hear a shorter አመሰግናለሁ said quickly.", cultural: "Respectful speech matters with elders.", audio: "placeholder" },
  { id: "buna", amharic: "ቡና", transliteration: "buna", english: "coffee", formal: "Coffee.", street: "Buna is an everyday culture word.", cultural: "Coffee ceremony is a social anchor.", audio: "placeholder" },
  { id: "wiha", amharic: "ውሃ", transliteration: "wiha", english: "water", formal: "Water.", street: "Ask quickly: ውሃ አለ?", cultural: "A survival word for visits.", audio: "placeholder" },
  { id: "bet", amharic: "ቤት", transliteration: "bet", english: "home / house", formal: "House or home.", street: "Can mean the family home vibe too.", cultural: "Home language is the heart of the app.", audio: "placeholder" },
  { id: "enat", amharic: "እናት", transliteration: "enat", english: "mother", formal: "Mother.", street: "Often replaced with mom/mama in mixed speech.", cultural: "Family titles carry warmth and respect.", audio: "placeholder" },
  { id: "abat", amharic: "አባት", transliteration: "abat", english: "father", formal: "Father.", street: "Baba/aba may appear depending on family.", cultural: "Family vocabulary helps diaspora kids connect.", audio: "placeholder" },
  { id: "injera", amharic: "እንጀራ", transliteration: "injera", english: "injera", formal: "Injera.", street: "Food word everyone recognizes.", cultural: "A gateway into meals and hospitality.", audio: "placeholder" },
];

export const conversations: ConversationLesson[] = [
  {
    id: "greeting-grandma",
    title: "Greeting Grandma",
    scenario: "A warm phone call after school",
    level: "Starter",
    xp: 20,
    lines: [
      { speaker: "kid", amharic: "ሰላም እናቴ", transliteration: "selam enate", english: "Hello mom/grandma", tone: "culture", note: "Families often use affectionate titles." },
      { speaker: "elder", amharic: "እንዴት ነህ?", transliteration: "indet neh?", english: "How are you?", tone: "formal", note: "Use ነህ for masculine, ነሽ for feminine." },
      { speaker: "kid", amharic: "ደህና ነኝ", transliteration: "dehna negn", english: "I am well.", tone: "formal", note: "A polite, safe answer." },
      { speaker: "elder", amharic: "በጣም ጥሩ", transliteration: "betam tiru", english: "Very good.", tone: "culture", note: "Encouragement phrase." },
    ],
  },
  {
    id: "at-the-table",
    title: "At the Table",
    scenario: "Food, thanks, and family warmth",
    level: "Growing",
    xp: 25,
    lines: [
      { speaker: "friend", amharic: "እንጀራ ትፈልጋለህ?", transliteration: "injera tifelegalih?", english: "Do you want injera?", tone: "formal", note: "Useful meal phrase." },
      { speaker: "kid", amharic: "አዎ እፈልጋለሁ", transliteration: "awo efelegalehu", english: "Yes, I want it.", tone: "formal", note: "Full sentence answer." },
      { speaker: "kid", amharic: "አመሰግናለሁ", transliteration: "ameseginalehu", english: "Thank you.", tone: "culture", note: "Always lands well with elders." },
    ],
  },
  {
    id: "with-cousins",
    title: "With Cousins",
    scenario: "Casual mixed-language hangout",
    level: "Confident",
    xp: 30,
    lines: [
      { speaker: "friend", amharic: "ምን አዲስ ነገር አለ?", transliteration: "min addis neger ale?", english: "What's new?", tone: "street", note: "Conversation opener." },
      { speaker: "kid", amharic: "ምንም የለም", transliteration: "minim yelem", english: "Nothing much.", tone: "street", note: "Casual answer." },
      { speaker: "friend", amharic: "እሺ እንሂድ", transliteration: "ishi inhid", english: "Okay, let's go.", tone: "street", note: "Everyday action phrase." },
    ],
  },
];
