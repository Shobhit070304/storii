import { CategoryTag } from "@/components/CategoryTag";
import { Kicker, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { CATEGORIES, toneStyle } from "@/lib/categories";
import { useStats, useQuestions } from "@/lib/api";
import { plural } from "@/lib/format";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

/* ── Category marquee ──────────────────────────────────── */
const MARQUEE_ITEMS = [
  "Work & Career",
  "Money",
  "Relationships",
  "Health & Body",
  "Home & Moving",
  "Learning",
  "First job nerves",
  "Salary negotiation",
  "Long-distance friendship",
  "Burnout recovery",
  "Moving to a new city",
  "Financial anxiety",
  "Difficult managers",
  "Starting over at 30",
  "Living alone for the first time",
  "Chronic illness",
  "Career pivots",
  "Parenting decisions",
];

function CategoryMarquee() {
  // Duplicate for seamless infinite scroll
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-rule py-3.5 bg-surface">
      <div className="storii-marquee-track">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-3 whitespace-nowrap px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-ink-2"
          >
            <span className="size-1.5 rounded-full bg-rule-strong inline-block" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── "Why Storii?" comparison ──────────────────────────── */
const COMPARISON = [
  {
    label: "Generic advice from strangers",
    good: false,
    description: "\"You should just do X\" — from someone who's never been there.",
  },
  {
    label: "Stories from people who actually lived it",
    good: true,
    description: "What actually happened, with the real details, from real people.",
  },
  {
    label: "Search results optimised for clicks",
    good: false,
    description: "10 listicles that repeat the same surface-level tips.",
  },
  {
    label: "Answers that acknowledge how hard it was",
    good: true,
    description: "\"This is what I wish I had known.\" Honest, specific, human.",
  },
  {
    label: "Thought leaders performing expertise",
    good: false,
    description: "Impressive-sounding take, zero lived context.",
  },
  {
    label: "A nurse, a teacher, a founder, just talking",
    good: true,
    description: "No credentials needed. Just: \"Here's what happened to me.\"",
  },
];

/* ── Feature highlights ────────────────────────────────── */
const FEATURES = [
  {
    icon: "🔍",
    title: "Ask the real question",
    body: "Not the polished version. The one you're embarrassed you don't already know.",
  },
  {
    icon: "✍️",
    title: "Stories, not advice",
    body: "Storii collects first-hand accounts — what actually happened, not what should happen.",
  },
  {
    icon: "🔒",
    title: "Anonymous if you need it",
    body: "Ask and answer anonymously. The question stays on the record. Your name doesn't have to.",
  },
  {
    icon: "♾️",
    title: "Builds over time",
    body: "Every answer stays. The person asking your question five years from now will find it.",
  },
];

/* ── Testimonial-style quotes ──────────────────────────── */
const QUOTES = [
  {
    quote: "It took me a year to find out the answer was available here in ten minutes.",
    author: "Someone who asked about their first salary negotiation",
    category: "work",
  },
  {
    quote: "Nobody else talked about how hard the second month of moving was. This did.",
    author: "Someone who moved cities alone at 27",
    category: "home",
  },
  {
    quote: "I finally learned I wasn't the only one who felt completely lost after leaving therapy.",
    author: "Anonymous",
    category: "health",
  },
];

/* ── Read-only question card for Landing ───────────────── */
function ReadOnlyQuestionCard({ question, index, delay = 0 }) {
  if (!question) return null;
  return (
    <article
      className="storii-rise storii-card p-5 sm:p-6"
      style={{ ...toneStyle(question.category), animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between gap-3">
        <CategoryTag slug={question.category} asLink={false} className="text-[10px]" />
        <span className="text-[11px] text-muted-foreground font-normal shrink-0">
          {plural(question.answerCount, "experience")}
        </span>
      </div>
      <p className="mt-3 font-serif text-[1.15rem] leading-snug text-ink">
        {question.title}
      </p>
      {question.body ? (
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
          {question.body}
        </p>
      ) : null}
    </article>
  );
}

export default function Landing() {
  const stats = useStats();
  const feed = useQuestions({ sort: "answered" });

  const featured = (feed || []).slice(0, 3);

  const counts = (feed || []).reduce((map, question) => {
    map[question.category] = (map[question.category] || 0) + 1;
    return map;
  }, {});

  return (
    <PageShell width="full">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="storii-rise relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {/* Subtle warm gradient blob behind the headline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(37,99,171,0.06) 0%, rgba(192,57,43,0.04) 50%, transparent 80%)",
          }}
        />

        <div className="mx-auto w-full max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-surface px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-ink-2 shadow-sm">
            <span className="size-1.5 rounded-full bg-moss inline-block" />
            Real stories from real people
          </span>

          <h1 className="mx-auto mt-7 max-w-3xl font-serif text-[2.8rem] leading-[1.07] tracking-tight text-ink sm:text-[4rem] lg:text-[4.8rem]">
            The lessons people<br />
            only learn by{" "}
            <em className="not-italic text-vermillion">living them.</em>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">
            Ask what you wish someone had told you.
            Get answers from people who were actually there — not advice from people who weren't.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-7 text-[13px] font-semibold">
              <Link to="/feed">
                Read the archive
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-rule-strong bg-transparent px-7 text-[13px] font-medium text-ink hover:bg-accent"
            >
              <Link to="/ask">Ask a question</Link>
            </Button>
          </div>

          <p className="mt-5 text-[13px] text-muted-foreground">
            Post with your name, or stay completely anonymous.
          </p>

          {/* Stats inline under hero */}
          {stats && (stats.questions > 0 || stats.experiences > 0) ? (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-center">
              <div>
                <p className="text-[2rem] font-bold tabular-nums text-ink leading-none">{stats.questions}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Questions</p>
              </div>
              <div className="h-8 w-px bg-rule hidden sm:block" />
              <div>
                <p className="text-[2rem] font-bold tabular-nums text-ink leading-none">{stats.experiences}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Stories shared</p>
              </div>
              <div className="h-8 w-px bg-rule hidden sm:block" />
              <div>
                <p className="text-[2rem] font-bold tabular-nums text-ink leading-none">{stats.contributors}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Contributors</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Category Marquee ──────────────────────────────── */}
      <CategoryMarquee />

      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 pb-20">

        {/* ── Recently answered — read-only cards ─────────── */}
        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Recently answered</Kicker>
              <h2 className="mt-2 font-serif text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
                Stories being told right now
              </h2>
            </div>
            <Link
              to="/feed"
              className="group inline-flex items-center gap-2 text-[12px] font-medium text-ink-2 hover:text-ink"
            >
              Browse all stories
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((question, index) => (
              <ReadOnlyQuestionCard
                key={question.id}
                question={question}
                index={index}
                delay={index * 70}
              />
            ))}
            {feed && feed.length === 0 ? (
              <p className="col-span-3 py-12 text-center text-[15px] italic text-muted-foreground">
                No stories yet. Ask the first question.
              </p>
            ) : null}
          </div>
        </section>

        {/* ── Why Storii? comparison ───────────────────────── */}
        <section className="mt-24">
          <div className="text-center">
            <Kicker>Why Storii?</Kicker>
            <h2 className="mt-2 font-serif text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
              The internet has enough opinions.<br />
              <span className="text-vermillion">We collect experiences.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink-2">
              Opinions are everywhere. Actual first-hand accounts of what it's like to go through something — those are rare. Storii is a place for the latter.
            </p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {COMPARISON.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4",
                  item.good
                    ? "border-moss/20 bg-moss/5"
                    : "border-rule bg-surface opacity-70"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                    item.good
                      ? "bg-moss text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {item.good ? <Check className="size-3" /> : <X className="size-3" />}
                </span>
                <div>
                  <p
                    className={cn(
                      "text-[13px] font-semibold leading-snug",
                      item.good ? "text-ink" : "text-ink-2"
                    )}
                  >
                    {item.label}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────── */}
        <section className="mt-24">
          <div className="text-center">
            <Kicker>How it works</Kicker>
            <h2 className="mt-2 font-serif text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
              Three steps. No noise.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "01",
                title: "Ask plainly",
                body: "Write the question exactly how you'd search for it at midnight. No polish required.",
              },
              {
                n: "02",
                title: "Someone who was there answers",
                body: "Not advice. Not takes. What actually happened — with the details that make it real.",
              },
              {
                n: "03",
                title: "It stays on the record",
                body: "The next person who asks finds your answer the day they need it most.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="storii-card px-6 py-7"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {step.n}
                </span>
                <h3 className="mt-3 font-serif text-[1.2rem] leading-snug tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Features ────────────────────────────────────── */}
        <section className="mt-24">
          <div className="text-center">
            <Kicker>What makes it different</Kicker>
            <h2 className="mt-2 font-serif text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
              Built for honesty, not performance.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4 rounded-xl border border-rule bg-surface p-5">
                <span className="text-[1.6rem] leading-none">{feature.icon}</span>
                <div>
                  <h3 className="text-[15px] font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Social proof quotes ─────────────────────────── */}
        <section className="mt-24">
          <div className="text-center mb-10">
            <Kicker>From the archive</Kicker>
            <h2 className="mt-2 font-serif text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
              Stories that stuck with people.
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {QUOTES.map((q, i) => (
              <div
                key={i}
                className="storii-card px-6 py-7"
                style={toneStyle(q.category)}
              >
                <p className="font-serif text-[1.1rem] italic leading-relaxed text-ink">
                  "{q.quote}"
                </p>
                <p className="mt-4 flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="storii-dot" />
                  {q.author}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Browse categories ────────────────────────────── */}
        <section className="mt-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Browse by topic</Kicker>
              <h2 className="mt-2 font-serif text-[1.75rem] tracking-tight text-ink sm:text-[2rem]">
                Pick a corner of life.
              </h2>
            </div>
            <Link
              to="/feed"
              className="group inline-flex items-center gap-2 text-[12px] font-medium text-ink-2 hover:text-ink"
            >
              Explore all
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                to={`/feed?category=${category.slug}`}
                style={toneStyle(category.slug)}
                className="group storii-card flex items-start gap-4 p-5"
              >
                <span className="storii-dot mt-1 size-2.5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-ink">{category.name}</p>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-ink-2">{category.blurb}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                    {plural(counts[category.slug] || 0, "question")}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA closing ─────────────────────────────────── */}
        <section className="mt-24 rounded-2xl bg-ink px-8 py-14 text-center">
          <h2 className="mx-auto max-w-2xl font-serif text-[1.9rem] leading-tight tracking-tight text-paper sm:text-[2.4rem]">
            Your ordinary experience is exactly what someone needs.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-[15px] leading-relaxed text-paper/70">
            The messy, specific, unremarkable version of what happened to you is more useful than any advice anyone could invent.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-paper px-7 text-[13px] font-semibold text-ink hover:bg-paper-2"
            >
              <Link to="/ask">
                Ask your question
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-paper/20 bg-transparent px-7 text-[13px] font-medium text-paper hover:bg-paper/10"
            >
              <Link to="/feed?sort=open">
                Answer an open question
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>
          <p className="mt-5 text-[12px] text-paper/40">
            Completely anonymous posting supported.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
