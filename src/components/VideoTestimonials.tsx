
import { cn } from "@/lib/utils";

// Define a type for our video cards
interface VideoCardProps {
  src: string;
  className?: string;
  rotation?: string;
}

// Reusable animated video card component
const VideoCard = ({ src, className, rotation = "rotate-0" }: VideoCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl md:rounded-3xl shadow-xl transition-all duration-500 ease-out border border-white/5 bg-black/40",
        "hover:scale-105 hover:rotate-0 hover:z-20",
        rotation,
        className
      )}
    >
      <video
        className="w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default function VideoTestimonials() {
  // Using placeholders. In production replace with actual testimonial video paths
  const dummyVid1 = "https://www.w3schools.com/html/mov_bbb.mp4";
  const dummyVid2 = "/media/mac-vid.mp4";
  const dummyVid3 = "/media/join-vid.mp4";

  return (
    <section id="testimonials" className="relative w-full py-16 md:py-24 overflow-hidden bg-transparent z-10 flex flex-col items-center">
      {/* Background radial gradient to assist with the theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a0a2e]/20 to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full max-w-[95%] md:max-w-[90%] mx-auto flex flex-col xl:flex-row items-center justify-between gap-8 md:gap-12 xl:gap-8">
        
        {/* Mobile/Tablet Text Block (Appears on top for < xl breakpoints) */}
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

        {/* LEFT VIDEO CLUSTER */}
        <div className="w-full xl:w-[35%] flex flex-wrap xl:flex-nowrap justify-center xl:justify-end gap-4 md:gap-6 lg:gap-8">
          {/* Column 1 */}
          <div className="flex flex-col gap-4 md:gap-6 mt-0 xl:-mt-12">
            <VideoCard
              src={dummyVid1}
              rotation="-rotate-2"
              className="w-32 h-40 sm:w-40 sm:h-48 md:w-48 md:h-56"
            />
            <VideoCard
              src={dummyVid2}
              rotation="rotate-1"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
            />
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-4 md:gap-6 mt-12 xl:mt-8">
            <VideoCard
              src={dummyVid3}
              rotation="rotate-3"
              className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64"
            />
            <VideoCard
              src={dummyVid1}
              rotation="-rotate-1"
              className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-48"
            />
          </div>
          {/* Column 3 (Hidden on mobile) */}
          <div className="hidden sm:flex flex-col gap-4 md:gap-6 mt-4 xl:-mt-4">
            <VideoCard
              src={dummyVid2}
              rotation="-rotate-3"
              className="w-40 h-32 md:w-48 md:h-40"
            />
            <VideoCard
              src={dummyVid3}
              rotation="rotate-2"
              className="w-40 h-48 md:w-48 md:h-56"
            />
          </div>
        </div>

        {/* DESKTOP TEXT BLOCK (Center) */}
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

        {/* RIGHT VIDEO CLUSTER */}
        <div className="w-full xl:w-[35%] flex flex-wrap xl:flex-nowrap justify-center xl:justify-start gap-4 md:gap-6 lg:gap-8">
          {/* Column 1 (Hidden on mobile) */}
          <div className="hidden sm:flex flex-col gap-4 md:gap-6 mt-8 xl:mt-4">
            <VideoCard
              src={dummyVid2}
              rotation="rotate-2"
              className="w-40 h-48 md:w-48 md:h-56"
            />
            <VideoCard
              src={dummyVid1}
              rotation="-rotate-2"
              className="w-40 h-32 md:w-48 md:h-40"
            />
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-4 md:gap-6 mt-4 xl:-mt-8">
            <VideoCard
              src={dummyVid3}
              rotation="-rotate-1"
              className="w-36 h-40 sm:w-44 sm:h-48 md:w-52 md:h-56"
            />
            <VideoCard
              src={dummyVid2}
              rotation="rotate-3"
              className="w-36 h-48 sm:w-44 sm:h-56 md:w-52 md:h-64"
            />
          </div>
          {/* Column 3 */}
          <div className="flex flex-col gap-4 md:gap-6 mt-16 xl:mt-12">
            <VideoCard
              src={dummyVid1}
              rotation="rotate-2"
              className="w-32 h-36 sm:w-40 sm:h-44 md:w-48 md:h-48"
            />
            <VideoCard
              src={dummyVid3}
              rotation="-rotate-3"
              className="w-32 h-44 sm:w-40 sm:h-52 md:w-48 md:h-60"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
