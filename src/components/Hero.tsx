import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Stack from "./Stack";
import LightRays from "./LightRays";
import ShinyText from "./ShinyText";
import TextPressure from "./TextPressure";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSpread, setIsSpread] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Defer hero visibility and LightRays to reduce initial load
  useEffect(() => {
    // Small delay to allow other critical content to load first
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
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

  // Memoize card calculations - updated for centered hover spacing
  const cardCalculations = useMemo(() => {
    const cardWidth = 208; // w-52 = 208px
    const totalCards = images.length;
    // Spacing offset set to card width + 16px gap
    const spacingOffset = cardWidth + 16; 
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
      className="relative bg-transparent overflow-x-hidden"
      style={{ paddingBottom: "4rem" }}
    >
      {/* LightRays Background - Deferred to reduce initial load */}
      {isVisible && (
        <LightRays
          raysOrigin="top-center"
          raysColor="#a855f7"
          raysSpeed={1.5}
          lightSpread={1.5}
          rayLength={1.2}
          pulsating={false}
          fadeDistance={1.6}
          saturation={1}
          followMouse={true}
          mouseInfluence={0.25}
          noiseAmount={0.05}
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
              <div className="w-full">
                <TextPressure
                  text="We CAPTURE what Matters."
                  flex={true}
                  alpha={false}
                  stroke={false}
                  width={true}
                  weight={true}
                  italic={true}
                  textColor="currentColor"
                  className="text-foreground"
                  minFontSize={20}
                />
              </div>
            </div>

            {/* Shiny Subtitle */}
            <div className="mb-8">
              <ShinyText
                text="End-to-end production, from concept to final edit."
                speed={3}
                className="text-base md:text-lg lg:text-xl text-white dark:text-white font-medium"
              />
            </div>

            {/* Image Gallery - Mobile Stack / Desktop Fanned Gallery */}
            <div className="relative w-full mb-12 mt-8">
              {/* Mobile Stack Component */}
              <div className="lg:hidden flex justify-center mb-8">
                <Stack
                  cardDimensions={{ width: 220, height: 220 }}
                  cardsData={images.map((img) => ({
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
                  className="relative h-[450px] w-full max-w-[1800px] flex items-center justify-center group mx-auto -mt-8"
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
                        className="w-52 h-72 rounded-3xl flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white/50 bg-transparent backdrop-blur-md p-1"
                      >
                        {image.link ? (
                          <a href={image.link} target="_blank" rel="noopener noreferrer" className="block w-full h-full cursor-pointer pointer-events-auto">
                            <img
                              src={image.src}
                              alt={image.alt}
                              width={208}
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
                            width={208}
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

                {/* Left Side Card - Positioned at circle location */}
                 <div
                  className="hidden 2xl:block absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-500 w-80 h-[220px] hover:scale-105 hover:shadow-2xl"
                  style={{
                    filter: isImageHovered ? "blur(4px)" : "none",
                    zIndex: isImageHovered ? 5 : 15,
                  }}
                >
                  <div className="relative drop-shadow-xl w-full h-full overflow-hidden rounded-3xl bg-primary/10 border border-primary/20 backdrop-blur-md">
                    <div className="relative flex flex-col items-center justify-center text-foreground z-[1] rounded-3xl p-6 h-full">
                      <h3 className="text-xl font-extrabold text-primary mb-3 text-center">
                        Award-Winning Productions
                      </h3>
                      <p className="text-muted-foreground text-sm text-center font-medium">
                        From concept to final cut — we deliver cinematic experiences that leave a lasting impression.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side Card - Positioned at circle location */}
                <div
                  className="hidden 2xl:block absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-500 w-80 h-[220px] hover:scale-105 hover:shadow-2xl"
                  style={{
                    filter: isImageHovered ? "blur(4px)" : "none",
                    zIndex: isImageHovered ? 5 : 15,
                  }}
                >
                  <div className="relative drop-shadow-xl w-full h-full overflow-hidden rounded-3xl bg-primary/10 border border-primary/20 backdrop-blur-md">
                    <div className="relative flex flex-col items-center justify-center text-foreground z-[1] rounded-3xl p-6 h-full">
                      <h3 className="text-xl font-extrabold text-primary mb-3 text-center">
                        End-to-End Creative Solutions
                      </h3>
                      <p className="text-muted-foreground text-sm text-center font-medium">
                        Photography, videography, post-production & brand content — all under one roof.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
}
