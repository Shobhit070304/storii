import { categoryName, toneStyle } from "@/lib/categories";
import { cn } from "@/lib/utils";
import { Link } from "react-router";

/** Small caps category label with its accent dot. */
export function CategoryTag({ slug, asLink = true, className }) {
  const label = categoryName(slug);
  const content = (
    <>
      <span
        className="size-1.5 shrink-0 rounded-full bg-[var(--tone)] transition-transform duration-300 group-hover/tag:scale-150"
        aria-hidden="true"
      />
      <span className="transition-colors duration-300 group-hover/tag:text-[var(--tone)]">
        {label}
      </span>
    </>
  );

  const classes = cn(
    "group/tag inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-ink-2",
    className,
  );

  if (!asLink) {
    return (
      <span className={classes} style={toneStyle(slug)}>
        {content}
      </span>
    );
  }

  return (
    <Link
      to={`/feed?category=${slug}`}
      className={classes}
      style={toneStyle(slug)}
    >
      {content}
    </Link>
  );
}

export default CategoryTag;
