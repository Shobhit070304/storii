import { EmptyNote } from "@/components/EmptyNote";
import { Kicker, PageShell } from "@/components/PageShell";
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
  { value: "open", label: "Open" },
];

function FilterChip({ active, to, children, tone }) {
  return (
    <Link
      to={to}
      style={tone ? toneStyle(tone) : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 border px-2.5 py-1 text-[9px] uppercase tracking-[0.18em] transition-colors duration-200",
        active
          ? "border-ink bg-ink text-paper"
          : "border-rule text-ink-2 hover:border-rule-strong hover:text-ink",
      )}
    >
      {tone ? (
        <span
          className={cn(
            "size-1.5 rounded-full bg-(--tone)",
            active && "bg-paper",
          )}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </Link>
  );
}

function FeedSkeleton() {
  return (
    <div className="animate-pulse space-y-6 py-10" aria-hidden="true">
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className="space-y-3 border-b border-rule pb-8">
          <div className="h-2 w-24 bg-muted" />
          <div className="h-5 w-3/4 bg-muted" />
          <div className="h-3 w-1/2 bg-muted" />
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

  // Keep the input in step when the URL changes from elsewhere (header, footer).
  useEffect(() => {
    setTerm(query);
  }, [query]);

  const feed = useQuestions({
    category: category === "all" ? undefined : category,
    q: query || undefined,
    sort: sort,
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

  const openQuestions = (archive || [])
    .filter((question) => question.answerCount === 0)
    .slice(0, 4);

  const counts = (archive || []).reduce((map, question) => {
    map[question.category] = (map[question.category] || 0) + 1;
    return map;
  }, {});

  const hasFilters = category !== "all" || Boolean(query) || sort !== "recent";

  return (
    <PageShell contentClassName="py-8 sm:py-10">
      <header className="storii-blanket pb-6">
        <Kicker>The feed</Kicker>
        <h1 className="mt-2.5 max-w-2xl font-serif text-[1.75rem] leading-[1.18] tracking-tight text-ink sm:text-[2.2rem]">
          Questions people are sitting with right now
        </h1>
        <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-2">
          Read what others lived through, or add the part only you can tell.
        </p>

        <form onSubmit={submitSearch} className="mt-6 flex max-w-xl items-center gap-2.5">
          <label className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-0 size-3.5 text-muted-foreground" />
            <input
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search questions…"
              aria-label="Search questions"
              className="h-9 w-full border-b border-rule-strong bg-transparent pl-5 text-[13.5px] text-ink placeholder:italic placeholder:text-muted-foreground focus:border-ink focus:outline-none"
            />
          </label>
          <Button
            type="submit"
            variant="outline"
            className="h-9 rounded-sm border-rule bg-transparent px-4 text-[9.5px] uppercase tracking-[0.2em] text-ink hover:bg-accent"
          >
            Search
          </Button>
        </form>

        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          <FilterChip
            active={category === "all"}
            to={`/feed${query ? `?q=${encodeURIComponent(query)}` : ""}`}
          >
            All
          </FilterChip>
          {CATEGORIES.map((entry) => (
            <FilterChip
              key={entry.slug}
              tone={entry.slug}
              active={category === entry.slug}
              to={`/feed?category=${entry.slug}${
                query ? `&q=${encodeURIComponent(query)}` : ""
              }`}
            >
              {entry.name}
            </FilterChip>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3.5 text-[9.5px] uppercase tracking-[0.2em]">
          <span className="text-muted-foreground">Order by</span>
          {SORTS.map((entry) => (
            <button
              key={entry.value}
              type="button"
              onClick={() => updateParams({ sort: entry.value })}
              className={cn(
                "border-b pb-0.5 transition-colors",
                sort === entry.value
                  ? "border-ink text-ink"
                  : "border-transparent text-ink-2 hover:text-ink",
              )}
            >
              {entry.label}
            </button>
          ))}
          {hasFilters ? (
            <button
              type="button"
              onClick={() => setSearchParams(new URLSearchParams(), { replace: true })}
              className="ml-auto inline-flex items-center gap-1.5 text-ink-2 hover:text-ink"
            >
              <X className="size-3" />
              Clear filters
            </button>
          ) : null}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule-strong pb-3">
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {category === "all" ? "Every category" : categoryName(category)}
              {query ? ` · matching “${query}”` : ""}
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {feed === undefined
                ? "Loading…"
                : plural(questions.length, "question")}
            </p>
          </div>

          {feed === undefined ? <FeedSkeleton /> : null}

          {feed !== undefined && questions.length === 0 ? (
            <EmptyNote
              className="mt-10"
              title="Nothing here yet."
              action={
                <Button
                  asChild
                  className="rounded-sm px-5 text-[10px] uppercase tracking-[0.22em]"
                >
                  <Link to="/ask">Ask this question</Link>
                </Button>
              }
            >
              {query
                ? "No question matches that wording. Try a shorter phrase, or ask it yourself — you'll get a better answer than a search result."
                : "This shelf is empty. Be the first to put a real question on it."}
            </EmptyNote>
          ) : null}

          {questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index}
              delay={Math.min(index, 6) * 60}
            />
          ))}
        </section>

        <aside className="space-y-12">
          <div>
            <h2 className="border-b border-rule-strong pb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Waiting for an answer
            </h2>
            <ul className="mt-5 space-y-5">
              {openQuestions.map((question) => (
                <li key={question.id}>
                  <Link
                    to={`/questions/${question.id}`}
                    className="group block"
                    style={toneStyle(question.category)}
                  >
                    <span className="text-[8.5px] uppercase tracking-[0.2em] text-muted-foreground">
                      {categoryName(question.category)}
                    </span>
                    <span className="storii-link mt-0.5 block font-serif text-[14.5px] leading-snug text-ink decoration-(--tone)">
                      {question.title}
                    </span>
                  </Link>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Asked {timeAgo(question.createdAt)} · no experiences yet
                  </p>
                </li>
              ))}
              {archive && openQuestions.length === 0 ? (
                <li className="text-[14px] italic text-muted-foreground">
                  Every question has at least one experience. Lovely.
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h2 className="border-b border-rule-strong pb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Categories
            </h2>
            <ul className="mt-5 space-y-3">
              {CATEGORIES.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    to={`/feed?category=${entry.slug}`}
                    className="group flex items-baseline justify-between gap-4"
                    style={toneStyle(entry.slug)}
                  >
                    <span className="flex items-center gap-2.5 text-[14px] text-ink-2 group-hover:text-ink">
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

          <div>
            <Link
              to="/ask"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink-2 hover:text-ink"
            >
              Ask your own question
              <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
