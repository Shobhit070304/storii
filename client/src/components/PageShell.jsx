import { PaperBackground } from "@/components/PaperBackground";
import { StoriiFooter } from "@/components/StoriiFooter";
import { StoriiHeader } from "@/components/StoriiHeader";
import { cn } from "@/lib/utils";

/** Every page: paper behind, masthead on top, footer underfoot. */
export function PageShell({
  children,
  width = "wide",
  className,
  contentClassName,
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <PaperBackground />
      <StoriiHeader />
      <main className={cn("flex-1", className)}>
        <div
          className={cn(
            "mx-auto w-full px-5 sm:px-8",
            width === "narrow" ? "max-w-3xl" : "max-w-6xl",
            contentClassName,
          )}
        >
          {children}
        </div>
      </main>
      <StoriiFooter />
    </div>
  );
}

export function Kicker({ children, className }) {
  return (
    <p
      className={cn(
        "text-[10px] uppercase tracking-[0.28em] text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHeading({ kicker, title, note, className }) {
  return (
    <div className={cn("storii-blanket py-4", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          {kicker ? <Kicker>{kicker}</Kicker> : null}
          <h2 className="mt-1 font-serif text-2xl tracking-tight text-ink sm:text-[1.75rem]">
            {title}
          </h2>
        </div>
        {note ? (
          <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}

export default PageShell;
