import type { Spiral } from "@/types";

export const PROMPTS: Record<Spiral, string[]> = {
  the_clock: [
    "Name something you built in the last year that has nothing to do with him.",
    "What's one thing you want for your life in five years that's entirely yours?",
    "List three things you've already done that younger you would be proud of.",
  ],
  the_replay: [
    "What's one thing that was true about the relationship that you've been leaving out of the story?",
    "Write the version of events where you were doing your best with what you knew.",
    "What would you say to a friend replaying the same scene you're stuck on?",
  ],
  the_mirror: [
    "What's one quality you have that has nothing to do with being desirable to someone else?",
    "Name something you're good at. Not modest — actually good at.",
    "What do your closest friends see in you that you forget about yourself?",
  ],
  the_what_if: [
    "What did the relationship cost you that you haven't fully acknowledged?",
    "Write one true thing about him that wasn't okay.",
    "What does your life have room for now that it didn't before?",
  ],
  the_but_he: [
    "Write one sentence about what it cost you to love someone who hurt you.",
    "Describe a moment where you felt small. Just describe it. No analysis.",
    "What would 'being loved well' actually look like? Be specific.",
  ],
  actually_okay: [
    "What made today feel okay, even slightly?",
    "What are you grateful exists in your life right now?",
    "Notice one thing around you that's steady and reliable.",
  ],
  i_dont_know: [
    "You don't have to know. What are you noticing right now, even if it doesn't make sense?",
    "If your body could speak right now, what would it say?",
    "What do you need most today? Don't overthink it.",
  ],
};

export const GENERIC_PROMPTS = [
  "What's one small thing you took care of today?",
  "Write whatever wants to come out. No prompt needed.",
  "What are you carrying right now that you haven't put into words yet?",
];

export function getPrompt(spiral?: Spiral): string {
  const pool = spiral ? PROMPTS[spiral] : GENERIC_PROMPTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
