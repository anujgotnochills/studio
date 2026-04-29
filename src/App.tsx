import { Routes, Route, useLocation } from "react-router-dom";
import CardNav from "./components/CardNav";
import Home from "./pages/Home";
import Contact from "./pages/JoinUs";
import ComingSoon from "./pages/ComingSoon";
import DashboardLogin from "./pages/DashboardLogin";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/dashboard/ProtectedRoute";
import FloatingChat from "./components/FloatingChat";
import { AnimatePresence } from "framer-motion";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { useEffect, useRef } from "react";

function App() {
  const location = useLocation();
  const lenisRef = useRef<LenisRef>(null);
  const isDashboard = location.pathname.startsWith("/dashboard");

  // Lenis integration with framer motion
  useEffect(() => {
    function update(data: { timestamp: number }) {
      const time = data.timestamp;
      lenisRef.current?.lenis?.raf(time);
    }

    frame.update(update, true);

    return () => cancelFrame(update);
  }, []);

  const navigationItems = [
    { label: "Our Services", href: "/#services" },
    { label: "Studio", href: "/#studio" },
    { label: "Our Work", href: "/#portfolio" },
    { label: "About Us", href: "/#about" },
    { label: "Testimonials", href: "/#testimonials" },
  ];

  // Dashboard routes — no navbar, no Lenis, no floating chat
  if (isDashboard) {
    return (
      <Routes>
        <Route path="/dashboard/login" element={<DashboardLogin />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    );
  }

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} style={{ position: 'relative' }}>
      <AnimatePresence mode="wait" initial={false}>
        <div
          key={location.pathname}
          className="min-h-screen relative bg-background text-foreground overflow-x-hidden"
        >
          <CardNav items={navigationItems} />
          <FloatingChat />
          <main id="main-content" className="relative">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/coming-soon" element={<ComingSoon />} />
              {/* Gallery route removed */}
            </Routes>
          </main>
        </div>
      </AnimatePresence>
    </ReactLenis>
  );
}

export default App;
