import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Feather, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router";
import { GoogleSignIn } from "@/components/GoogleSignIn";

const NAV = [
  { to: "/feed", label: "Explore" },
  { to: "/dashboard", label: "My contributions" },
];

export function StoriiHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={cn(
          "transition-all duration-300",
          scrolled ? "storii-glass" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
          {/* Logo */}
          <Wordmark size="sm" />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-ink"
                      : "text-ink-2 hover:bg-accent/60 hover:text-ink"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden rounded-full px-4 text-[12px] font-medium md:inline-flex"
            >
              <Link to="/ask">
                <Feather className="size-3.5" />
                Ask a question
              </Link>
            </Button>

            <div className="hidden sm:flex items-center pl-2 border-l border-rule/60">
              <GoogleSignIn variant="header" />
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="flex size-9 items-center justify-center rounded-md text-ink-2 hover:bg-accent hover:text-ink md:hidden"
            >
              {menuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen ? (
          <div className="border-t border-rule bg-surface px-5 pb-4 pt-3 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-accent text-ink" : "text-ink-2 hover:bg-accent/60 hover:text-ink"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/ask"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink-2 hover:bg-accent/60 hover:text-ink"
              >
                Ask a question
              </Link>
              <div className="mt-2 pt-2 border-t border-rule">
                <GoogleSignIn variant="mobile" />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

export default StoriiHeader;
