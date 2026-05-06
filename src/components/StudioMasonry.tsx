import { useState, useEffect } from 'react';
import { useStudioPhotos } from '@/lib/hooks';
import Masonry, { MasonryItem } from './ui/Masonry';

export default function StudioMasonry() {
  const { data: studioPhotos } = useStudioPhotos();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check initially
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const displayedPhotos = isMobile ? studioPhotos.slice(0, 9) : studioPhotos;

  const masonryItems: MasonryItem[] = displayedPhotos.map(p => ({
    id: p.id,
    img: p.image_url,
    url: '#',
    height: p.height,
  }));

  return (
    <section className="relative w-full pt-1 pb-1 md:py-20 lg:pt-2 lg:pb-4 px-3 sm:px-4 md:px-8 bg-transparent overflow-hidden">
      <div className="text-center mb-3 md:mb-16 lg:mb-6 relative z-10 px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
          Glimpse into our Studio
        </h2>
      </div>

      <div className="max-w-[95%] md:max-w-[1400px] mx-auto min-h-[400px] md:min-h-[600px]">
        <Masonry
          items={masonryItems}
          animateFrom="random"
          stagger={0.03}
          scaleOnHover={true}
          hoverScale={0.98}
          blurToFocus={true}
        />
      </div>
    </section>
  );
}
