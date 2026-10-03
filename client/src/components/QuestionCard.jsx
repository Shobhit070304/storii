import { CategoryTag } from "@/components/CategoryTag";
import { plural, signedBy, timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toneStyle } from "@/lib/categories";
import { Link } from "react-router";
import { MessageSquare } from "lucide-react";

/**
 * One question in the feed — social card style.
 * Bold title, clean meta, category accent, answer count badge.
 */
export function QuestionCard({ question, index, className, delay = 0 }) {
  if (!question) return null;
  const isOpen = question.answerCount === 0;
  const questionId = question.id;

  return (
    <article
      className={cn("storii-rise storii-card group block", className)}
      style={{ ...toneStyle(question.category), animationDelay: `${delay}ms` }}
    >
      <Link to={`/questions/${questionId}`} className="block p-5 sm:p-6 focus-visible:outline-none">
        {/* Category + time */}
        <div className="flex items-center justify-between gap-3">
          <CategoryTag slug={question.category} asLink={false} className="text-[10px]" />
          <span className="text-[11px] text-muted-foreground shrink-0">
            {timeAgo(question.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-serif text-[1.15rem] sm:text-[1.25rem] leading-snug tracking-tight text-ink group-hover:text-ink/80 transition-colors">
          {question.title}
        </h3>

        {/* Body excerpt */}
        {question.body ? (
          <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-2">
            {question.body}
          </p>
        ) : null}

        {/* Meta footer */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-[12px] text-muted-foreground">
            {question.anonymous ? "Asked anonymously" : `By ${signedBy(question)}`}
          </span>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
              isOpen
                ? "bg-vermillion/10 text-vermillion"
                : "bg-muted text-muted-foreground"
            )}
          >
            <MessageSquare className="size-3" />
            {isOpen ? "No answers yet" : plural(question.answerCount, "answer")}
          </span>
        </div>
      </Link>
    </article>
  );
}

export default QuestionCard;
