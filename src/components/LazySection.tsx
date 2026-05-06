import { useEffect, useRef, useState, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  preloadDistance?: number; // Distance in pixels to preload before cursor reaches section
  threshold?: number; // Intersection observer threshold
}

// Global cursor tracker to avoid multiple listeners
let globalMouseX = 0;
let globalMouseY = 0;
let cursorTrackingActive = false;
let lastCheckTime = 0;
const THROTTLE_MS = 150; // Only check every 150ms to reduce overhead
const trackedSections = new Set<{
  element: HTMLElement;
  callback: () => void;
  preloadDistance: number;
}>();

// Single global mousemove listener for all sections
const setupGlobalCursorTracking = () => {
  if (cursorTrackingActive) return;
  cursorTrackingActive = true;

  const handleMouseMove = (e: MouseEvent) => {
    globalMouseX = e.clientX;
    globalMouseY = e.clientY;

    // Throttle checks - only check every THROTTLE_MS milliseconds
    const now = performance.now();
    if (now - lastCheckTime < THROTTLE_MS) return;
    lastCheckTime = now;

    // Use requestAnimationFrame for smooth checking
    requestAnimationFrame(() => {
      // Check all tracked sections
      trackedSections.forEach(({ element, callback, preloadDistance }) => {
        const rect = element.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) return;

        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = rect.bottom + window.scrollY;
        const sectionLeft = rect.left;
        const sectionRight = rect.right;

        const cursorY = globalMouseY + window.scrollY;
        const cursorX = globalMouseX;

        // Simplified proximity check
        const isCursorNearVertical =
          cursorY >= sectionTop - preloadDistance &&
          cursorY <= sectionBottom + preloadDistance;

        const isCursorNearHorizontal =
          cursorX >= sectionLeft - preloadDistance &&
          cursorX <= sectionRight + preloadDistance;

        if (isCursorNearVertical && isCursorNearHorizontal) {
          callback();
        }
      });
    });
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
};

/**
 * LazySection - A component that loads content based on cursor position and scroll/viewport visibility
 * It tracks the cursor position and preloads sections as the cursor approaches them
 */
export default function LazySection({
  children,
  fallback = <div className="min-h-[500px] w-full" />, // Placeholder with minimum height
  preloadDistance = 500, // Preload when cursor is within 500px of section
  threshold = 0.1, // Start loading when 10% of section is visible
}: LazySectionProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const shouldLoadRef = useRef(false);
  const cursorCheckCallbackRef = useRef<(() => void) | null>(null);

  // Sync ref with state
  useEffect(() => {
    shouldLoadRef.current = shouldLoad;
  }, [shouldLoad]);

  const triggerLoad = () => {
    if (shouldLoadRef.current) return;
    setIsLoading(true);
    setTimeout(() => {
      setShouldLoad(true);
      setIsLoading(false);
    }, 50);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldLoadRef.current) return;

    // Intersection Observer for viewport-based loading (more aggressive)
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !shouldLoadRef.current) {
            triggerLoad();
          }
        });
      },
      {
        threshold,
        rootMargin: `${Math.min(preloadDistance, 300)}px`, // Cap at 300px to avoid loading too early
      }
    );

    observerRef.current.observe(section);

    // Set up cursor tracking callback
    cursorCheckCallbackRef.current = triggerLoad;
    const sectionData = {
      element: section,
      callback: triggerLoad,
      preloadDistance,
    };

    trackedSections.add(sectionData);
    setupGlobalCursorTracking();

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      trackedSections.delete(sectionData);
      cursorCheckCallbackRef.current = null;
    };
  }, [shouldLoad, preloadDistance, threshold]);

  return (
    <div ref={sectionRef} className="w-full">
      {shouldLoad ? (
        <>{children}</>
      ) : (
        <>
          {isLoading && (
            <div className="w-full flex items-center justify-center py-8">
              <div className="animate-pulse text-white/50 text-sm">
                Loading...
              </div>
            </div>
          )}
          {fallback}
        </>
      )}
    </div>
  );
}
