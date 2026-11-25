import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientInstance } from "@/lib/query-client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#F8F3ED" }}>
      <div className="text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em]" style={{ color: "#A93A60" }}>404</p>
        <h1 className="font-display mt-2 text-5xl" style={{ color: "#402B24", fontStyle: "italic" }}>Page not found</h1>
        <a href="/" className="mt-6 inline-block text-sm" style={{ color: "#A93A60" }}>← Back to home</a>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
