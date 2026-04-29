
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useTestimonials, extractYoutubeVideoId } from "@/lib/hooks";

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

function youtubeEmbedSrc(videoId: string) {
  const q = new URLSearchParams({
    autoplay: '1',
    mute: '1',
    loop: '1',
    playlist: videoId,
    controls: '0',
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    iv_load_policy: '3',
    cc_load_policy: '0',
    fs: '0',
    disablekb: '1',
  });
  if (typeof window !== 'undefined' && window.location?.origin) {
    q.set('origin', window.location.origin);
  }
  // nocookie embed + max params to strip UI; top/bottom cropped in wrapper (YouTube draws some chrome in-frame)
  return `https://www.youtube-nocookie.com/embed/${videoId}?${q.toString()}`;
}

/** Fills parent; scales/crops iframe edges to hide typical Shorts title/channel bar + bottom watermark */
function YoutubePreviewOnly({ videoId }: { videoId: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <iframe
        src={youtubeEmbedSrc(videoId)}
        title="Testimonial preview"
        aria-label="Testimonial video preview"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="pointer-events-none border-0 absolute left-1/2 top-[52%] min-h-[132%] min-w-[132%] w-[132%] max-w-none -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

function ClipPlayer({ url }: { url: string }) {
  const ytId = extractYoutubeVideoId(url);

  if (ytId) {
    return <YoutubePreviewOnly videoId={ytId} />;
  }

  if (isDirectVideoFileUrl(url)) {
    return (
      <video className="w-full h-full object-cover" autoPlay muted loop playsInline>
        <source src={url} />
      </video>
    );
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
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl transition-all duration-500 ease-out border border-white/5 bg-black/40",
        "hover:scale-105 hover:rotate-0 hover:z-20",
        rotation,
        className
      )}
    >
      <ClipPlayer url={url} />
    </div>
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

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-transparent z-10 flex flex-col items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0a2e]/20 to-transparent pointer-events-none" />

      <div className="relative w-full max-w-[95%] md:max-w-[90%] mx-auto flex flex-col xl:flex-row items-center justify-between gap-8 md:gap-12 xl:gap-8">
        {/* Mobile / tablet heading */}
        <div className="xl:hidden flex flex-col items-center text-center mt-8">
          <span className="px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-6 border border-white/10 shadow-sm backdrop-blur-sm">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-2">
            Trusted by Brands,
          </h2>
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white/50 tracking-tight mb-6 md:mb-8">
            Creators & Businesses
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-md mx-auto font-medium">
            Hear from the clients who trusted us with their stories.
          </p>
        </div>

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
        <div className="hidden xl:flex flex-col items-center text-center w-[30%] z-10 px-4">
          <span className="px-5 py-2 rounded-full bg-white/10 text-white/90 text-sm font-bold mb-8 border border-white/10 shadow-lg backdrop-blur-md transition-transform hover:scale-105">
            Testimonials
          </span>
          <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight mb-2 leading-none">
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
    </section>
  );
}
