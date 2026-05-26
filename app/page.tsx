import Link from "next/link";
import "./landing.css";

export const metadata = {
  title: "Efflorescence — You were always the garden.",
  description:
    "A healing companion for women navigating the aftermath of a breakup.",
};

export default function LandingPage() {
  return (
    <div className="landing-root">
      {/* HERO */}
      <section className="hero">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        {/* Botanical SVG */}
        <div className="hero-botanical">
          <svg
            width="380"
            height="560"
            viewBox="0 0 380 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            opacity="0.22"
          >
            <path
              d="M190 540 C190 400 188 300 192 180"
              stroke="#B8935A"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <ellipse
              cx="192"
              cy="160"
              rx="52"
              ry="68"
              fill="none"
              stroke="#DBA898"
              strokeWidth="0.8"
            />
            <ellipse
              cx="192"
              cy="148"
              rx="36"
              ry="50"
              fill="none"
              stroke="#C97A6E"
              strokeWidth="0.6"
            />
            <ellipse
              cx="192"
              cy="140"
              rx="22"
              ry="32"
              fill="none"
              stroke="#DBA898"
              strokeWidth="0.5"
            />
            <circle
              cx="192"
              cy="132"
              r="10"
              fill="none"
              stroke="#B8935A"
              strokeWidth="0.8"
            />
            <path
              d="M192 92 C175 70 160 55 152 40"
              stroke="#DBA898"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <path
              d="M192 92 C210 70 225 58 234 44"
              stroke="#DBA898"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <path
              d="M140 148 C118 140 100 138 82 132"
              stroke="#DBA898"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <path
              d="M244 148 C266 140 284 138 302 130"
              stroke="#DBA898"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <path
              d="M190 280 C160 268 130 270 108 258"
              stroke="#7A9E6E"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <path
              d="M108 258 C90 248 82 236 86 220 C92 240 102 248 108 258"
              fill="none"
              stroke="#7A9E6E"
              strokeWidth="0.7"
            />
            <path
              d="M191 320 C220 308 248 312 268 300"
              stroke="#7A9E6E"
              strokeWidth="1"
              strokeLinecap="round"
            />
            <circle
              cx="272"
              cy="296"
              r="18"
              fill="none"
              stroke="#C97A6E"
              strokeWidth="0.7"
            />
            <circle
              cx="272"
              cy="296"
              r="10"
              fill="none"
              stroke="#DBA898"
              strokeWidth="0.5"
            />
            <path
              d="M190 380 C162 368 140 374 124 362"
              stroke="#7A9E6E"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <circle
              cx="120"
              cy="358"
              r="14"
              fill="none"
              stroke="#B8935A"
              strokeWidth="0.7"
            />
            <circle
              cx="120"
              cy="358"
              r="7"
              fill="none"
              stroke="#D4B47A"
              strokeWidth="0.5"
            />
            <circle
              cx="82"
              cy="132"
              r="6"
              fill="none"
              stroke="#DBA898"
              strokeWidth="0.6"
            />
            <circle
              cx="302"
              cy="130"
              r="5"
              fill="none"
              stroke="#7A9E6E"
              strokeWidth="0.6"
            />
            <path
              d="M190 420 C210 408 222 400 228 388 C216 396 206 406 190 420"
              fill="none"
              stroke="#7A9E6E"
              strokeWidth="0.7"
            />
            <path
              d="M191 460 C172 450 162 442 158 430 C168 440 178 450 191 460"
              fill="none"
              stroke="#7A9E6E"
              strokeWidth="0.7"
            />
            <path
              d="M190 500 C205 494 214 488 216 480"
              stroke="#7A9E6E"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <ellipse
              cx="218"
              cy="476"
              rx="6"
              ry="10"
              fill="none"
              stroke="#DBA898"
              strokeWidth="0.6"
              transform="rotate(15 218 476)"
            />
            <path
              d="M190 510 C175 504 166 498 164 490"
              stroke="#7A9E6E"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <ellipse
              cx="162"
              cy="486"
              rx="5"
              ry="9"
              fill="none"
              stroke="#C97A6E"
              strokeWidth="0.6"
              transform="rotate(-10 162 486)"
            />
          </svg>
        </div>

        {/* Nav */}
        <nav className="nav">
          <div className="nav-logo">efflorescence</div>
          <ul className="nav-links">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">The Garden</a>
            </li>
            <li>
              <a href="#">Join Waitlist</a>
            </li>
          </ul>
          <Link className="nav-enter" href="/signin">
            Enter the App
          </Link>
        </nav>

        {/* Hero content */}
        <div className="hero-content">
          <div className="hero-eyebrow">A healing companion</div>
          <div className="hero-wordmark">
            <span
              className="hero-wordmark-line1"
              style={{ color: "var(--cream)" }}
            >
              efflorescence
            </span>
          </div>
          <div className="hero-tagline-wrap">
            <div className="hero-tagline-rule" />
            <div className="hero-tagline">You were always the garden.</div>
          </div>
          <Link className="hero-cta" href="/signin">
            Begin tending
          </Link>
        </div>

        <div className="hero-scroll">
          <div className="scroll-line" />
          <div className="scroll-label">Scroll</div>
        </div>
      </section>

      {/* DEFINITION */}
      <section className="definition-section">
        <div className="def-inner">
          <div className="def-entry">
            <div className="def-headword" style={{ color: "var(--bark)" }}>
              efflorescence
            </div>
            <div className="def-phonetic">/ˌef.ləˈres.əns/</div>
            <div className="def-pos">noun</div>
            <div className="def-rule" />
            <div className="def-origin-label">Origin</div>
            <div className="def-origin-text">
              From Latin <em>efflorescere</em> — <em>ex-</em> (out) +{" "}
              <em>florescere</em> (to begin to blossom), from <em>flos</em>{" "}
              (flower). First recorded in English use, 1620s.
            </div>
          </div>

          <div className="def-meanings">
            <div className="def-meaning">
              <div className="def-num-wrap">
                <div className="def-num">01</div>
                <div className="def-field">Botany</div>
              </div>
              <div className="def-text">
                The action or process of <em>flowering</em>; the state of being
                in bloom.
              </div>
              <div className="def-sub">
                The full opening of a blossom — not the beginning of growth, not
                the peak of summer, but the exact moment of becoming. The
                unfolding that can only happen after everything that came before
                it.
              </div>
              <div className="def-example">
                <div className="def-example-text">
                  &ldquo;The efflorescence of the garden in early spring was a
                  kind of quiet miracle — nothing dramatic, just everything
                  arriving at once.&rdquo;
                </div>
                <div className="def-example-attr">Example usage</div>
              </div>
            </div>

            <div className="def-meaning">
              <div className="def-num-wrap">
                <div className="def-num">02</div>
                <div className="def-field">Chemistry</div>
              </div>
              <div className="def-text">
                The crystallization of a substance on a surface as it{" "}
                <strong>loses moisture</strong> and reaches a new state.
              </div>
              <div className="def-sub">
                When something releases what it&rsquo;s been holding — water,
                tension, the thing it clung to — and in doing so, becomes
                something more beautiful. The loss is what makes the
                crystallization possible.
              </div>
              <div className="def-example">
                <div className="def-example-text">
                  &ldquo;The efflorescence on the stone was evidence of a slow
                  internal process — something changing from the inside out,
                  becoming visible only after the shift was complete.&rdquo;
                </div>
                <div className="def-example-attr">Example usage</div>
              </div>
            </div>

            <div className="def-meaning">
              <div className="def-num-wrap">
                <div className="def-num">03</div>
                <div className="def-field">Figurative</div>
              </div>
              <div className="def-text">
                A <em>period</em> of rapid development, especially of something
                beautiful — a flowering of the self after a season of cold.
              </div>
              <div className="def-sub">
                The word for what happens when a woman stops pouring herself
                into something that couldn&rsquo;t hold her, and turns —
                finally, deliberately — back toward herself. Not recovery. Not
                moving on. Efflorescence.
              </div>
              <div className="def-example">
                <div className="def-example-text">
                  &ldquo;There is no shortcut to efflorescence. You have to go
                  through winter first.&rdquo;
                </div>
                <div className="def-example-attr">
                  Efflorescence — Brand Belief
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRIDGE */}
      <div className="bridge">
        <div className="bridge-orb" />
        <div className="bridge-eyebrow">Why this word</div>
        <div className="bridge-quote">
          We chose this word because it is the{" "}
          <span className="gold">most honest</span> description of what
          you&rsquo;re doing right now. You are not broken. You are not behind.
          You are in the <span className="petal">crystallization phase</span> —
          releasing what you held, becoming what was always underneath.
        </div>
        <div className="bridge-sub">
          There is no shortcut through this season. But there is a way to move
          through it that leaves you more whole than when you entered.
        </div>
      </div>

      {/* WHAT IT MEANS */}
      <section className="meaning-section">
        <div className="meaning-inner">
          <div className="meaning-header">
            <div>
              <div className="meaning-eyebrow">The App</div>
              <div className="meaning-title">
                What
                <br />
                <em>Efflorescence</em>
                <br />
                does.
              </div>
            </div>
            <div className="meaning-intro">
              Efflorescence is a mobile healing companion for women navigating
              the aftermath of a breakup. Not a journaling app. Not a habit
              tracker. Not therapy.{" "}
              <strong>The thing that exists between all of those</strong> — and
              meets you exactly where you are, at the exact moment you need it.
            </div>
          </div>

          <div className="pillars">
            <div className="pillar">
              <div className="pillar-num">01 — Garden</div>
              <div className="pillar-word">Tend.</div>
              <div className="pillar-body">
                Your healing lives in a living garden that grows with every
                small act of self-care. It never dies. It never resets. It
                rests, and comes back — just like you.
              </div>
            </div>
            <div className="pillar">
              <div className="pillar-num">02 — Spirals</div>
              <div className="pillar-word">Name it.</div>
              <div className="pillar-body">
                Five named thought spirals — The Clock, The Replay, The Mirror,
                The What If, The But He. When you&rsquo;re in one, the app meets
                you there with the right intervention, not a generic
                affirmation.
              </div>
            </div>
            <div className="pillar">
              <div className="pillar-num">03 — Museum</div>
              <div className="pillar-word">Remember.</div>
              <div className="pillar-body">
                Every completed streak, every milestone, every plant you tended
                — preserved as art. Proof, over time, that you have done hard
                things. That you have finished things. That you have grown.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-orb" />
        <div className="cta-eyebrow">Join the Waitlist</div>
        <div className="cta-heading">
          Your garden
          <br />
          is <span>waiting.</span>
        </div>
        <div className="cta-sub">
          Efflorescence is coming. Be the first to tend to yours.
        </div>
        <div className="cta-form">
          <input
            className="cta-input"
            type="email"
            placeholder="your@email.com"
          />
          <button className="cta-btn">Join</button>
        </div>
        <div className="cta-note">
          No spam. No pressure. Just a quiet message when it&rsquo;s ready.
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-wordmark">efflorescence</div>
        <div className="footer-right">
          <div className="footer-tagline">You were always the garden.</div>
          <div className="footer-meta">
            efflorescence&trade; 2026
            <br />
            Alison Nicole Lee
          </div>
        </div>
      </footer>
    </div>
  );
}
