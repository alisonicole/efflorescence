export type Spiral =
  | "the_clock"
  | "the_replay"
  | "the_mirror"
  | "the_what_if"
  | "the_but_he"
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
}

export interface HabitCompletion {
  objectId: string;
  habitId: string;
  completedDate: Date;
}

export interface JournalEntry {
  objectId: string;
  content: string;
  prompt: string;
  spiralContext?: Spiral;
  entryType?: "standard" | "rewrite" | "the_why" | "receipts";
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
  the_but_he: "The But He",
  actually_okay: "Actually okay",
  i_dont_know: "I don't know",
};

export const SPIRAL_DESCRIPTIONS: Record<Spiral, string> = {
  the_clock: "Counting how many days it's been. Wondering when it gets easier.",
  the_replay:
    "Going over what was said — what you said, what you should have said.",
  the_mirror: "Wondering what's wrong with you. Why you weren't enough.",
  the_what_if: "If you'd done things differently. If he'd chosen you.",
  the_but_he: "He wasn't all bad. There were good parts. You miss them.",
  actually_okay: "You're doing okay today. Maybe even better than okay.",
  i_dont_know: "You can't name it. Something is just off.",
};
