import { EmptyNote } from "@/components/EmptyNote";
import { PageShell } from "@/components/PageShell";
import { QuestionCard } from "@/components/QuestionCard";
import { Button } from "@/components/ui/button";
import { CATEGORIES, categoryName, toneStyle } from "@/lib/categories";
import { useQuestions } from "@/lib/api";
import { plural, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

const SORTS = [
  { value: "recent", label: "Newest" },
  { value: "answered", label: "Most answered" },
  { value: "open", label: "Unanswered" },
];

function FilterPill({ active, to, children }) {
  return (
    <Link
      to={to}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors duration-150",
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule bg-surface text-ink-2 hover:border-rule-strong hover:text-ink"
      )}
    >
      {children}
    </Link>
  );
}

function FeedSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((row) => (
        <div
          key={row}
          className="animate-pulse rounded-xl border border-rule bg-surface p-5"
          style={{ animationDelay: `${row * 80}ms` }}
        >
          <div className="h-2.5 w-24 rounded bg-muted" />
          <div className="mt-4 h-5 w-3/4 rounded bg-muted" />
          <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
          <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
          <div className="mt-5 flex items-center justify-between">
            <div className="h-2.5 w-28 rounded bg-muted" />
            <div className="h-5 w-20 rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "recent";
  const query = searchParams.get("q") || "";
  const [term, setTerm] = useState(query);

  useEffect(() => {
    setTerm(query);
  }, [query]);

  const feed = useQuestions({
    category: category === "all" ? undefined : category,
    q: query || undefined,
    sort,
  });
  const archive = useQuestions({});

  function updateParams(patch) {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(patch)) {
      if (!value || value === "all" || value === "recent" || value === "") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    }
    setSearchParams(next, { replace: true });
  }

  function submitSearch(event) {
    event.preventDefault();
    updateParams({ q: term.trim() });
  }

  const questions = feed || [];
  const openQuestions = (archive || []).filter((q) => q.answerCount === 0).slice(0, 5);
  const counts = (archive || []).reduce((map, q) => {
    map[q.category] = (map[q.category] || 0) + 1;
    return map;
  }, {});
  const hasFilters = category !== "all" || Boolean(query) || sort !== "recent";

  return (
    <PageShell contentClassName="py-8 sm:py-10">
      {/* ── Page header ── */}
      <header className="border-b border-rule pb-7">
        <h1 className="font-serif text-[2rem] font-normal leading-tight tracking-tight text-ink sm:text-[2.5rem]">
          {category !== "all"
            ? categoryName(category)
            : "Stories from people who were there"}
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-2">
          {category !== "all"
            ? `First-hand accounts in ${categoryName(category)}.`
            : "Real experiences, asked plainly and answered honestly."}
        </p>

        {/* Search */}
        <form onSubmit={submitSearch} className="mt-5 flex max-w-lg items-center gap-2">
          <label className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
            <input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Search questions…"
              aria-label="Search questions"
              className="h-9 w-full rounded-full border border-rule bg-surface pl-9 pr-3 text-[13px] text-ink placeholder:text-muted-foreground focus:border-ink focus:outline-none focus:ring-1 focus:ring-rule-strong"
            />
          </label>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="rounded-full border-rule bg-transparent px-4 text-[12px] text-ink hover:bg-accent"
          >
            Search
          </Button>
        </form>

        {/* Category filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <FilterPill active={category === "all"} to={`/feed${query ? `?q=${encodeURIComponent(query)}` : ""}`}>
            All topics
          </FilterPill>
          {CATEGORIES.map((entry) => (
            <FilterPill
              key={entry.slug}
              active={category === entry.slug}
              to={`/feed?category=${entry.slug}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
            >
              {entry.name}
              {counts[entry.slug] ? (
                <span className="ml-0.5 opacity-60">{counts[entry.slug]}</span>
              ) : null}
            </FilterPill>
          ))}
        </div>

        {/* Sort + clear */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-[12px]">
          <span className="text-muted-foreground font-medium">Sort by</span>
          {SORTS.map((entry) => (
            <button
              key={entry.value}
              type="button"
              onClick={() => updateParams({ sort: entry.value })}
              className={cn(
                "font-medium transition-colors",
                sort === entry.value ? "text-ink" : "text-muted-foreground hover:text-ink"
              )}
            >
              {entry.label}
            </button>
          ))}
          {hasFilters ? (
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
              className="ml-auto inline-flex items-center gap-1.5 text-muted-foreground hover:text-ink"
            >
              <X className="size-3" />
              Clear filters
            </button>
          ) : null}
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_17rem]">
        {/* Feed grid */}
        <section>
          {feed === undefined ? (
            <FeedSkeleton />
          ) : questions.length === 0 ? (
            <EmptyNote
              className="mt-6"
              title="Nothing here yet."
              action={
                <Button asChild className="rounded-full px-5 text-[12px] font-medium">
                  <Link to="/ask">Ask this question</Link>
                </Button>
              }
            >
              {query
                ? "No question matches that wording. Try a shorter phrase, or ask it yourself."
                : "This topic is empty. Be the first to put a real question on it."}
            </EmptyNote>
          ) : (
            <>
              <p className="mb-5 text-[12px] text-muted-foreground">
                {plural(questions.length, "question")}
                {query ? ` matching "${query}"` : ""}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {questions.map((question, index) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={index}
                    delay={Math.min(index, 6) * 50}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-8 lg:sticky lg:top-20 lg:self-start">
          {/* Unanswered questions */}
          <div className="rounded-xl border border-rule bg-surface p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Waiting for an answer
            </h2>
            <ul className="mt-4 space-y-4">
              {openQuestions.map((question) => (
                <li key={question.id}>
                  <Link
                    to={`/questions/${question.id}`}
                    className="group block"
                    style={toneStyle(question.category)}
                  >
                    <span className="text-[9.5px] uppercase tracking-[0.18em] text-muted-foreground">
                      {categoryName(question.category)}
                    </span>
                    <span className="storii-link mt-0.5 block text-[13.5px] leading-snug text-ink decoration-(--tone)">
                      {question.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {timeAgo(question.createdAt)} · no answers yet
                    </span>
                  </Link>
                </li>
              ))}
              {archive && openQuestions.length === 0 ? (
                <li className="text-[13px] italic text-muted-foreground">
                  Every question has at least one answer. ✨
                </li>
              ) : null}
            </ul>
          </div>

          {/* Categories */}
          <div className="rounded-xl border border-rule bg-surface p-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Topics
            </h2>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIES.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    to={`/feed?category=${entry.slug}`}
                    className="flex items-center justify-between gap-3 text-[13px] text-ink-2 hover:text-ink"
                    style={toneStyle(entry.slug)}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="size-1.5 rounded-full bg-(--tone)" />
                      {entry.name}
                    </span>
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {counts[entry.slug] || 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ask CTA */}
          <Link
            to="/ask"
            className="group flex items-center gap-2 text-[12px] font-medium text-ink-2 hover:text-ink"
          >
            Ask your own question
            <ArrowUpRight className="size-3.5" />
          </Link>
        </aside>
      </div>
    </PageShell>
  );
}
