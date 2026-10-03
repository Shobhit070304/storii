import { CategoryTag } from "@/components/CategoryTag";
import { plural, shortDate, signedBy, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toneStyle } from "@/lib/categories";
import { Link } from "react-router";

/**
 * One question in the feed: a sleek, refined editorial entry.
 */
export function QuestionCard({ question, index, className, delay = 0 }) {
  if (!question) return null;
  const isOpen = question.answerCount === 0;
  const questionId = question.id;

  return (
    <article
      className={cn(
        "storii-rise group relative grid grid-cols-1 gap-x-5 border-b border-rule/70 py-4 sm:py-5 sm:grid-cols-[2rem_minmax(0,1fr)] transition-colors hover:bg-paper-2/40 px-2 rounded-sm",
        className,
      )}
      style={{ ...toneStyle(question.category), animationDelay: `${delay}ms` }}
    >
      <span
        aria-hidden="true"
        className="hidden pt-0.5 text-[10.5px] tabular-nums tracking-[0.18em] text-muted-foreground/80 sm:block"
      >
        {typeof index === "number"
          ? String(index + 1).padStart(2, "0")
          : "—"}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <CategoryTag slug={question.category} className="text-[9px]" />
          <span className="text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground/75">
            {timeAgo(question.createdAt)}
          </span>
        </div>

        <h3 className="mt-1.5 font-serif text-[1.15rem] sm:text-[1.25rem] leading-snug tracking-tight text-ink">
          <Link
            to={`/questions/${questionId}`}
            className="storii-link decoration-(--tone) focus-visible:outline-none"
          >
            {question.title}
          </Link>
        </h3>

        {question.body ? (
          <p className="mt-1.5 line-clamp-2 max-w-2xl text-[13px] leading-relaxed text-ink-2/85">
            {question.body}
          </p>
        ) : null}

        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9.5px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="normal-case tracking-wider text-ink-2">
            {question.anonymous
              ? "Asked anonymously"
              : `Asked by ${signedBy(question)}`}
          </span>
          <span className="hidden h-px w-4 bg-rule sm:block" aria-hidden="true" />
          <span className={cn(isOpen && "text-(--tone) font-medium")}>
            {isOpen
              ? "No experiences yet"
              : plural(question.answerCount, "experience")}
          </span>
          <span className="hidden h-px w-4 bg-rule lg:block" aria-hidden="true" />
          <span className="hidden lg:inline text-muted-foreground/70">
            {shortDate(question.createdAt)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default QuestionCard;
