export type Spiral =
  | "the_clock"
  | "the_replay"
  | "the_mirror"
  | "the_what_if"
  | "the_should_be"
  | "actually_okay"
  | "i_dont_know";

export type HabitCategory =
  | "no_contact"
  | "no_stalking"
  | "no_old_photos"
  | "eat_water"
  | "move_body"
  | "fresh_air"
  | "talk"
  | "sleep"
  | "get_dressed"
  | "journal"
  | "just_for_you"
  | "therapy"
  | "custom";

export type Season =
  | "late_autumn"
  | "winter"
  | "early_spring"
  | "full_spring"
  | "summer";

export type GardenState =
  | "dormant"
  | "stirring"
  | "tending"
  | "blooming"
  | "radiant";

export interface TenderUser {
  objectId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  healingStartDate: Date;
}

export interface CheckIn {
  objectId: string;
  date: Date;
  spiral: Spiral;
  createdAt: Date;
}

export interface Habit {
  objectId: string;
  name: string;
  category: HabitCategory;
  icon: string;
  isActive: boolean;
  createdAt: Date;
  habitGroup?: string;
  lastCelebrated?: number;
}

export interface HabitCompletion {
  objectId: string;
  habitId: string;
  completedDate: Date;
  isRestDay?: boolean;
}

export interface JournalEntry {
  objectId: string;
  content: string;
  prompt: string;
  spiralContext?: Spiral;
  entryType?:
    | "standard"
    | "rewrite"
    | "the_why"
    | "receipts"
    | "affirmation"
    | "weekly_reflection";
  pass1Content?: string;
  createdAt: Date;
}

export interface GardenData {
  dayCount: number;
  season: Season;
  gardenState: GardenState;
  todaySpiral?: Spiral;
}

export interface WhyEntry {
  objectId: string;
  content: string;
  createdAt: Date;
}

export interface FullPictureItem {
  objectId: string;
  side: "good" | "true";
  text: string;
  createdAt: Date;
}

export interface BlossomSpecies {
  emoji: string;
  name: string;
}

export interface GratitudeEntry {
  objectId: string;
  content: string;
  createdAt: Date;
}

export interface BlossomEntry {
  objectId: string;
  habitCategory: HabitCategory;
  habitName: string;
  streakStartDate: Date;
  streakEndDate: Date;
  streakLength: number;
  createdAt: Date;
}

export type InspireContentType = "science" | "note" | "milestone";

export interface InspireItem {
  id: string;
  type: InspireContentType;
  spirals: Array<Spiral | "all">;
  dayRange?: [number, number];
  milestoneDay?: 21 | 30 | 60 | 90;
  title?: string;
  body: string;
}

export const SPIRAL_LABELS: Record<Spiral, string> = {
  the_clock: "The Clock",
  the_replay: "The Replay",
  the_mirror: "The Mirror",
  the_what_if: "The What If",
  the_should_be: "The Should Be",
  actually_okay: "Actually okay",
  i_dont_know: "I don't know",
};

export const SPIRAL_DESCRIPTIONS: Record<Spiral, string> = {
  the_clock:
    "You're counting the days. You're doing the math on how old you'll be. The window feels like it's closing.",
  the_replay:
    "You keep running the same conversation. What you said, what you should have said, what would have changed everything.",
  the_mirror:
    "There's something wrong with you. That's the only explanation that keeps coming back.",
  the_what_if:
    "You almost had it. If one thing had gone differently, everything would be different.",
  the_should_be:
    "You should be over this by now. You're not. Something must be wrong with how you're healing.",
  actually_okay: "Today feels lighter. You're not going to overthink it.",
  i_dont_know: "Nothing specific. Just a weight you can't name.",
};
