import { Suspense, lazy } from "react";
import Hero from "../components/Hero";
import LazySection from "../components/LazySection";
import { usePartnerLogos } from "@/lib/hooks";

// Trigger HMR update to clear stale MacBook cache

// Lazy load heavy components for code splitting
const ContainerScrollDemo = lazy(() => import("../components/ContainerScrollDemo"));
const LogoLoop = lazy(() => import("../components/LogoLoop"));
const Services = lazy(() => import("../components/Services"));
const Reels = lazy(() => import("../components/Reels"));
const AboutUs = lazy(() => import("../components/AboutUs"));
const Team = lazy(() => import("../components/Team"));
const VideoTestimonials = lazy(() => import("../components/VideoTestimonials"));

const CurvedLoop = lazy(() => import("../components/CurvedLoop"));
const StudioMasonry = lazy(() => import("../components/StudioMasonry"));
const Footer = lazy(() => import("../components/Footer"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="w-full flex items-center justify-center py-12">
    <div className="animate-pulse text-muted-foreground text-sm font-medium">Loading...</div>
  </div>
);






function Home() {
  const { data: partnerLogos } = usePartnerLogos();
  const studioLogos = partnerLogos.map(l => ({ src: l.image_url, alt: l.name }));

  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      <div className="relative z-10">
        {/* Hero — studio intro */}
        <Hero />

        {/* Showreel — MacBook video */}
        <div id="showreel" className="relative z-20">
          <LazySection preloadDistance={300} threshold={0.1}>
            <Suspense fallback={<LoadingFallback />}>
              <ContainerScrollDemo />
            </Suspense>
          </LazySection>
        </div>

        {/* Partners Marquee — Logo Loop */}
        <section className="py-6 sm:py-10 md:py-14 relative z-10 overflow-hidden">
          <LazySection preloadDistance={300} threshold={0.1}>
            <div className="max-w-[95%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-4 md:px-6 mb-6 md:mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-0">
                Brands that Trust us
              </h2>
            </div>
            <Suspense fallback={<LoadingFallback />}>
              <LogoLoop
                logos={studioLogos}
                speed={50}
                direction="left"
                logoHeight={160}
                gap={24}
                fadeOut
                fadeOutColor="#0d0d0d"
                pauseOnHover
                ariaLabel="Companies we worked with"
                className="opacity-90 hover:opacity-100 transition-opacity duration-500"
                cleanLogos={true}
              />
            </Suspense>
          </LazySection>
        </section>

        {/* Services */}
        <div id="services" className="relative z-20">
          <LazySection preloadDistance={400} threshold={0.15}>
            <Suspense fallback={<LoadingFallback />}>
              <Services />
            </Suspense>
          </LazySection>
        </div>

        {/* Curved marquee between Services and Reels */}
        <LazySection preloadDistance={300} threshold={0.1}>
          <Suspense fallback={<LoadingFallback />}>
            <div className="py-6 md:py-10 px-4 md:px-6">
              <CurvedLoop marqueeText={"SINCE 2019 | 100+ BRANDS SERVED | 5000+ VIDEOS DELIVERED"} speed={3.0} curveAmount={180} direction="left" />
            </div>
          </Suspense>
        </LazySection>

        {/* Studio Showcase — Masonry Gallery */}
        <div id="studio">
          <LazySection preloadDistance={400} threshold={0.15}>
            <Suspense fallback={<LoadingFallback />}>
              <StudioMasonry />
            </Suspense>
          </LazySection>
        </div>

        {/* Studio Reels */}
        <div id="portfolio">
          <LazySection preloadDistance={400} threshold={0.15}>
            <Suspense fallback={<LoadingFallback />}>
              <Reels />
            </Suspense>
          </LazySection>
        </div>

        {/* About Us */}
        <div id="about">
          <LazySection preloadDistance={400} threshold={0.15}>
            <Suspense fallback={<LoadingFallback />}>
              <AboutUs />
            </Suspense>
          </LazySection>
        </div>

        {/* Our Team */}
        <LazySection preloadDistance={400} threshold={0.15}>
          <Suspense fallback={<LoadingFallback />}>
            <Team />
          </Suspense>
        </LazySection>

        {/* Testimonials */}
        <div id="testimonials">
          <LazySection preloadDistance={400} threshold={0.15}>
            <Suspense fallback={<LoadingFallback />}>
              <VideoTestimonials />
            </Suspense>
          </LazySection>
        </div>

        {/* Behind the Scenes (removed) */}

        {/* Footer */}
        <LazySection preloadDistance={300} threshold={0.2}>
          <Suspense fallback={<LoadingFallback />}>
            <div className="mb-8">
              <Footer />
            </div>
          </Suspense>
        </LazySection>
      </div>
    </div>
  );
}

export default Home;
