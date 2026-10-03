import { Wordmark } from "@/components/Wordmark";
import { CATEGORIES } from "@/lib/categories";
import { Link } from "react-router";

export function StoriiFooter() {
  return (
    <footer className="mt-24 border-t border-rule bg-surface">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-10">
          {/* Brand */}
          <div className="max-w-xs">
            <Wordmark size="md" />
            <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
              Lived experience, on the record. Stories from people who were actually there.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Explore
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-ink-2">
                <li><Link to="/feed" className="hover:text-ink">The feed</Link></li>
                <li><Link to="/feed?sort=open" className="hover:text-ink">Unanswered questions</Link></li>
                <li><Link to="/feed?sort=answered" className="hover:text-ink">Most answered</Link></li>
                <li><Link to="/ask" className="hover:text-ink">Ask a question</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Topics
              </p>
              <ul className="mt-3 space-y-2 text-[13px] text-ink-2">
                {CATEGORIES.slice(0, 5).map((c) => (
                  <li key={c.slug}>
                    <Link to={`/feed?category=${c.slug}`} className="hover:text-ink">
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-rule pt-6 text-[11px] text-muted-foreground">
          <span>© {new Date().getFullYear()} Storii</span>
          <span>No ads · No trackers · No hot takes</span>
        </div>
      </div>
    </footer>
  );
}

export default StoriiFooter;
