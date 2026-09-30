import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { dateline } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Feather, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { GoogleSignIn } from "@/components/GoogleSignIn";

const NAV = [
  { to: "/feed", label: "Feed" },
  { to: "/dashboard", label: "Contributions" },
];

function navClass({ isActive }) {
  return cn(
    "relative py-1 text-[10px] uppercase tracking-[0.22em] transition-colors",
    isActive ? "text-ink font-medium" : "text-ink-2 hover:text-ink",
  );
}

export function StoriiHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 24) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 ease-out">
      {/* Editorial top line: visible at the very top, smoothly collapses on scroll */}
      <div
        className={cn(
          "border-b border-rule/50 bg-paper/90 transition-all duration-300 overflow-hidden",
          scrolled ? "max-h-0 opacity-0 py-0 border-transparent" : "max-h-8 opacity-100 py-1.5"
        )}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 text-[9px] uppercase tracking-[0.26em] text-muted-foreground sm:px-8">
          <span className="truncate">An archive of lived experience</span>
          <span className="hidden sm:inline">{dateline()}</span>
          <span className="sm:hidden">Est. 2026</span>
        </div>
      </div>

      {/* Floating glass navbar container */}
      <div
        className={cn(
          "transition-all duration-300 ease-out",
          scrolled
            ? "mx-auto w-[92%] sm:w-[80%] md:w-[70%] lg:w-[60%] translate-y-2 sm:translate-y-3"
            : "w-full translate-y-0"
        )}
      >
        <div
          className={cn(
            "transition-all duration-300 ease-out",
            scrolled
              ? "rounded-xl sm:rounded-2xl border border-rule-strong/40 bg-paper/70 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 sm:px-6 py-2.5"
              : "border-b border-rule bg-paper/85 backdrop-blur-sm px-5 sm:px-8 py-3"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between gap-3 transition-all duration-300",
              scrolled ? "w-full" : "mx-auto w-full max-w-6xl"
            )}
          >
            <div className="flex items-center gap-6 sm:gap-8">
              <Wordmark size={scrolled ? "sm" : "md"} />

              <nav className="hidden items-center gap-6 md:flex">
                {NAV.map((item) => (
                  <NavLink key={item.to} to={item.to} className={navClass}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden rounded-sm px-3 text-[10px] uppercase tracking-[0.2em] text-ink-2 hover:text-ink md:inline-flex"
              >
                <Link to="/dashboard" className="inline-flex items-center gap-1.5">
                  <Feather className="size-3.5" />
                  Your desk
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                className="rounded-sm px-3.5 py-1 h-8 text-[9.5px] uppercase tracking-[0.2em] shadow-sm"
              >
                <Link to="/ask">
                  Ask a question
                  <ArrowUpRight className="size-3" />
                </Link>
              </Button>

              <div className="ml-1 pl-1 border-l border-rule/60 hidden sm:flex items-center">
                <GoogleSignIn variant="header" />
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-label="Menu"
                aria-expanded={menuOpen}
                className="flex size-8 items-center justify-center rounded-sm border border-transparent text-ink-2 hover:border-rule hover:text-ink md:hidden"
              >
                {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {menuOpen ? (
            <div className="mt-3 pt-3 border-t border-rule/60 md:hidden animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex flex-col gap-3 py-2">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="text-[11px] uppercase tracking-[0.22em] text-ink-2 hover:text-ink py-1"
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to="/ask"
                  onClick={() => setMenuOpen(false)}
                  className="text-[11px] uppercase tracking-[0.22em] text-ink-2 hover:text-ink py-1"
                >
                  Ask a question
                </NavLink>
                <div className="pt-2 border-t border-rule/50">
                  <GoogleSignIn variant="mobile" />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default StoriiHeader;
