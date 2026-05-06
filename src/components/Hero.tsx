import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Stack from "./Stack";
import LightRays from "./LightRays";
import ShinyText from "./ShinyText";
import TextPressure from "./TextPressure";
import { useClientConfig } from "@/lib/client-config";

export default function Hero() {
  const { config } = useClientConfig();
  const [isVisible, setIsVisible] = useState(false);
  const [isSpread, setIsSpread] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingText = isMobile ? "WE CAPTURE WHAT MATTERS." : "We CAPTURE what Matters.";

  // Defer hero visibility and LightRays to reduce initial load
  useEffect(() => {
    // Small delay to allow other critical content to load first
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateDevice = () => setIsMobile(window.innerWidth < 1024);
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  const images = [
    {
      id: 1,
      src: "/media/hero-opt/1.png",
      alt: "Video Production",
      rotation: -12,
      zIndex: 1,
      translateX: -60,
      translateY: 15,
      link: "https://www.youtube.com/@FounderGyaan",
    },
    {
      id: 2,
      src: "/media/hero-opt/2.png",
      alt: "Photography",
      rotation: -6,
      zIndex: 2,
      translateX: -35,
      translateY: 8,
      link: "https://www.instagram.com/crowneplazamayurvihar/",
    },
    {
      id: 3,
      src: "/media/hero-opt/3.png",
      alt: "Audio Recording",
      rotation: 0,
      zIndex: 3,
      translateX: -10,
      translateY: 0,
      link: "https://drive.google.com/drive/folders/1XIHrb8xEgduqRUSBBLcaeuR3aji0BQkp",
    },
    {
      id: 4,
      src: "/media/hero-opt/4.png",
      alt: "Post-Production",
      rotation: 6,
      zIndex: 4,
      translateX: 15,
      translateY: -8,
      link: "https://drive.google.com/drive/folders/1xUnCVia7I37FZWHN8JfjDGPu4Dgn7tax?usp=sharing",
    },
    {
      id: 5,
      src: "/media/hero-opt/5.png",
      alt: "Creative Direction",
      rotation: 12,
      zIndex: 5,
      translateX: 40,
      translateY: -15,
      link: "https://www.instagram.com/theakshayguptaeffect/",
    },
    {
      id: 6,
      src: "/media/hero-opt/6.png",
      alt: "Studio Mixed Services",
      rotation: 18,
      zIndex: 6,
      translateX: 65,
      translateY: -22,
    },
  ];

  // Memoize card calculations - tuned for desktop viewport fit
  const cardCalculations = useMemo(() => {
    const cardWidth = 192; // desktop card footprint
    const totalCards = images.length;
    const spacingOffset = 198;
    const totalWidth = (totalCards - 1) * spacingOffset;
    const startX = -totalWidth / 2; // Center properly

    return images.map((image, index) => ({
      ...image,
      spreadX: startX + index * spacingOffset,
    }));
  }, [images]);

  const spreadCards = useCallback(() => {
    const cards = containerRef.current?.querySelectorAll(".hero-card");
    if (!cards) return;

    cards.forEach((card, index) => {
      const calc = cardCalculations[index];
      if (calc) {
        (
          card as HTMLElement
        ).style.transform = `rotate(0deg) translate(${calc.spreadX}px, 0px)`;
      }
    });
    setIsSpread(true);
  }, [cardCalculations]);

  const resetCards = useCallback(() => {
    const cards = containerRef.current?.querySelectorAll(".hero-card");
    if (!cards) return;

    cards.forEach((card, index) => {
      const image = images[index];
      if (image) {
        (
          card as HTMLElement
        ).style.transform = `rotate(${image.rotation}deg) translate(${image.translateX}px, ${image.translateY}px)`;
      }
    });
    setIsSpread(false);
  }, [images]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isSpread) {
          spreadCards();
        }
      }, 100); // Throttle resize events
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, [isSpread, spreadCards]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Use native smooth scrolling or Lenis if available
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      className="relative bg-transparent overflow-x-hidden pb-8 md:pb-14 lg:pb-16"
    >
      {/* LightRays Background - Deferred to reduce initial load */}
      {isVisible && (
        <LightRays
          raysOrigin="top-center"
          raysColor="#a855f7"
          raysSpeed={isMobile ? 1.9 : 1.5}
          lightSpread={isMobile ? 2.4 : 1.7}
          rayLength={isMobile ? 2.0 : 1.35}
          pulsating={false}
          fadeDistance={isMobile ? 2.4 : 1.6}
          saturation={isMobile ? 1.15 : 1.05}
          followMouse={!isMobile}
          mouseInfluence={isMobile ? 0 : 0.25}
          noiseAmount={isMobile ? 0.04 : 0.05}
          distortion={0}
          className="z-0"
        />
      )}

      <div className="relative z-10 w-full max-w-[95%] md:max-w-[85%] lg:max-w-[80%] mx-auto px-4 md:px-6 pt-20 md:pt-16 pb-8">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Hero Content */}
          <div className="h-full flex flex-col items-center justify-center text-center pt-10">
            {/* Main Heading in 2 Lines */}
            <div className="w-full md:w-[85%] mx-auto mt-6 md:mt-12 lg:mt-16 mb-4 flex flex-col items-center">
              <div className="w-full px-2 sm:px-0">
                <TextPressure
                  text={headingText}
                  flex={!isMobile}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={true}
                  textColor="currentColor"
                  className="text-foreground whitespace-nowrap"
                  minFontSize={isMobile ? 12 : 20}
                />
              </div>
            </div>

            {/* Shiny Subtitle */}
            <div className="mb-8">
              {isMobile ? (
                <p className="text-base md:text-lg lg:text-xl text-white dark:text-white font-medium">
                  {config.heroSubtitle || "End-to-end production, from concept to final edit."}
                </p>
              ) : (
                <ShinyText
                  text={config.heroSubtitle || "End-to-end production, from concept to final edit."}
                  speed={3}
                  className="text-base md:text-lg lg:text-xl text-white dark:text-white font-medium"
                />
              )}
            </div>

            {/* Image Gallery - Mobile Stack / Desktop Fanned Gallery */}
            <div className="relative w-full mb-12 mt-8">
              {/* Mobile Stack Component */}
              <div className="lg:hidden flex justify-center mb-8">
                <Stack
                  cardDimensions={{ width: 270, height: 270 }}
                  cardsData={images.slice(0, 4).map((img) => ({
                    id: img.id,
                    img: img.src,
                    link: img.link,
                  }))}
                  randomRotation={true}
                  sensitivity={150}
                  sendToBackOnClick={true}
                />
              </div>

              {/* Desktop Fanned Image Gallery Container */}
              <div className="hidden lg:block relative w-full">
                <div
                  ref={containerRef}
                  className="relative h-[440px] w-full max-w-[1600px] flex items-center justify-center group mx-auto -mt-8"
                  style={{
                    zIndex: isImageHovered ? 20 : 10,
                  }}
                  onMouseEnter={() => {
                    spreadCards();
                    setIsImageHovered(true);
                  }}
                  onMouseLeave={() => {
                    resetCards();
                    setIsImageHovered(false);
                  }}
                >
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="hero-card absolute group cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                      style={{
                        transform: `rotate(${image.rotation}deg) translate(${image.translateX}px, ${image.translateY}px)`,
                        zIndex: image.zIndex,
                        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    >
                      {/* Image Container */}
                      <div
                        className="w-48 h-72 xl:w-52 xl:h-80 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white/50 bg-transparent backdrop-blur-md p-1"
                      >
                        {image.link ? (
                          <a href={image.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer pointer-events-auto">
                            <img
                              src={image.src}
                              alt={image.alt}
                              width={192}
                              height={288}
                              className={`w-full h-full rounded-2xl transition-transform duration-300 object-cover bg-transparent pointer-events-none`}
                              loading={image.id <= 2 ? "eager" : "lazy"}
                              decoding={image.id <= 2 ? "sync" : "async"}
                              fetchPriority={image.id === 2 ? "high" : "auto"}
                            />
                          </a>
                        ) : (
                          <img
                            src={image.src}
                            alt={image.alt}
                            width={192}
                            height={288}
                            className={`w-full h-full rounded-2xl transition-transform duration-300 object-cover bg-transparent pointer-events-none`}
                            loading={image.id <= 2 ? "eager" : "lazy"}
                            decoding={image.id <= 2 ? "sync" : "async"}
                            fetchPriority={image.id === 2 ? "high" : "auto"}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}
