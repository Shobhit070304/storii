import { cn } from "@/lib/utils";

/** A quiet, ruled empty state — never a shouty illustration. */
export function EmptyNote({ title, children, action, className }) {
  return (
    <div
      className={cn(
        "border border-dashed border-rule px-6 py-10 text-center",
        className,
      )}
    >
      <p className="text-lg italic text-ink">{title}</p>
      {children ? (
        <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-2">
          {children}
        </p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export default EmptyNote;
