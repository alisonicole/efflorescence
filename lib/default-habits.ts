import Parse from "parse";
import type { HabitCategory } from "@/types";

export interface HabitMetadata {
  category: HabitCategory;
  name: string;
  icon: string;
  group: "detox" | "feed" | "heal";
  why: string;
}

export const HABIT_METADATA: HabitMetadata[] = [
  // DETOX
  {
    category: "no_contact",
    name: "no contact",
    icon: "🌿",
    group: "detox",
    why: "Every day you didn't reach out is a day you chose yourself.",
  },
  {
    category: "no_stalking",
    name: "didn't look",
    icon: "🌼",
    group: "detox",
    why: "Not looking is an act of care for your own mind.",
  },
  {
    category: "no_old_photos",
    name: "let the past be",
    icon: "🪻",
    group: "detox",
    why: "The past is preserved. It doesn't need to be revisited to be real.",
  },
  // FEED
  {
    category: "eat_water",
    name: "eat & drink",
    icon: "🍵",
    group: "feed",
    why: "Your body is doing the work. Feed it.",
  },
  {
    category: "move_body",
    name: "move",
    icon: "🌻",
    group: "feed",
    why: "Movement changes the chemistry. Even a little.",
  },
  {
    category: "fresh_air",
    name: "fresh air",
    icon: "🌸",
    group: "feed",
    why: "Outside is always available. So is the sky.",
  },
  {
    category: "talk",
    name: "talk to someone",
    icon: "🌺",
    group: "feed",
    why: "You don't have to carry this alone.",
  },
  {
    category: "sleep",
    name: "sleep",
    icon: "🌙",
    group: "feed",
    why: "Rest is not a reward. It's the foundation.",
  },
  {
    category: "get_dressed",
    name: "get dressed",
    icon: "🌱",
    group: "feed",
    why: "Getting dressed is a small act of believing in the day.",
  },
  // HEAL
  {
    category: "journal",
    name: "journal",
    icon: "🪷",
    group: "heal",
    why: "Writing it down changes it. Even a sentence counts.",
  },
  {
    category: "just_for_you",
    name: "something for you",
    icon: "💮",
    group: "heal",
    why: "Purely yours. Not for output, not for anyone else.",
  },
  {
    category: "therapy",
    name: "therapy / support",
    icon: "💙",
    group: "heal",
    why: "Being witnessed is its own kind of healing.",
  },
];

export const HABIT_WHY: Record<HabitCategory, string> = Object.fromEntries(
  HABIT_METADATA.map((h) => [h.category, h.why]),
) as Record<HabitCategory, string>;

export async function seedDefaultHabits(user: Parse.User): Promise<void> {
  const ParseHabit = Parse.Object.extend("Habit");
  const habits = HABIT_METADATA.map((meta) => {
    const habit = new ParseHabit();
    habit.set("user", user);
    habit.set("name", meta.name);
    habit.set("category", meta.category);
    habit.set("icon", meta.icon);
    habit.set("isActive", true);
    habit.setACL(new Parse.ACL(user));
    return habit;
  });
  await Parse.Object.saveAll(habits);
  user.set("habitsSeeded", true);
  await user.save();
}
