import { IdentityChoice } from "@/components/IdentityChoice";
import { Kicker, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { CATEGORIES, toneStyle } from "@/lib/categories";
import { api, auth } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const MAX_TITLE = 160;

export default function AskQuestion() {
  const navigate = useNavigate();
  const user = auth.getUser();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [anonymous, setAnonymous] = useState(false);
  const [saving, setSaving] = useState(false);

  const trimmed = title.trim();
  const ready = trimmed.length >= 10;

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await api.createQuestion({
        title: trimmed,
        body: body.trim() || undefined,
        category,
        anonymous,
        authorName: anonymous ? "Anonymous" : user?.name || "You",
      });
      toast.success("Your question is on the record.");
      navigate(`/questions/${res.id || res._id || res}`);
    } catch (error) {
      toast.error(error?.message || "That didn't save. Try again?");
      setSaving(false);
    }
  }

  return (
    <PageShell contentClassName="py-14">
      <header className="storii-blanket pb-8">
        <Kicker>Ask a question</Kicker>
        <h1 className="mt-3 max-w-2xl font-serif text-[2.4rem] leading-[1.1] tracking-tight text-ink sm:text-[3rem]">
          What do you wish someone had told you?
        </h1>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink-2">
          Ask it plainly. Someone who has lived through it will answer with
          what really happened.
        </p>
      </header>

      <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <form onSubmit={submit} className="space-y-12">
          <div>
            <label
              htmlFor="title"
              className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
            >
              Your question
            </label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value.slice(0, MAX_TITLE))}
              placeholder="What do you wish you knew before your first job?"
              className="mt-4 w-full border-b border-rule-strong bg-transparent pb-3 font-serif text-[1.6rem] leading-snug text-ink placeholder:italic placeholder:text-muted-foreground focus:border-ink focus:outline-none sm:text-[1.9rem]"
            />
            <p className="mt-2 text-[11px] text-muted-foreground">
              {ready ? "Reads like a question." : "A few more words, please."}{" "}
              <span className="tabular-nums">
                {trimmed.length}/{MAX_TITLE}
              </span>
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Where does it belong?
            </p>
            <div className="mt-4 grid gap-px border border-rule bg-rule sm:grid-cols-2">
              {CATEGORIES.map((entry) => {
                const active = entry.slug === category;
                return (
                  <button
                    key={entry.slug}
                    type="button"
                    onClick={() => setCategory(entry.slug)}
                    style={toneStyle(entry.slug)}
                    className={cn(
                      "flex items-center gap-3 p-4 text-left transition-colors duration-200",
                      active ? "bg-accent" : "bg-paper hover:bg-paper-2",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 shrink-0 rounded-full bg-[var(--tone)] transition-transform",
                        active ? "scale-150" : "opacity-50",
                      )}
                      aria-hidden="true"
                    />
                    <span className="font-serif text-[16px] text-ink">
                      {entry.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="body"
              className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground"
            >
              Anything else? (optional)
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={4}
              placeholder="I'm starting my first job next month and nobody talks about the first week."
              className="mt-4 w-full resize-y border border-rule bg-paper px-4 py-3 font-serif text-[16px] leading-relaxed text-ink placeholder:italic placeholder:text-muted-foreground focus:border-ink focus:outline-none"
            />
          </div>

          <div className="space-y-6 border-t border-rule pt-6">
            <IdentityChoice
              value={anonymous}
              onChange={setAnonymous}
              name={user?.name || "You"}
            />
            <Button
              type="submit"
              size="lg"
              disabled={!ready || saving}
              className="w-full rounded-sm px-6 text-[10px] uppercase tracking-[0.22em] sm:w-auto"
            >
              {saving ? "Posting…" : "Post question"}
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </form>

        <aside>
          <h2 className="border-b border-rule-strong pb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Not sure how to start?
          </h2>
          <p className="mt-5 text-[14px] leading-relaxed text-ink-2">
            Borrow one of these and make it yours.
          </p>
          <ul className="mt-5 space-y-4">
            {CATEGORIES.slice(0, 4).map((entry) => (
              <li key={entry.slug} style={toneStyle(entry.slug)}>
                <button
                  type="button"
                  onClick={() => {
                    setTitle(entry.prompt);
                    setCategory(entry.slug);
                  }}
                  className="storii-link text-left font-serif text-[16px] leading-snug text-ink decoration-[var(--tone)]"
                >
                  {entry.prompt}
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </PageShell>
  );
}
