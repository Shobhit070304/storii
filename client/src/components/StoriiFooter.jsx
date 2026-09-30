import { Wordmark } from "@/components/Wordmark";
import { CATEGORIES } from "@/lib/categories";
import { dateline } from "@/lib/format";
import { Link } from "react-router";

function Column({ title, children }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5 text-[14px] text-ink-2">{children}</ul>
    </div>
  );
}

export function StoriiFooter() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Wordmark size="md" />
            <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-ink-2">
              Storii collects the things people only learn by living them, so
              the next person doesn't have to find out the hard way.
            </p>
            <p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              Set in Times New Roman, experiences in Inter
            </p>
          </div>

          <Column title="Read">
            <li>
              <Link className="storii-link" to="/feed">
                The feed
              </Link>
            </li>
            <li>
              <Link className="storii-link" to="/feed?sort=open">
                Open questions
              </Link>
            </li>
            <li>
              <Link className="storii-link" to="/feed?sort=answered">
                Most answered
              </Link>
            </li>
          </Column>

          <Column title="Categories">
            {CATEGORIES.slice(0, 5).map((category) => (
              <li key={category.slug}>
                <Link
                  className="storii-link"
                  to={`/feed?category=${category.slug}`}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </Column>

          <Column title="Write">
            <li>
              <Link className="storii-link" to="/ask">
                Ask a question
              </Link>
            </li>
            <li>
              <Link className="storii-link" to="/#how-it-works">
                How Storii works
              </Link>
            </li>
            <li>
              <Link className="storii-link" to="/dashboard">
                Your contributions
              </Link>
            </li>
          </Column>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6 text-[9px] uppercase tracking-[0.26em] text-muted-foreground">
          <span>Storii — written by people who were there</span>
          <span>No ads · No trackers · No hot takes</span>
          <span>{dateline()}</span>
        </div>
      </div>
    </footer>
  );
}

export default StoriiFooter;
