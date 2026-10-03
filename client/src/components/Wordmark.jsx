import { cn } from "@/lib/utils";
import { Link } from "react-router";

const SIZES = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-[2.75rem] sm:text-[3.5rem]",
};

/** Storii wordmark — serif with a vermillion full stop. */
export function Wordmark({ to = "/", size = "md", className }) {
  return (
    <Link
      to={to}
      aria-label="Storii home"
      className={cn(
        "inline-flex items-baseline font-serif font-normal leading-none tracking-tight text-ink",
        SIZES[size] || SIZES.md,
        className,
      )}
    >
      Storii
      <span className="text-vermillion">.</span>
    </Link>
  );
}

export default Wordmark;
