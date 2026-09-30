import { AnswersList } from "@/components/AnswerCard";
import { CategoryTag } from "@/components/CategoryTag";
import { EmptyNote } from "@/components/EmptyNote";
import { IdentityChoice } from "@/components/IdentityChoice";
import { Kicker, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { categoryName, toneStyle } from "@/lib/categories";
import { api, auth, useQuestion, useAnswers, useQuestions } from "@/lib/api";
import { paragraphs, plural, shortDate, signedBy, timeAgo } from "@/lib/format";
import { ArrowRight, ArrowUpRight, Check, Copy, Feather } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4 py-8" aria-hidden="true">
      <div className="h-2 w-28 bg-muted" />
      <div className="h-8 w-3/4 bg-muted" />
      <div className="h-3 w-2/3 bg-muted" />
      <div className="h-3 w-1/2 bg-muted" />
    </div>
  );
}

function AnswerComposer({ questionId, onSubmitted }) {
  const user = auth.getUser();
  const [body, setBody] = useState("");
  const [context, setContext] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      await api.createAnswer(questionId, {
        body,
        context: context.trim() || undefined,
        anonymous,
        authorName: anonymous ? "Anonymous" : user?.name || "You",
      });
      setBody("");
      setContext("");
      toast.success("Thank you — your experience is on the record.");
      if (onSubmitted) onSubmitted();
    } catch (error) {
      toast.error(error?.message || "That didn't save. Try again?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="border border-rule bg-paper-2 p-8">
      <Kicker>Add your experience</Kicker>
      <h3 className="mt-3 font-serif text-2xl tracking-tight text-ink">
        What actually happened to you?
      </h3>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-2">
        Write it the way you'd tell a friend — specific, unpolished, honest.
        Leave out the advice and include the detail.
      </p>

      <textarea
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={7}
        placeholder="It took me about a year to work out that…"
        className="storii-experience mt-6 w-full resize-y border border-rule bg-paper px-4 py-3 text-ink placeholder:italic placeholder:text-muted-foreground focus:border-ink focus:outline-none"
      />

      <div className="mt-4">
        <label className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          How you know (optional)
        </label>
        <input
          value={context}
          onChange={(event) => setContext(event.target.value)}
          maxLength={90}
          placeholder="Eight years in restaurant kitchens"
          className="mt-2 h-10 w-full border-b border-rule bg-transparent text-[15px] text-ink placeholder:italic placeholder:text-muted-foreground focus:border-ink focus:outline-none"
        />
      </div>

      <div className="mt-6 space-y-6 border-t border-rule pt-6">
        <IdentityChoice
          value={anonymous}
          onChange={setAnonymous}
          name={user?.name || "You"}
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {body.trim().length < 30
              ? `${30 - body.trim().length} more characters to go`
              : "Long enough — say the rest"}
          </p>
          <Button
            type="submit"
            disabled={saving || body.trim().length < 30}
            className="rounded-sm px-5 text-[10px] uppercase tracking-[0.22em]"
          >
            <Feather className="size-3.5" />
            {saving ? "Saving…" : "Post experience"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default function QuestionDetail() {
  const { id } = useParams();
  const question = useQuestion(id);
  const answers = useAnswers(id);
  const categoryQuestions = useQuestions({ category: question?.category });
  const related = (categoryQuestions || [])
    .filter((entry) => (entry.id || entry._id) !== id)
    .slice(0, 3);

  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied.");
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      toast.error("Couldn't copy the link — copy it from the address bar.");
    }
  }

  if (question === undefined) {
    return (
      <PageShell width="narrow" contentClassName="py-16">
        <DetailSkeleton />
      </PageShell>
    );
  }

  if (!question) {
    return (
      <PageShell width="narrow" contentClassName="py-20">
        <EmptyNote
          title="That question isn't on file."
          action={
            <Button asChild className="rounded-sm px-5 text-[10px] uppercase tracking-[0.22em]">
              <Link to="/feed">Back to the feed</Link>
            </Button>
          }
        >
          It may have been removed. The feed has plenty of other questions
          waiting for someone's experience.
        </EmptyNote>
      </PageShell>
    );
  }

  const answerList = answers || [];

  return (
    <PageShell contentClassName="py-12">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <article style={toneStyle(question.category)}>
          <nav className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Link to="/feed" className="hover:text-ink">
              The feed
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              to={`/feed?category=${question.category}`}
              className="hover:text-ink"
            >
              {categoryName(question.category)}
            </Link>
          </nav>

          <header className="storii-blanket mt-6 pb-8">
            <CategoryTag slug={question.category} />
            <h1 className="mt-4 font-serif text-[2.1rem] leading-[1.12] tracking-tight text-ink sm:text-[2.8rem]">
              {question.title}
            </h1>

            {question.body ? (
              <div className="storii-measure mt-5 space-y-3 text-[17px] leading-relaxed text-ink-2">
                {paragraphs(question.body).map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <span className="normal-case tracking-[0.06em] text-ink-2">
                {question.anonymous
                  ? "Asked anonymously"
                  : `Asked by ${signedBy(question)}`}
              </span>
              <span className="h-px w-6 bg-rule" aria-hidden="true" />
              <span>{shortDate(question.createdAt)}</span>
              <span className="h-px w-6 bg-rule" aria-hidden="true" />
              <span>{timeAgo(question.createdAt)}</span>

              <button
                type="button"
                onClick={copyLink}
                className="ml-auto inline-flex items-center gap-2 border border-rule px-3 py-1.5 transition-colors hover:border-ink hover:text-ink"
              >
                {copied ? (
                  <Check className="size-3" />
                ) : (
                  <Copy className="size-3" />
                )}
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </header>

          <section className="mt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-rule-strong pb-3">
              <h2 className="font-serif text-2xl tracking-tight text-ink">
                {answerList.length === 0
                  ? "No experiences yet"
                  : plural(answerList.length, "experience")}
              </h2>
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                First-hand accounts only
              </p>
            </div>

            {answers === undefined ? (
              <div className="animate-pulse py-10" aria-hidden="true">
                <div className="h-3 w-2/3 bg-muted" />
              </div>
            ) : null}

            {answers !== undefined && answerList.length === 0 ? (
              <EmptyNote className="mt-8" title="Nobody has answered this yet.">
                If you've lived through it, you're the best-qualified person on
                this page. The first answer sets the tone for the others.
              </EmptyNote>
            ) : null}

            <AnswersList
              answers={answerList}
              category={question.category}
              className="mt-8"
            />

            <div id="respond" className="mt-12 scroll-mt-28">
              <AnswerComposer questionId={question.id || question._id} />
            </div>
          </section>
        </article>

        <aside className="space-y-12">
          <div>
            <h2 className="border-b border-rule-strong pb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              More in {categoryName(question.category)}
            </h2>
            <ul className="mt-5 space-y-5">
              {(related || []).map((entry) => {
                const entryId = entry.id || entry._id;
                return (
                  <li key={entryId} style={toneStyle(entry.category)}>
                    <Link to={`/questions/${entryId}`} className="block">
                      <span className="storii-link block font-serif text-[17px] leading-snug text-ink decoration-[var(--tone)]">
                        {entry.title}
                      </span>
                    </Link>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      {entry.answerCount === 0
                        ? "No experiences yet"
                        : plural(entry.answerCount, "experience")}
                    </p>
                  </li>
                );
              })}
              {related && related.length === 0 ? (
                <li className="text-[14px] italic text-muted-foreground">
                  Nothing else filed here yet.
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <Link
              to="/ask"
              className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink-2 hover:text-ink"
            >
              <ArrowUpRight className="size-3.5" />
              Ask your own question
            </Link>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
