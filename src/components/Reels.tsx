import { useRef } from 'react';
import { useReels } from '@/lib/hooks';
import YoutubeLazyPlayer from '@/components/YoutubeLazyPlayer';

interface Reel {
  id: string;
  youtubeUrl: string;
  videoId: string;
  title: string;
}


const ReelCard = ({ reel }: { reel: Reel }) => (
  <a
    href={reel.youtubeUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative block h-[320px] w-44 shrink-0 overflow-hidden rounded-2xl bg-black shadow-xl sm:h-[426px] sm:w-60 md:h-[455px] md:w-64 sm:rounded-3xl"
    style={{ margin: '0 6px' }}
  >
    {/* Phone-frame border */}
    <div className="absolute inset-0 rounded-3xl ring-2 ring-white/10 z-10 pointer-events-none" />

    {/* Poster loads first; muted autoplay embed when card enters view */}
    <YoutubeLazyPlayer videoId={reel.videoId} />

    {/* Hover overlay — click to open full video */}
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center z-20">
      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/90 text-white text-xs font-black px-3 py-1.5 rounded-full tracking-wide">
        Watch Full ↗
      </span>
    </div>
  </a>
);

const Reels = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const { data: reelsData } = useReels();

  // Map Supabase data to component format
  const reels: Reel[] = reelsData.map(r => ({
    id: r.id,
    youtubeUrl: r.youtube_url,
    videoId: r.video_id,
    title: r.title,
  }));

  // Duplicate reels for seamless infinite scroll
  const doubled = [...reels, ...reels, ...reels];

  return (
    <section id="portfolio" className="relative py-20 lg:pt-8 lg:pb-14 bg-background overflow-hidden">
      <div className="max-w-[95%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-4 md:px-6 mb-8 md:mb-12 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
          Our Work in Motion
        </h2>
        <p className="text-base md:text-lg text-muted-foreground font-medium">A glimpse of the stories, brands, and moments we’ve brought to life.</p>
      </div>

      <div className="relative w-full overflow-hidden flex flex-col gap-6">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--background), transparent)' }} />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--background), transparent)' }} />

        {/* Line 1 - Scrolling Left */}
        <div
          ref={trackRef}
          className="flex items-center"
          style={{
            width: 'max-content',
            animation: 'reels-marquee-left 45s linear infinite',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
          }}
        >
          {doubled.slice(0, Math.floor(doubled.length / 2)).map((reel, i) => (
            <ReelCard key={`top-${reel.id}-${i}`} reel={reel} />
          ))}
        </div>

        {/* Line 2 - Scrolling Right */}
        <div
          className="flex items-center"
          style={{
            width: 'max-content',
            animation: 'reels-marquee-right 40s linear infinite',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
          }}
        >
          {doubled.slice(Math.floor(doubled.length / 2)).map((reel, i) => (
            <ReelCard key={`bottom-${reel.id}-${i}`} reel={reel} />
          ))}
        </div>
      </div>

      {/* Marquee keyframe + hide scrollbar */}
      <style>{`
        @keyframes reels-marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(calc(-100% / 3)); }
        }
        @keyframes reels-marquee-right {
          0%   { transform: translateX(calc(-100% / 3)); }
          100% { transform: translateX(0); }
        }
        .reels-marquee-track::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default Reels;
