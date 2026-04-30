import { useEffect, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTestimonials, extractYoutubeVideoId } from "@/lib/hooks";
import YoutubeLazyPlayer from "@/components/YoutubeLazyPlayer";

const FALLBACK_MP4_SOURCES = [
  "https://www.w3schools.com/html/mov_bbb.mp4",
  "/media/mac-vid.mp4",
  "/media/join-vid.mp4",
];

const SLOT_LAYOUT: { rotation: string; className: string }[] = [
  { rotation: "-rotate-2", className: "w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56" },
  { rotation: "rotate-1", className: "w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48" },
  { rotation: "rotate-3", className: "w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64" },
  { rotation: "-rotate-1", className: "w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-48" },
  { rotation: "-rotate-3", className: "w-40 h-32 md:w-48 md:h-40" },
  { rotation: "rotate-2", className: "w-40 h-48 md:w-48 md:h-56" },
  { rotation: "rotate-2", className: "w-40 h-48 md:w-48 md:h-56" },
  { rotation: "-rotate-2", className: "w-40 h-32 md:w-48 md:h-40" },
  { rotation: "-rotate-1", className: "w-36 h-40 sm:w-44 sm:h-48 md:w-52 md:h-56" },
  { rotation: "rotate-3", className: "w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64" },
  { rotation: "rotate-2", className: "w-32 h-36 sm:w-40 sm:h-44 md:w-48 md:h-48" },
  { rotation: "-rotate-3", className: "w-32 h-44 sm:w-40 sm:h-52 md:w-48 md:h-60" },
];

function isDirectVideoFileUrl(url: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url) || /^\/[^?]+\.(mp4|webm|ogg)/i.test(url);
}

function LazyMp4Player({ url }: { url: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = wrapRef.current;
    const v = videoRef.current;
    if (!root || !v) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        if (e.isIntersecting) void v.play();
        else v.pause();
      },
      { threshold: 0.12, rootMargin: "100px 0px" }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={url} />
      </video>
    </div>
  );
}

function ClipPlayer({ url }: { url: string }) {
  const ytId = extractYoutubeVideoId(url);

  if (ytId) {
    return (
      <img
        src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
        alt="Testimonial video thumbnail"
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
    );
  }

  if (isDirectVideoFileUrl(url)) {
    return <LazyMp4Player url={url} />;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="absolute inset-0 flex items-center justify-center bg-black/70 p-3 text-center text-xs font-semibold text-purple-300 underline"
    >
      Open video ↗
    </a>
  );
}

/** Uniform grid tiles on small screens — widths come from grid, not fixed w-32/w-40 tokens. */
function mobileBandCardClass() {
  return "w-full aspect-[10/13] h-full !max-w-none";
}

function VideoClipCard({
  url,
  className,
  rotation = "rotate-0",
}: {
  url: string;
  className?: string;
  rotation?: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl transition-all duration-500 ease-out border border-white/5 bg-black/40 block",
        "hover:scale-105 hover:rotate-0 hover:z-20",
        rotation,
        className
      )}
      aria-label="Open testimonial video in new tab"
    >
      <ClipPlayer url={url} />
      <div className="pointer-events-none absolute inset-0 z-[2] opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/25" />
    </a>
  );
}

export default function VideoTestimonials() {
  const { data: testimonials } = useTestimonials();

  /** Up to 10 dashboard video URLs, same order as Testimonials Manager */
  const dashboardSources = useMemo(() => {
    return testimonials
      .filter((t) => t.video_url?.trim())
      .sort((a, b) => a.display_order - b.display_order)
      .slice(0, 10)
      .map((t) => t.video_url!.trim());
  }, [testimonials]);

  const sources =
    dashboardSources.length > 0 ? dashboardSources : FALLBACK_MP4_SOURCES;

  const urlAt = (i: number) => sources[i % sources.length];

  return (
    <section className="relative w-full pt-8 pb-16 sm:pt-6 md:pt-10 md:pb-24 xl:pt-16 xl:pb-24 overflow-hidden bg-transparent z-10 flex flex-col items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0a2e]/20 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-[95%] md:max-w-[90%] mx-auto">
        {/* Tablet / mobile: all copy first, then all videos (desktop keeps 3-column layout below) */}
        <div className="xl:hidden flex flex-col items-center gap-6 md:gap-8 w-full mt-0">
          {/* Copy block */}
          <span className="px-6 py-2.5 rounded-full bg-primary text-white text-base font-bold border border-primary/60 shadow-md backdrop-blur-sm">
            Testimonials
          </span>
          <div className="my-1 flex flex-col items-center text-center px-2">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-1">
              Trusted by Brands,
            </h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white/50 tracking-tight leading-tight mb-2">
              Creators & Businesses
            </h3>
            <p className="text-sm sm:text-base text-white/60 max-w-md mx-auto text-center font-medium">
              Hear from the clients who trusted us with their stories.
            </p>
          </div>

          {/* Videos block: all 8 videos below copy */}
          <div className="mt-3 grid w-full grid-cols-2 gap-x-3 gap-y-4 sm:gap-x-4 sm:gap-y-5 max-w-sm mx-auto">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((slotIdx) => {
              const slot = SLOT_LAYOUT[slotIdx];
              return (
                <VideoClipCard
                  key={`mob-all-${slotIdx}`}
                  url={urlAt(slotIdx)}
                  rotation={slot.rotation}
                  className={mobileBandCardClass()}
                />
              );
            })}
          </div>
        </div>

        {/* Desktop: left clips | center copy | right clips */}
        <div className="hidden xl:flex flex-row items-center justify-between gap-8 md:gap-12 xl:gap-8 w-full mt-16 xl:mt-0">
        {/* LEFT cluster */}
        <div className="w-full xl:w-[35%] flex flex-wrap xl:flex-nowrap justify-center xl:justify-end gap-4 md:gap-6 lg:gap-8">
          <div className="flex flex-col gap-4 md:gap-6 mt-0 xl:-mt-12">
            {SLOT_LAYOUT.slice(0, 2).map((slot, i) => (
              <VideoClipCard
                key={`left-a-${i}`}
                url={sources[i % sources.length]}
                rotation={slot.rotation}
                className={slot.className}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4 md:gap-6 mt-12 xl:mt-8">
            {SLOT_LAYOUT.slice(2, 4).map((slot, i) => (
              <VideoClipCard
                key={`left-b-${i}`}
                url={sources[(i + 2) % sources.length]}
                rotation={slot.rotation}
                className={slot.className}
              />
            ))}
          </div>
          <div className="hidden sm:flex flex-col gap-4 md:gap-6 mt-4 xl:-mt-4">
            {SLOT_LAYOUT.slice(4, 6).map((slot, i) => (
              <VideoClipCard
                key={`left-c-${i}`}
                url={sources[(i + 4) % sources.length]}
                rotation={slot.rotation}
                className={slot.className}
              />
            ))}
          </div>
        </div>

        {/* Desktop center copy */}
        <div className="flex flex-col items-center text-center w-[30%] z-10 px-4">
          <span className="px-7 py-3 rounded-full bg-primary text-white text-base font-bold mb-8 border border-primary/60 shadow-lg backdrop-blur-md transition-transform hover:scale-105">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 leading-none">
            Trusted by Brands,
          </h2>
          <h3 className="text-4xl lg:text-5xl font-bold text-white/50 tracking-tight mb-8 leading-none">
            Creators & Businesses
          </h3>
          <p className="text-lg text-white/60 max-w-sm mx-auto font-medium leading-relaxed">
            Hear from the clients who trusted us with their stories.
          </p>
        </div>

        {/* RIGHT cluster */}
        <div className="w-full xl:w-[35%] flex flex-wrap xl:flex-nowrap justify-center xl:justify-start gap-4 md:gap-6 lg:gap-8">
          <div className="hidden sm:flex flex-col gap-4 md:gap-6 mt-8 xl:mt-4">
            {SLOT_LAYOUT.slice(6, 8).map((slot, i) => (
              <VideoClipCard
                key={`right-a-${i}`}
                url={sources[(i + 6) % sources.length]}
                rotation={slot.rotation}
                className={slot.className}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4 md:gap-6 mt-4 xl:-mt-8">
            {SLOT_LAYOUT.slice(8, 10).map((slot, i) => (
              <VideoClipCard
                key={`right-b-${i}`}
                url={sources[(i + 8) % sources.length]}
                rotation={slot.rotation}
                className={slot.className}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4 md:gap-6 mt-16 xl:mt-12">
            {SLOT_LAYOUT.slice(10, 12).map((slot, i) => (
              <VideoClipCard
                key={`right-c-${i}`}
                url={sources[(i + 10) % sources.length]}
                rotation={slot.rotation}
                className={slot.className}
              />
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
