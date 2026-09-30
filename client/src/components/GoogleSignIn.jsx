import { useEffect, useRef, useState } from "react";
import { api, auth } from "@/lib/api";
import { initials } from "@/lib/format";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "557775577807-lg58vh8b3riivusfhfk6jih2jqnie248.apps.googleusercontent.com";

export function GoogleSignIn({ variant = "header" }) {
  const [user, setUser] = useState(auth.getUser());
  const buttonRef = useRef(null);

  useEffect(() => {
    if (user || !buttonRef.current) return;

    function renderBtn() {
      if (window.google?.accounts?.id && buttonRef.current) {
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async (response) => {
            try {
              const res = await api.loginGoogle(response.credential);
              setUser(res.user);
              toast.success("Signed in with Google.");
            } catch (err) {
              toast.error(err.message || "Sign in failed");
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: variant === "header" ? "medium" : "large",
          text: "signin_with",
          shape: "rectangular",
        });
        return true;
      }
      return false;
    }

    if (!renderBtn()) {
      const interval = setInterval(() => {
        if (renderBtn()) clearInterval(interval);
      }, 300);
      return () => clearInterval(interval);
    }
  }, [user, variant]);

  if (user) {
    return (
      <div className="flex items-center gap-2.5">
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-full border border-rule bg-paper-2 text-[11px] font-medium text-ink overflow-hidden"
          title={user.name || user.email}
        >
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="size-full object-cover" />
          ) : (
            initials(user.name)
          )}
        </div>
        <span className="hidden max-w-[100px] truncate text-[10px] uppercase tracking-[0.16em] text-ink sm:inline">
          {user.name?.split(" ")[0]}
        </span>
        <button
          type="button"
          onClick={async () => {
            await api.logout();
            setUser(null);
            toast.success("Signed out.");
          }}
          className="text-ink-2 hover:text-ink transition-colors p-1"
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut className="size-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center">
      <div ref={buttonRef} className="overflow-hidden rounded-sm" />
    </div>
  );
}

export default GoogleSignIn;
