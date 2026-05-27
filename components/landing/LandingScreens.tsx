/* Phone screen mockups for the landing page */

function FlowerSvg({ stage, color }: { stage: number; color: string }) {
  const sw = "1.5";
  const stemColor = "#4A6741";
  const leafColor = "#7A9E6E";

  if (stage === 0)
    return (
      <svg width="40" height="54" viewBox="0 0 56 76" fill="none">
        <ellipse
          cx="28"
          cy="69"
          rx="13"
          ry="3.5"
          fill="#C4A882"
          opacity="0.55"
        />
        <ellipse
          cx="28"
          cy="66"
          rx="3.5"
          ry="2.5"
          fill={color}
          opacity="0.65"
        />
      </svg>
    );

  if (stage === 1)
    return (
      <svg width="40" height="54" viewBox="0 0 56 76" fill="none">
        <line
          x1="28"
          y1="56"
          x2="28"
          y2="72"
          stroke={stemColor}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <ellipse
          cx="21"
          cy="54"
          rx="7"
          ry="3.2"
          fill={leafColor}
          opacity="0.8"
          transform="rotate(-30 21 54)"
        />
        <ellipse
          cx="35"
          cy="54"
          rx="7"
          ry="3.2"
          fill={leafColor}
          opacity="0.8"
          transform="rotate(30 35 54)"
        />
      </svg>
    );

  if (stage === 2)
    return (
      <svg width="40" height="54" viewBox="0 0 56 76" fill="none">
        <line
          x1="28"
          y1="48"
          x2="28"
          y2="72"
          stroke={stemColor}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <ellipse
          cx="21"
          cy="63"
          rx="6"
          ry="3"
          fill={leafColor}
          opacity="0.65"
          transform="rotate(-35 21 63)"
        />
        <ellipse cx="28" cy="42" rx="4" ry="7" fill={color} opacity="0.45" />
        <ellipse cx="28" cy="43" rx="2.5" ry="5" fill={color} opacity="0.65" />
        <ellipse
          cx="24"
          cy="49"
          rx="2.5"
          ry="4"
          fill={stemColor}
          opacity="0.45"
          transform="rotate(-15 24 49)"
        />
        <ellipse
          cx="32"
          cy="49"
          rx="2.5"
          ry="4"
          fill={stemColor}
          opacity="0.45"
          transform="rotate(15 32 49)"
        />
      </svg>
    );

  if (stage === 3)
    return (
      <svg width="40" height="54" viewBox="0 0 56 76" fill="none">
        <line
          x1="28"
          y1="38"
          x2="28"
          y2="72"
          stroke={stemColor}
          strokeWidth={sw}
          strokeLinecap="round"
        />
        <ellipse
          cx="21"
          cy="58"
          rx="7"
          ry="3.5"
          fill={leafColor}
          opacity="0.65"
          transform="rotate(-35 21 58)"
        />
        <ellipse cx="28" cy="26" rx="6" ry="11" fill={color} opacity="0.4" />
        <ellipse cx="28" cy="27" rx="4" ry="8" fill={color} opacity="0.65" />
        <ellipse
          cx="22"
          cy="36"
          rx="3.5"
          ry="6"
          fill={stemColor}
          opacity="0.5"
          transform="rotate(-20 22 36)"
        />
        <ellipse
          cx="34"
          cy="36"
          rx="3.5"
          ry="6"
          fill={stemColor}
          opacity="0.5"
          transform="rotate(20 34 36)"
        />
      </svg>
    );

  const petalAngles: Record<number, number[]> = {
    4: [0, 180],
    5: [0, 90, 180, 270],
    6: [0, 60, 120, 180, 240, 300],
    7: [0, 45, 90, 135, 180, 225, 270, 315],
  };
  const angles = petalAngles[Math.min(stage, 7)] ?? petalAngles[7];
  const r = stage >= 7 ? 7 : 5;
  const ri = stage >= 7 ? 5 : 3.5;

  return (
    <svg width="40" height="54" viewBox="0 0 56 76" fill="none">
      <line
        x1="28"
        y1="38"
        x2="28"
        y2="72"
        stroke={stemColor}
        strokeWidth={sw}
        strokeLinecap="round"
      />
      <ellipse
        cx="21"
        cy="58"
        rx="7"
        ry="3.5"
        fill={leafColor}
        opacity="0.65"
        transform="rotate(-35 21 58)"
      />
      {angles.map((a) => (
        <ellipse
          key={a}
          cx="28"
          cy="17"
          rx="4.5"
          ry="8"
          fill={color}
          opacity="0.82"
          transform={`rotate(${a} 28 28)`}
        />
      ))}
      <circle cx="28" cy="28" r={r} fill="#F5EFE4" />
      <circle cx="28" cy="28" r={ri} fill={color} opacity="0.55" />
      <circle cx="28" cy="28" r="2.5" fill={color} opacity="0.9" />
    </svg>
  );
}

function PhoneShell({
  children,
  activeNav,
}: {
  children: React.ReactNode;
  activeNav: string;
}) {
  const tabs = [
    { icon: "🏡", label: "garden" },
    { icon: "◎", label: "journey" },
    { label: "ground", ground: true },
    { icon: "✏️", label: "journal" },
    { icon: "🌸", label: "inspire" },
  ] as const;

  return (
    <div className="lp-phone">
      {children}
      <div className="lp-phone-nav">
        {tabs.map((t) =>
          "ground" in t && t.ground ? (
            <div key="ground" className="lp-nav-item">
              <div className="lp-nav-ground">🌿</div>
              <span
                className="lp-nav-lbl"
                style={{ color: "#C97A6E", opacity: 1, fontSize: "5px" }}
              >
                ground
              </span>
            </div>
          ) : (
            <div key={t.label} className="lp-nav-item">
              <div className="lp-nav-icon">{"icon" in t ? t.icon : ""}</div>
              <div
                className={`lp-nav-lbl${t.label === activeNav ? " active" : ""}`}
              >
                {t.label}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function GardenPhone() {
  return (
    <PhoneShell activeNav="garden">
      <div className="lp-phone-topbar">
        <div>
          <div className="lp-phone-title">efflorescence</div>
          <div className="lp-phone-subtitle">Day 14 of healing</div>
        </div>
        <div className="lp-phone-avatar">👤</div>
      </div>
      <div className="lp-phone-content">
        <div className="lp-section-label">Tending today</div>

        {/* Detox bed */}
        <div className="lp-bed">
          <div className="lp-bed-header">
            <span className="lp-bed-label">Detox</span>
            <span className="lp-bed-tagline">protect your peace</span>
          </div>
          <div className="lp-bed-flowers">
            <div className="lp-flower-wrap">
              <FlowerSvg stage={1} color="#6B8F6E" />
              <div className="lp-flower-name">no contact</div>
              <div className="lp-flower-streak">🌱 1</div>
            </div>
            <div className="lp-flower-wrap">
              <FlowerSvg stage={7} color="#D4823A" />
              <div className="lp-flower-name">didn't look</div>
              <div className="lp-flower-streak">🌱 8</div>
            </div>
            <div className="lp-flower-wrap" style={{ opacity: 0.65 }}>
              <FlowerSvg stage={3} color="#9B8DB5" />
              <div className="lp-flower-name">let past be</div>
              <div className="lp-flower-streak">🌱 3</div>
            </div>
          </div>
          <div className="lp-bed-soil" />
        </div>

        {/* Feed bed */}
        <div className="lp-bed">
          <div className="lp-bed-header">
            <span className="lp-bed-label">Feed</span>
            <span className="lp-bed-tagline">tend to your body</span>
          </div>
          <div className="lp-bed-flowers">
            <div className="lp-flower-wrap">
              <FlowerSvg stage={2} color="#D4B483" />
              <div className="lp-flower-name">eat & drink</div>
              <div className="lp-flower-streak">🌱 2</div>
            </div>
            <div className="lp-flower-wrap">
              <FlowerSvg stage={6} color="#E8C547" />
              <div className="lp-flower-name">move</div>
              <div className="lp-flower-streak">🌱 6</div>
            </div>
            <div className="lp-flower-wrap" style={{ opacity: 0.45 }}>
              <FlowerSvg stage={0} color="#8FB5A0" />
              <div className="lp-flower-name">fresh air</div>
              <div className="lp-flower-streak">🌱 0</div>
            </div>
          </div>
          <div className="lp-bed-soil" />
        </div>
      </div>
    </PhoneShell>
  );
}

function JourneyPhone() {
  type DayStyle =
    | "empty"
    | "plain"
    | "heat-0"
    | "heat-1"
    | "heat-2"
    | "heat-3"
    | "circled";
  const days: { n?: number; s: DayStyle; dot?: string }[] = [
    { s: "empty" },
    { s: "empty" },
    { s: "empty" },
    { s: "empty" },
    { s: "empty" },
    { n: 1, s: "plain" },
    { n: 2, s: "plain" },
    { n: 3, s: "circled" },
    { n: 4, s: "heat-1" },
    { n: 5, s: "heat-1", dot: "#6B8F6E" },
    { n: 6, s: "heat-2" },
    { n: 7, s: "heat-2", dot: "#C97A8A" },
    { n: 8, s: "heat-1" },
    { n: 9, s: "heat-2" },
    { n: 10, s: "heat-0" },
    { n: 11, s: "heat-1", dot: "#9B8DB5" },
    { n: 12, s: "heat-2" },
    { n: 13, s: "heat-2", dot: "#43A047" },
    { n: 14, s: "heat-3" },
    { n: 15, s: "heat-2" },
    { n: 16, s: "heat-3", dot: "#C97A8A" },
    { n: 17, s: "heat-1" },
    { n: 18, s: "heat-2" },
    { n: 19, s: "heat-3", dot: "#6B8F6E" },
    { n: 20, s: "heat-3" },
    { n: 21, s: "heat-2" },
    { n: 22, s: "heat-3", dot: "#43A047" },
    { n: 23, s: "heat-2" },
    { n: 24, s: "heat-2" },
    { n: 25, s: "heat-3" },
    { n: 26, s: "heat-2", dot: "#C97A8A" },
    { n: 27, s: "heat-3" },
    { n: 28, s: "heat-2" },
    { n: 29, s: "heat-1" },
    { n: 30, s: "heat-0" },
    { n: 31, s: "heat-1" },
  ];

  const heatBg: Record<string, string> = {
    "heat-0": "#F0EAE0",
    "heat-1": "#C8E6C9",
    "heat-2": "#81C784",
    "heat-3": "#43A047",
    plain: "#F0EAE0",
    circled: "#F0EAE0",
    empty: "transparent",
  };

  return (
    <PhoneShell activeNav="journey">
      <div className="lp-phone-topbar">
        <div>
          <div className="lp-phone-title">your journey</div>
          <div className="lp-phone-subtitle">May 2026</div>
        </div>
        <div className="lp-phone-avatar">👤</div>
      </div>
      <div className="lp-phone-content">
        <div className="lp-cal-nav">
          <span className="lp-cal-arrow">‹</span>
          <span className="lp-cal-month">May 2026</span>
          <span className="lp-cal-arrow" style={{ opacity: 0.2 }}>
            ›
          </span>
        </div>
        <div className="lp-cal-grid">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="lp-cal-dow">
              {d}
            </div>
          ))}
          {days.map((d, i) => (
            <div
              key={i}
              className={`lp-cal-day${d.s === "circled" ? " lp-cal-circled" : ""}${d.s === "empty" ? " lp-cal-empty" : ""}`}
              style={{
                background: heatBg[d.s] ?? "transparent",
                color: d.s === "heat-3" ? "white" : undefined,
                opacity: d.s === "plain" ? 0.35 : undefined,
              }}
            >
              {d.n}
              {d.dot && (
                <span className="lp-cal-dot" style={{ background: d.dot }} />
              )}
            </div>
          ))}
        </div>
        <div className="lp-cal-summary">
          <div className="lp-cal-summary-date">May 27 · Day 24 of healing</div>
          <div className="lp-cal-summary-line">
            8 of 12 habits ·{" "}
            <span style={{ color: "#C97A8A" }}>Actually okay</span>
          </div>
          <div className="lp-cal-bar">
            <div className="lp-cal-bar-fill" />
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function JournalPhone() {
  const pros = [
    "Made me laugh until I cried",
    "Felt truly seen in the early days",
  ];
  const cons = [
    "Went quiet when things got hard",
    "Never met my family",
    "Made me feel like I was too much",
    "Hot and cold for months on end",
    "I was always the one trying harder",
    "Disappeared without real closure",
    "Made me doubt what I deserved",
    "Chose comfort over honesty",
    "Cancelled plans without explanation",
  ];

  return (
    <PhoneShell activeNav="journal">
      <div className="lp-phone-topbar">
        <div>
          <div className="lp-phone-title">journal</div>
          <div className="lp-phone-subtitle">Write it down.</div>
        </div>
        <div className="lp-phone-avatar">👤</div>
      </div>
      <div className="lp-phone-content">
        <div className="lp-journal-tabs">
          {["Diary", "Full Picture", "Rewrite", "The Why"].map((t) => (
            <div
              key={t}
              className={`lp-journal-tab${t === "Full Picture" ? " active" : ""}`}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="lp-journal-prompt">What was actually real?</div>

        <div className="lp-journal-entry">
          <div
            className="lp-entry-date"
            style={{ color: "#7A9E6E", opacity: 0.85 }}
          >
            What I loved
          </div>
          <div className="lp-pros-list">
            {pros.map((p) => (
              <div key={p} className="lp-list-row">
                <span className="lp-list-sign lp-plus">+</span>
                <span className="lp-entry-text">{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-journal-entry">
          <div
            className="lp-entry-date"
            style={{ color: "#C97A6E", opacity: 0.85 }}
          >
            What was really there
          </div>
          <div className="lp-cons-list">
            {cons.map((c) => (
              <div key={c} className="lp-list-row">
                <span className="lp-list-sign lp-minus">-</span>
                <span className="lp-entry-text">{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

function InspirePhone() {
  return (
    <PhoneShell activeNav="inspire">
      <div className="lp-phone-topbar">
        <div>
          <div className="lp-phone-title">inspire</div>
          <div className="lp-phone-subtitle">For where you are today.</div>
        </div>
        <div className="lp-phone-avatar">👤</div>
      </div>
      <div className="lp-phone-content">
        <div className="lp-inspire-card">
          <div className="lp-inspire-type">🔬 science</div>
          <div className="lp-inspire-body">
            Grief activates the same neural pathways as physical pain. What you
            are feeling is not weakness — it is your nervous system processing
            something real.
          </div>
          <div className="lp-inspire-divider" />
          <div className="lp-inspire-source">
            University of Michigan, 2011 — Kross et al.
          </div>
        </div>

        <div className="lp-inspire-note">
          <div className="lp-inspire-note-label">🌿 A note for today</div>
          <div className="lp-inspire-note-body">
            You don&rsquo;t have to feel better yet. You just have to get
            through today. That&rsquo;s enough.
          </div>
        </div>

        <div className="lp-inspire-milestone">
          <div className="lp-inspire-type" style={{ color: "#C97A6E" }}>
            🎯 Day 14 milestone
          </div>
          <div className="lp-inspire-body" style={{ fontSize: "8.5px" }}>
            Two weeks. You&rsquo;ve made it two full weeks. That&rsquo;s not
            nothing — that&rsquo;s everything.
          </div>
        </div>
      </div>
    </PhoneShell>
  );
}

const GROWTH_STAGES = [
  { day: "Day 0", name: "seed", stage: 0 },
  { day: "Day 1", name: "sprout", stage: 1 },
  { day: "Day 2", name: "rising", stage: 2 },
  { day: "Day 3", name: "bud", stage: 3 },
  { day: "Day 5", name: "opening", stage: 5 },
  { day: "Day 6", name: "blooming", stage: 6 },
  { day: "Day 7", name: "full bloom", stage: 7 },
];

export default function LandingScreens() {
  return (
    <section className="screens-section">
      <div className="screens-inner">
        <div className="screens-header">
          <div className="screens-eyebrow">The Experience</div>
          <div className="screens-title">
            A garden that grows
            <br />
            <em>as you do.</em>
          </div>
          <div className="screens-sub">
            Every habit tended grows a real flower. Every day of healing is
            tracked. Every hard truth gets a page.
          </div>
        </div>

        {/* Growth path */}
        <div className="growth-path">
          <div className="growth-path-label">
            Flower growth — 7 days of care
          </div>
          <div className="growth-path-stages">
            {GROWTH_STAGES.map(({ day, name, stage }, i) => (
              <div key={stage} className="growth-path-stage">
                <FlowerSvg stage={stage} color="#C97A6E" />
                <div className="growth-stage-day">{day}</div>
                <div
                  className={`growth-stage-name${stage === 7 ? " bloom" : ""}`}
                >
                  {name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Phone screens */}
        <div className="screens-phones">
          <div className="screen-card">
            <GardenPhone />
            <div className="screen-card-label">Garden</div>
          </div>
          <div className="screen-card">
            <JourneyPhone />
            <div className="screen-card-label">Journey</div>
          </div>
          <div className="screen-card">
            <JournalPhone />
            <div className="screen-card-label">Journal</div>
          </div>
          <div className="screen-card">
            <InspirePhone />
            <div className="screen-card-label">Inspire</div>
          </div>
        </div>
      </div>
    </section>
  );
}
