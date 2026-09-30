import { Toaster } from "@/components/ui/sonner";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import "./index.css";

// Lazy load route components
const Landing = lazy(() => import("./pages/Landing.jsx"));
const Feed = lazy(() => import("./pages/Feed.jsx"));
const QuestionDetail = lazy(() => import("./pages/QuestionDetail.jsx"));
const AskQuestion = lazy(() => import("./pages/AskQuestion.jsx"));
const Contributions = lazy(() => import("./pages/Contributions.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="animate-pulse font-serif text-sm italic text-muted-foreground">
        Setting the type…
      </p>
    </div>
  );
}

// Ensure light mode styling for Storii
document.documentElement.classList.remove("dark");
document.documentElement.style.colorScheme = "light";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/categories" element={<Navigate to="/feed" replace />} />
          <Route path="/questions/:id" element={<QuestionDetail />} />
          <Route path="/ask" element={<AskQuestion />} />
          <Route path="/dashboard" element={<Contributions />} />
          <Route path="/auth" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
    <Toaster />
  </StrictMode>
);
