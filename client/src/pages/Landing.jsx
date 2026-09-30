import { PastoralHero } from "@/components/PastoralHero";
import { Kicker, PageShell } from "@/components/PageShell";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { CATEGORIES, toneStyle } from "@/lib/categories";
import { useStats, useQuestions } from "@/lib/api";
import { plural } from "@/lib/format";
import { ArrowRight, ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

function HeroSearch() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  function submit(event) {
    event.preventDefault();
    const query = term.trim();
    navigate(query ? `/feed?q=${encodeURIComponent(query)}` : "/feed");
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-9 flex w-full max-w-xl items-center gap-3"
    >
      <label className="relative flex flex-1 items-center">
        <Search className="pointer-events-none absolute left-0 size-4 text-ink-2" />
        <input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="What do you wish you knew…"
          aria-label="Search questions"
          className="h-11 w-full border-b border-rule-strong bg-transparent pl-6 pr-2 font-serif text-[17px] text-ink placeholder:italic placeholder:text-ink-2/70 focus:border-ink focus:outline-none"
        />
      </label>
      <Button
        type="submit"
        className="h-11 rounded-sm px-5 text-[10px] uppercase tracking-[0.22em]"
      >
        Search
      </Button>
    </form>
  );
}

function Heading({ kicker, title, action }) {
  return (
    <div className="storii-blanket flex flex-wrap items-end justify-between gap-x-6 gap-y-3 py-4">
      <div>
        <Kicker>{kicker}</Kicker>
        <h2 className="mt-1 font-serif text-[1.6rem] tracking-tight text-ink sm:text-[1.85rem]">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

const STEPS = [
  {
    title: "Ask",
    body: "Write the question you'd type into a search bar at 1am.",
  },
  {
    title: "Someone who was there answers",
    body: "They tell you what actually happened — not what they think you should do.",
  },
  {
    title: "It stays on the record",
    body: "The next person finds it the day they need it.",
  },
];

export default function Landing() {
  const stats = useStats();
  const feed = useQuestions({ sort: "answered" });

  const counts = (feed || []).reduce((map, question) => {
    map[question.category] = (map[question.category] || 0) + 1;
    return map;
  }, {});

  const featured = (feed || []).slice(0, 3);

  const statLine = stats
    ? `${stats.questions} questions · ${stats.experiences} experiences · ${stats.contributors} people`
    : "A growing archive";

  return (
    <PageShell className="overflow-x-clip">
      {/* ── Hero: the landscape runs edge to edge, behind the words ── */}
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip">
        <section className="storii-rise relative isolate flex min-h-[34rem] items-center justify-center overflow-hidden px-6 py-20 text-center sm:min-h-[42rem] sm:px-12 lg:min-h-[48rem]">
          <PastoralHero className="absolute inset-0 -z-10 h-full w-full" />

          {/* A light print wash plus a soft bed of paper under the type, so the
              words stay calm and readable without hiding the landscape. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-paper/20"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(72% 62% at 50% 46%, color-mix(in srgb, var(--paper) 70%, transparent) 0%, color-mix(in srgb, var(--paper) 42%, transparent) 48%, transparent 78%)",
            }}
          />

          <div className="relative w-full max-w-3xl">
            <Kicker>Lived experience, on the record</Kicker>

            <h1 className="mx-auto mt-6 max-w-3xl font-serif text-[2.5rem] leading-[1.05] tracking-tight text-ink sm:text-[3.8rem]">
              The lessons people only learn by{" "}
              <em className="italic text-vermillion">living them.</em>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2">
              Ask what you wish someone had told you. The answers come from
              people who were actually there.
            </p>

            <HeroSearch />

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-sm px-6 text-[10px] uppercase tracking-[0.22em]"
              >
                <Link to="/feed">
                  Read the feed
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-sm border-rule-strong bg-paper/70 px-6 text-[10px] uppercase tracking-[0.22em] text-ink hover:bg-paper"
              >
                <Link to="/ask">Ask a question</Link>
              </Button>
            </div>

            <p className="mt-5 text-[13px] text-ink-2">
              Post with your name, or keep it completely anonymous.
            </p>
          </div>
        </section>

        <p className="mx-auto mt-3 flex w-full max-w-6xl flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground sm:px-8">
          <span>First light on the coast</span>
          <span className="normal-case tracking-[0.08em]">{statLine}</span>
        </p>
      </div>

      {/* ── Recently answered ──────────────────────────────── */}
      <section className="mt-24">
        <Heading
          kicker="Recently answered"
          title="Questions people just answered"
          action={
            <Link
              to="/feed"
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink-2 hover:text-ink"
            >
              See every question
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
        />

        <div>
          {featured.map((question, index) => (
            <QuestionCard
              key={question._id}
              question={question}
              index={index}
              delay={index * 70}
            />
          ))}
          {feed && feed.length === 0 ? (
            <p className="py-12 text-center text-[15px] italic text-muted-foreground">
              Nothing here yet. Ask the first question.
            </p>
          ) : null}
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────── */}
      <section className="mt-24">
        <Heading
          kicker="Browse"
          title="Pick a corner of life"
          action={
            <Link
              to="/feed"
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink-2 hover:text-ink"
            >
              Explore feed
              <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="mt-6 grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/feed?category=${category.slug}`}
              style={toneStyle(category.slug)}
              className="group flex items-baseline justify-between gap-4 border-b border-rule py-3.5"
            >
              <span className="flex items-baseline gap-3">
                <span
                  aria-hidden="true"
                  className="size-1.5 shrink-0 rounded-full bg-[var(--tone)]"
                />
                <span className="font-serif text-[1.15rem] text-ink">
                  {category.name}
                </span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {plural(counts[category.slug] || 0, "question")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how-it-works" className="mt-24 scroll-mt-28">
        <Heading kicker="How it works" title="Ask. Remember. Pass it on." />

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className="border-t border-rule pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0"
            >
              <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-serif text-[1.2rem] leading-snug tracking-tight text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing ────────────────────────────────────────── */}
      <section className="mt-24 border-t border-rule-strong pt-12 text-center">
        <h2 className="mx-auto max-w-2xl font-serif text-[1.9rem] leading-tight tracking-tight text-ink sm:text-[2.4rem]">
          Your ordinary experience is exactly what someone needs.
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-ink-2">
          The messy, specific, unremarkable version of what happened to you is
          more useful than any advice anyone could invent.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="rounded-sm px-6 text-[10px] uppercase tracking-[0.22em]"
          >
            <Link to="/ask">
              Ask your question
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-sm border-rule bg-transparent px-6 text-[10px] uppercase tracking-[0.22em] text-ink hover:bg-accent"
          >
            <Link to="/feed?sort=open">
              Answer an open question
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <p className="mt-5 text-[13px] text-muted-foreground">
          You can post your question or your experience anonymously.
        </p>
      </section>
    </PageShell>
  );
}
