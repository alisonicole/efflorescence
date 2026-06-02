"use client";

const features = [
  {
    icon: "🌀",
    title: "Spiral Check-In",
    tag: "Affective Labeling",
    what: "Each day, you name which emotional spiral you're caught in: The Clock, The Replay, The Mirror, The What If, The But He, I Don't Know, or Actually Okay.",
    research:
      "Lieberman et al. (2007) found that naming an emotion reduces amygdala activation by approximately 30%, even while still experiencing it. The act of labeling shifts processing from the limbic system toward the prefrontal cortex.",
    why: "Romantic rejection activates the same brain regions as physical pain. Naming the specific spiral creates enough cognitive distance to reduce the overwhelming quality of the feeling.",
    citation: "Lieberman et al., 2007 — UCLA",
    color: "clay",
  },
  {
    icon: "🌱",
    title: "The Garden",
    tag: "Behavioral Activation",
    what: "A visual habit tracker where each habit is a flower that grows over 7 days. Small, manageable actions: water intake, a walk, sleep, cooking a meal.",
    research:
      "Jacobson et al. (1996) demonstrated that behavioral activation alone is as effective as full CBT for depression. Martell (2001) extended this: action precedes mood, not the other way around. Doing small things breaks the withdrawal cycle grief creates.",
    why: "After a breakup, the default is contraction: less movement, less routine, more rumination. The garden makes small actions feel meaningful and visible, countering the motivational deficit of grief.",
    citation: "Jacobson et al., 1996 + Martell, 2001",
    color: "sage",
  },
  {
    icon: "🔒",
    title: "No-Contact Habits",
    tag: "Dopamine Regulation",
    what: "Optional habit seeds for no-contact streaks: not checking social media, not texting, not looking up an ex. Tracked the same way as other habits.",
    research:
      "Fisher et al. (2010) used fMRI to show that romantic rejection activates the same reward circuitry as cocaine withdrawal: the nucleus accumbens, the VTA, dopamine pathways. The urge to check is the withdrawal symptom, not the love itself.",
    why: "Each check creates a small dopamine hit followed by a crash, re-triggering the addiction cycle. Tracking avoidance as a habit makes the biological mechanism legible and gives it a container.",
    citation: "Fisher et al., 2010 — Rutgers University",
    color: "clay",
  },
  {
    icon: "🌬",
    title: "4-7-8 Breathing",
    tag: "Polyvagal / Somatic",
    what: "Guided breathing in the Ground menu: inhale 4 counts, hold 7, exhale 8. A 10-minute timer with phase cues, available any time.",
    research:
      "Porges' Polyvagal Theory (2011) explains that extended exhale activates the vagus nerve, shifting the nervous system from sympathetic (fight/flight) to parasympathetic (rest/digest). Cortisol measurably decreases within minutes.",
    why: "Grief activates the stress response chronically. When a spiral hits, the body is in physiological alarm. Breathing is the fastest evidence-based tool to interrupt that state before any cognitive work is possible.",
    citation: "Porges, 2011 — Polyvagal Theory",
    color: "sage",
  },
  {
    icon: "✍️",
    title: "The Diary",
    tag: "Expressive Writing",
    what: "Open journal with spiral-matched prompts. Write anything. Entries are saved and displayed with date. Prompts rotate based on your active spiral at check-in.",
    research:
      "Pennebaker and Beall (1986) launched a field: 15-20 minutes of expressive writing, 3-4 days, measurably reduces depression and improves immune function. Over 50 replications confirmed the effect. Writing creates narrative coherence, which reduces the intrusive quality of memory.",
    why: "Post-breakup rumination is unstructured replay. Writing structures it: it has a beginning, middle, and end. That containment reduces the spinning quality of grief thoughts.",
    citation: "Pennebaker & Beall, 1986 + 50+ replications",
    color: "gold",
  },
  {
    icon: "⚖️",
    title: "Full Picture",
    tag: "Cognitive Reappraisal",
    what: "A structured space for writing the real pros and cons of the relationship: not to be harsh, but to counterbalance the idealization that grief creates. Private, persistent, revisitable.",
    research:
      "Gross and John (2003) established cognitive reappraisal as the most effective emotion regulation strategy for long-term wellbeing. Bonanno (2004) documented selective memory in grief: we remember the good and suppress the difficult, which prolongs idealization.",
    why: "The brain in grief actively edits out the reasons the relationship ended. Full Picture is a record of reality you write when you're clear enough to do so, to read when you're not.",
    citation: "Gross & John, 2003 + Bonanno, 2004",
    color: "clay",
  },
  {
    icon: "🔄",
    title: "Rewrite Room",
    tag: "Cognitive Restructuring",
    what: "A guided space to take a thought from the spiral and rewrite it. Two-panel: the original thought, then a reframe. Not toxic positivity: a more accurate, complete version of the same story.",
    research:
      "Beck's cognitive restructuring (1979) showed that identifying and rewriting distorted thoughts changes their emotional charge. White and Epston's narrative therapy extends this: the story we tell is not fixed. The same events can be re-storied to foreground different meanings.",
    why: 'Breakup narratives often calcify: "I wasn\'t enough," "I\'ll never find this again." The Rewrite Room interrupts the calcification before it becomes the identity you carry forward.',
    citation: "Beck, 1979 + White & Epston, 1990",
    color: "gold",
  },
  {
    icon: "🌿",
    title: "The Why",
    tag: "Implementation Intentions",
    what: "A tab where you write your reason for healing: what you want for yourself, who you want to become, what life you're tending toward. Referenced from Ground when a spiral hits.",
    research:
      "Gollwitzer (1999) showed that if-then planning dramatically increases follow-through on difficult goals. The mechanism is pre-commitment: the decision is made before the emotional state floods the system. Value clarification (ACT) anchors behavior to identity, not willpower.",
    why: "In the middle of a spiral, prefrontal reasoning is compromised. The Why is something you wrote when you were clear. Reading your own words bypasses the argument-in-the-moment and reconnects to a deeper signal.",
    citation: "Gollwitzer, 1999 + Hayes ACT Framework",
    color: "bark",
  },
  {
    icon: "✨",
    title: "Inspire Feed",
    tag: "Psychoeducation",
    what: "A daily card feed with science-based context about what the brain does during grief, why spirals happen, and what helps. Matched to your current spiral. Includes milestone cards at 21, 30, 60, and 90 days.",
    research:
      'Bonanno (2004) documented that psychoeducation about grief: understanding what is happening neurologically, measurably reduces distress even when nothing about the situation changes. "I am not broken, this is what grief does to a brain" shifts your relationship to the symptom.',
    why: "Most people going through a breakup believe the intensity of their suffering means something is wrong with them. The Inspire feed contextualizes the experience as neurological and temporary, reducing shame and increasing tolerance for the process.",
    citation: "Bonanno, 2004 — Columbia University",
    color: "gold",
  },
  {
    icon: "📅",
    title: "66-Day Streak",
    tag: "Habit Formation Science",
    what: "The garden frames the 66-day arc explicitly. The goal is automaticity: the point where the habit no longer requires willpower. Missing one day is noted as having no impact on the outcome.",
    research:
      'Lally et al. (2010) at UCL studied 96 people forming new habits and found the average time to automaticity is 66 days (range 18-254). Critically: missing one day had no measurable effect on long-term habit formation. The popular "21 days" figure has no empirical basis.',
    why: "People expect grief to resolve faster than it does, and quit interventions when they don't feel better quickly. Anchoring to 66 days sets an accurate expectation and reframes a missed day as irrelevant, not a failure.",
    citation: "Lally et al., 2010 — University College London",
    color: "sage",
  },
  {
    icon: "🌸",
    title: "Milestone Cards",
    tag: "Reinforcement Scheduling",
    what: "At days 21, 30, 60, and 90, the app surfaces a milestone card acknowledging the neurological significance of that threshold. The garden becomes more radiant at each stage.",
    research:
      'Skinner\'s reinforcement schedules demonstrated that intermittent, predictable rewards sustain motivation more effectively than constant reward. Variable-ratio reinforcement at meaningful thresholds creates the "almost there" effect that keeps engagement through hard stretches.',
    why: "Healing is invisible in the short term. Milestones create explicit \"look how far you've come\" moments that grief's short-term focus prevents you from seeing naturally.",
    citation: "Skinner — behavioral reinforcement theory",
    color: "clay",
  },
  {
    icon: "🗓",
    title: "Journey Calendar",
    tag: "Self-Monitoring",
    what: "A calendar that marks each day you engage with the app. Days accumulate into a visible pattern. The breakup date is anchored as the start point.",
    research:
      'Kanfer (1970) established self-monitoring as a core mechanism of behavior change: the act of tracking behavior increases the likelihood of that behavior continuing. Visual progress activates the reward system and provides concrete counter-evidence to the grief narrative that "nothing is changing."',
    why: "Grief distorts time perception: it feels like things have always been this way and will never change. The calendar is visual proof that days are passing and you have shown up for yourself each one.",
    citation: "Kanfer, 1970 — self-monitoring + behavior change",
    color: "bark",
  },
];

const colorMap: Record<string, string> = {
  clay: "bg-clay/10",
  sage: "bg-sage/10",
  gold: "bg-gold/10",
  bark: "bg-bark/10",
};

const pillars = [
  {
    name: "CBT-Informed",
    desc: "Cognitive restructuring and reappraisal target the thought patterns that maintain the grief loop. The Rewrite Room and Full Picture implement this directly.",
  },
  {
    name: "Behavioral Activation",
    desc: "Action precedes mood, not the other way around. The Garden implements Jacobson's finding that small scheduled activities break the withdrawal cycle.",
  },
  {
    name: "Somatic / Polyvagal",
    desc: "The body must be regulated before cognitive work is effective. 4-7-8 breathing addresses the physiological component of grief that mindset work alone cannot reach.",
  },
  {
    name: "Narrative Therapy",
    desc: "The story we tell is not fixed. The Diary, Rewrite Room, and The Why all work on the narrative layer: who you are, what the relationship was, where you are going.",
  },
  {
    name: "Positive Psychology",
    desc: "Post-traumatic growth shows the most resilient people extract meaning and identity from difficult experiences. The Inspire feed and milestone system are anchored here.",
  },
];

export default function TheScience() {
  return (
    <div className="px-2.5 pb-8">
      {/* Intro */}
      <div className="mb-6 pt-2">
        <p className="text-xs text-muted leading-relaxed">
          Grief is not a mindset problem. It is a{" "}
          <span className="text-bark font-medium">neurological event</span> that
          disrupts memory consolidation, reward circuitry, and the prefrontal
          cortex&rsquo;s ability to regulate emotion. Every feature here is
          built around what the evidence says actually moves people through it.
        </p>
      </div>

      {/* Feature cards */}
      <div className="space-y-3 mb-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-card p-4 shadow-sm border border-border"
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${colorMap[f.color]}`}
              >
                {f.icon}
              </div>
              <div>
                <div className="text-sm font-medium text-bark">{f.title}</div>
                <div className="font-mono text-[8px] uppercase tracking-widest text-muted">
                  {f.tag}
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-widest text-clay mb-1">
                  What it does
                </p>
                <p className="text-xs text-muted leading-relaxed">{f.what}</p>
              </div>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-widest text-clay mb-1">
                  The research
                </p>
                <p className="text-xs text-muted leading-relaxed">
                  {f.research}
                </p>
                <span className="inline-block mt-1.5 bg-bark/5 rounded px-2 py-0.5 font-mono text-[8px] text-muted">
                  {f.citation}
                </span>
              </div>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-widest text-clay mb-1">
                  Why it helps
                </p>
                <p className="text-xs text-muted leading-relaxed">{f.why}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Therapeutic model */}
      <div className="bg-bark rounded-card p-5">
        <p className="font-mono text-[8px] uppercase tracking-widest text-clay mb-2">
          The Therapeutic Model
        </p>
        <p className="font-serif text-base italic text-cream mb-3 leading-snug">
          Multi-modal by design.
        </p>
        <p className="text-xs text-cream/60 leading-relaxed mb-4">
          No single modality is sufficient for the full complexity of
          post-breakup grief. Efflorescence draws from five evidence-based
          frameworks, each targeting a different system that grief disrupts.
        </p>
        <div className="space-y-2.5">
          {pillars.map((p) => (
            <div
              key={p.name}
              className="bg-cream/5 rounded-xl p-3 border border-cream/10"
            >
              <p className="font-mono text-[8px] uppercase tracking-widest text-clay mb-1">
                {p.name}
              </p>
              <p className="text-xs text-cream/60 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-cream/30 leading-relaxed">
          Research grounding does not mean clinical treatment. Efflorescence is
          a supportive tool, not a substitute for therapy.
        </p>
      </div>
    </div>
  );
}
