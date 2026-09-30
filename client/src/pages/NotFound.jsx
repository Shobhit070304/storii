import { Kicker, PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <PageShell width="narrow" contentClassName="py-24 text-center">
      <Kicker>Page not found</Kicker>
      <h1 className="mt-4 font-serif text-[3rem] leading-none tracking-tight text-ink">
        Nothing filed here
      </h1>
      <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-ink-2">
        This page either moved, never existed, or was struck from the record. The
        archive is still open in six other directions.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild className="rounded-sm px-5 text-[10px] uppercase tracking-[0.22em]">
          <Link to="/feed">Read the feed</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-sm border-rule bg-transparent px-5 text-[10px] uppercase tracking-[0.22em] text-ink hover:bg-accent"
        >
          <Link to="/">Back home</Link>
        </Button>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={`/feed?category=${category.slug}`}
            className="border border-rule px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-ink-2 hover:border-ink hover:text-ink"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
