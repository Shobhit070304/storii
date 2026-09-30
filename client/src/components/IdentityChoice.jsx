import { cn } from "@/lib/utils";

/**
 * Two quiet choices: sign the post with your name, or leave it unnamed.
 * `value` is the anonymous flag itself.
 */
export function IdentityChoice({ value, onChange, name, className }) {
  const options = [
    { anonymous: false, label: name ? `As ${name}` : "With my name" },
    { anonymous: true, label: "Anonymous" },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="inline-flex border border-rule">
        {options.map((option) => (
          <button
            key={String(option.anonymous)}
            type="button"
            aria-pressed={value === option.anonymous}
            onClick={() => onChange(option.anonymous)}
            className={cn(
              "px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-colors duration-200",
              value === option.anonymous
                ? "bg-ink text-paper"
                : "bg-transparent text-ink-2 hover:text-ink",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-[12.5px] leading-relaxed text-muted-foreground">
        {value
          ? "Your name won't be shown to anyone."
          : "Your name appears next to it."}
      </p>
    </div>
  );
}

export default IdentityChoice;
