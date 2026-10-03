import { initials, paragraphs, signedBy, timeAgo } from "@/lib/format";
import { toneStyle } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { EyeOff } from "lucide-react";

/** One experience, printed like a letter to the reader. */
export function AnswerCard({ answer, category, index = 0 }) {
  if (!answer) return null;
  const author = signedBy(answer);

  return (
    <article
      className="storii-rise border-t border-rule pt-8"
      style={{ ...toneStyle(category), animationDelay: `${index * 60}ms` }}
    >
      <header className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full border border-rule text-[13px] tracking-wide text-ink-2"
        >
          {answer.anonymous ? (
            <EyeOff className="size-4" strokeWidth={1.5} />
          ) : (
            initials(answer.authorName)
          )}
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-[15px] text-ink",
              answer.anonymous && "italic text-ink-2",
            )}
          >
            {author}
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {index === 0 ? "First experience" : "Shared an experience"} ·{" "}
            {timeAgo(answer.createdAt)}
          </p>
        </div>
      </header>

      {answer.context ? (
        <p className="mt-6 border-l-2 pl-4 text-[13px] italic leading-relaxed text-ink-2 border-(--tone)">
          {answer.context}
        </p>
      ) : null}

      <div className="storii-measure storii-experience mt-5 space-y-4 text-ink">
        {paragraphs(answer.body).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}

export function AnswersList({ answers, category, className }) {
  if (!answers || answers.length === 0) return null;

  return (
    <div className={cn("space-y-8", className)}>
      {answers.map((answer, index) => (
        <AnswerCard
          key={answer.id}
          answer={answer}
          category={category}
          index={index}
        />
      ))}
    </div>
  );
}

export default AnswerCard;
