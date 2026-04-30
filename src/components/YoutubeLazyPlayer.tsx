import { useEffect, useRef, useState } from "react";

function embedSrc(videoId: string) {
  const q = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: videoId,
    controls: "0",
    modestbranding: "1",
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
    cc_load_policy: "0",
    fs: "0",
    disablekb: "1",
  });
  if (typeof window !== "undefined" && window.location?.origin) {
    q.set("origin", window.location.origin);
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${q.toString()}`;
}

function thumbUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
}

type Props = { videoId: string };

/**
 * Fast poster (JPEG) first; when the card nears the viewport, mount a muted autoplay embed.
 * pointer-events-none on iframe so parent links still work.
 */
export default function YoutubeLazyPlayer({ videoId }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e?.isIntersecting) return;
        setShowEmbed(true);
        io.unobserve(root);
        io.disconnect();
      },
      { root: null, rootMargin: "120px 0px 160px", threshold: 0.08 }
    );

    io.observe(root);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="absolute inset-0 overflow-hidden bg-black">
      <img
        src={thumbUrl(videoId)}
        alt=""
        className={
          showEmbed
            ? "absolute inset-0 z-0 h-full w-full object-contain md:object-cover opacity-0"
            : "absolute inset-0 z-0 h-full w-full object-contain md:object-cover"
        }
        loading="lazy"
        decoding="async"
        fetchPriority="low"
      />
      {showEmbed && (
        <iframe
          title="Video preview"
          src={embedSrc(videoId)}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] origin-center max-w-none -translate-x-1/2 -translate-y-1/2 border-0
            max-md:h-[115%] max-md:w-[115%] max-md:min-h-[115%] max-md:min-w-[115%]
            md:top-[52%] md:h-auto md:w-[132%] md:min-h-[132%] md:min-w-[132%]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      )}
    </div>
  );
}
