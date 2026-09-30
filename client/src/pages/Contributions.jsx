import { EmptyNote } from "@/components/EmptyNote";
import { Kicker, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { categoryName, toneStyle } from "@/lib/categories";
import { auth, useMyContributions } from "@/lib/api";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { plural, timeAgo } from "@/lib/format";
import { ArrowUpRight, Feather } from "lucide-react";
import { Link } from "react-router";

function Stat({ label, value, note }) {
  return (
    <div className="border border-rule bg-paper-2 p-6">
      <p className="font-serif text-4xl tracking-tight text-ink">{value}</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      {note ? <p className="mt-3 text-[13px] text-ink-2">{note}</p> : null}
    </div>
  );
}

export default function Contributions() {
  const user = auth.getUser();
  const isAuthenticated = Boolean(user);
  const { questions, answers } = useMyContributions();
  const experiencesGiven = answers.reduce((total) => total + 1, 0);
  const experiencesReceived = questions.reduce(
    (total, question) => total + (question.answerCount || 0),
    0,
  );

  return (
    <PageShell contentClassName="py-14">
      <header className="storii-blanket flex flex-wrap items-end justify-between gap-6 pb-8">
        <div>
          <Kicker>{isAuthenticated ? `Your desk · ${user.name}` : "Your desk"}</Kicker>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.1] tracking-tight text-ink sm:text-[3rem]">
            Your contributions
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">
            Everything you've asked and everything you've lived through, kept
            together in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!isAuthenticated ? <GoogleSignIn variant="desk" /> : null}
          <Button
            asChild
            variant="outline"
            className="rounded-sm border-rule bg-transparent text-[10px] uppercase tracking-[0.22em] text-ink-2 hover:bg-accent hover:text-ink"
          >
            <Link to="/ask">
              <Feather className="size-3.5" />
              Ask a question
            </Link>
          </Button>
        </div>
      </header>

      <div className="mt-10 grid gap-px border border-rule bg-rule sm:grid-cols-3">
        <Stat
          label="Questions asked"
          value={questions.length}
          note="Each one waiting on somebody's experience."
        />
        <Stat
          label="Experiences shared"
          value={experiencesGiven}
          note="Answers you've written from your own life."
        />
        <Stat
          label="Experiences received"
          value={experiencesReceived}
          note="How many times others answered you."
        />
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-2">
        <section>
          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <h2 className="font-serif text-2xl tracking-tight text-ink">
              Questions you asked
            </h2>
            <Link
              to="/ask"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-ink-2 hover:text-ink"
            >
              Ask another
              <ArrowUpRight className="size-3" />
            </Link>
          </div>

          <ul className="mt-6 space-y-6">
            {questions.map((question) => {
              const qId = question.id || question._id;
              return (
                <li
                  key={qId}
                  className="border-b border-rule pb-6"
                  style={toneStyle(question.category)}
                >
                  <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.22em] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-[var(--tone)]" />
                    <span>{categoryName(question.category)}</span>
                    <span>{timeAgo(question.createdAt)}</span>
                  </div>
                  <Link
                    to={`/questions/${qId}`}
                    className="storii-link mt-2 block font-serif text-[19px] leading-snug text-ink decoration-[var(--tone)]"
                  >
                    {question.title}
                  </Link>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {question.answerCount === 0
                      ? "No experiences yet"
                      : plural(question.answerCount, "experience")}
                    {question.anonymous ? " · anonymous" : ""}
                  </p>
                </li>
              );
            })}
          </ul>

          {questions.length === 0 ? (
            <EmptyNote
              className="mt-6"
              title="You haven't asked anything yet."
              action={
                <Button
                  asChild
                  className="rounded-sm px-5 text-[10px] uppercase tracking-[0.22em]"
                >
                  <Link to="/ask">Ask your first question</Link>
                </Button>
              }
            >
              The question you're carrying around is probably useful to more
              people than you think.
            </EmptyNote>
          ) : null}
        </section>

        <section>
          <div className="flex items-baseline justify-between border-b border-rule-strong pb-3">
            <h2 className="font-serif text-2xl tracking-tight text-ink">
              Experiences you shared
            </h2>
            <Link
              to="/feed?sort=open"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-ink-2 hover:text-ink"
            >
              Open questions
              <ArrowUpRight className="size-3" />
            </Link>
          </div>

          <ul className="mt-6 space-y-6">
            {answers.map((answer) => {
              const aId = answer.id || answer._id;
              return (
                <li
                  key={aId}
                  className="border-b border-rule pb-6"
                  style={toneStyle(answer.question?.category)}
                >
                  <Link
                    to={`/questions/${answer.questionId}`}
                    className="storii-link block font-serif text-[19px] leading-snug text-ink decoration-[var(--tone)]"
                  >
                    {answer.question
                      ? answer.question.title
                      : "A question that has since been removed"}
                  </Link>
                  <p className="mt-3 line-clamp-3 border-l-2 border-[var(--tone)] pl-4 text-[14px] italic leading-relaxed text-ink-2">
                    {answer.body}
                  </p>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                    Shared {timeAgo(answer.createdAt)}
                    {answer.anonymous ? " · anonymous" : ""}
                  </p>
                </li>
              );
            })}
          </ul>

          {answers.length === 0 ? (
            <EmptyNote
              className="mt-6"
              title="No experiences shared yet."
              action={
                <Button
                  asChild
                  className="rounded-sm px-5 text-[10px] uppercase tracking-[0.22em]"
                >
                  <Link to="/feed?sort=open">Find an open question</Link>
                </Button>
              }
            >
              Somebody is stuck on something you've already been through. It
              takes about a minute to help.
            </EmptyNote>
          ) : null}
        </section>
      </div>
    </PageShell>
  );
}
