import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// ─── Gallery Photos ───
export interface GalleryPhoto {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

const defaultGalleryPhotos = [
  { id: '1', image_url: '/media/curved-images/akashh.webp', caption: 'pepsodent saab', display_order: 0 },
  { id: '2', image_url: '/media/curved-images/gaurav.webp', caption: 'vice pepsodent saab', display_order: 1 },
  { id: '3', image_url: '/media/curved-images/bca-syncup.webp', caption: 'BCA Sync Up', display_order: 2 },
  { id: '4', image_url: '/media/curved-images/bcaa.webp', caption: 'BCA Team', display_order: 3 },
  { id: '5', image_url: '/media/curved-images/cb-syncup.webp', caption: 'CB Sync Up', display_order: 4 },
  { id: '6', image_url: '/media/curved-images/groupp.webp', caption: 'Group Photo', display_order: 5 },
  { id: '7', image_url: '/media/curved-images/himanshi-syncup.webp', caption: 'Himanshi Sync Up', display_order: 6 },
  { id: '8', image_url: '/media/curved-images/hiya-sak.webp', caption: 'Hiya & Saksham', display_order: 7 },
  { id: '9', image_url: '/media/curved-images/hiyaa.webp', caption: 'Hiya', display_order: 8 },
  { id: '10', image_url: '/media/curved-images/sak-price.webp', caption: 'Saksham', display_order: 9 },
  { id: '11', image_url: '/media/curved-images/svee-syncup.webp', caption: 'Svee Sync Up', display_order: 10 },
  { id: '12', image_url: '/media/curved-images/trinity.webp', caption: 'Trinity', display_order: 11 },
];

export function useGalleryPhotos() {
  const [data, setData] = useState<GalleryPhoto[]>(defaultGalleryPhotos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const { data: photos, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      if (photos && photos.length > 0) setData(photos);
    } catch {
      console.warn('Using default gallery photos');
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, refetch: fetchPhotos };
}

// ─── Testimonials ───
export interface Testimonial {
  id: string;
  client_name: string;
  company: string;
  quote: string;
  image_url: string;
  video_url?: string;
  rating: number;
  display_order: number;
}

const VIDEO_QUOTE_TOKEN_REGEX = /\[\[video_url:(.*?)\]\]/;

function extractVideoFromQuote(quote: string) {
  const match = quote.match(VIDEO_QUOTE_TOKEN_REGEX);
  const videoUrl = match?.[1]?.trim() || '';
  const cleanQuote = quote.replace(VIDEO_QUOTE_TOKEN_REGEX, '').trim();
  return { cleanQuote, videoUrl };
}

/** YouTube ID from shorts, watch, embed, or youtu.be URL — for embeds on the site */
export function extractYoutubeVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/shorts\/([^?&/]+)/,
    /youtu\.be\/([^?&/]+)/,
    /youtube\.com\/watch\?v=([^?&/]+)/,
    /youtube\.com\/embed\/([^?&/]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

const defaultTestimonials: Testimonial[] = [
  { id: '1', client_name: 'Sarah Mitchell', company: 'Luxe Fashion Co.', quote: 'Endurance Image transformed our brand campaign into something truly cinematic. The attention to detail and creative vision exceeded all expectations.', image_url: '/media/MagicBento/Akash.webp', rating: 5, display_order: 0 },
  { id: '2', client_name: 'James Rivera', company: 'TechVault Inc.', quote: 'Their product photography doubled our conversion rate. The team understands how to make every shot sell.', image_url: '/media/MagicBento/Gaurav.webp', rating: 5, display_order: 1 },
  { id: '3', client_name: 'Priya Kapoor', company: 'Bloom Events', quote: 'The live event coverage was seamless. Same-day edits that blew our audience away!', image_url: '/media/MagicBento/Dev.webp', rating: 5, display_order: 2 },
  { id: '4', client_name: 'Alex Chen', company: 'Horizon Startups', quote: 'From our pitch video to social media content — Endurance is our go-to creative partner.', image_url: '/media/MagicBento/Sara.webp', rating: 5, display_order: 3 },
  { id: '5', client_name: 'Daniel Okafor', company: 'Pulse Records', quote: 'The music video they produced for us was a visual masterpiece. Truly world-class.', image_url: '/media/MagicBento/Yash.webp', rating: 5, display_order: 4 },
];

export function useTestimonials() {
  const [data, setData] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    try {
      const { data: testimonials, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      if (testimonials && testimonials.length > 0) {
        const normalizedTestimonials = testimonials.map((testimonial) => {
          const { cleanQuote, videoUrl } = extractVideoFromQuote(testimonial.quote || '');
          return {
            ...testimonial,
            quote: cleanQuote,
            video_url: testimonial.video_url || videoUrl || '',
          };
        });
        setData(normalizedTestimonials);
      }
    } catch {
      console.warn('Using default testimonials');
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, refetch: fetchTestimonials };
}

// ─── Reels ───
export interface ReelData {
  id: string;
  youtube_url: string;
  video_id: string;
  title: string;
  display_order: number;
}

const defaultReels: ReelData[] = [
  { id: '1', youtube_url: 'https://youtube.com/shorts/izLpuW4-LGw', video_id: 'izLpuW4-LGw', title: 'Event 1', display_order: 0 },
  { id: '2', youtube_url: 'https://youtube.com/shorts/_IXqxwfr0Ng', video_id: '_IXqxwfr0Ng', title: 'Event 2', display_order: 1 },
  { id: '3', youtube_url: 'https://youtube.com/shorts/cAlOhnobNac', video_id: 'cAlOhnobNac', title: 'Event 3', display_order: 2 },
  { id: '4', youtube_url: 'https://youtube.com/shorts/z308WDBflx0', video_id: 'z308WDBflx0', title: 'Event 4', display_order: 3 },
  { id: '5', youtube_url: 'https://youtube.com/shorts/UgRM0AwjLss', video_id: 'UgRM0AwjLss', title: 'Event 5', display_order: 4 },
  { id: '6', youtube_url: 'https://youtube.com/shorts/-s3NN8ze6kM', video_id: '-s3NN8ze6kM', title: 'Event 6', display_order: 5 },
  { id: '7', youtube_url: 'https://youtube.com/shorts/tjknJ0q41JI', video_id: 'tjknJ0q41JI', title: 'Event 7', display_order: 6 },
  { id: '8', youtube_url: 'https://youtube.com/shorts/iXaQxa3ctHw', video_id: 'iXaQxa3ctHw', title: 'Event 8', display_order: 7 },
  { id: '9', youtube_url: 'https://youtube.com/shorts/5zLu9VLYK6M', video_id: '5zLu9VLYK6M', title: 'Event 9', display_order: 8 },
];

export function useReels() {
  const [data, setData] = useState<ReelData[]>(defaultReels);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReels();
  }, []);

  async function fetchReels() {
    try {
      const { data: reels, error } = await supabase
        .from('reels')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      if (reels && reels.length > 0) setData(reels);
    } catch {
      console.warn('Using default reels');
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, refetch: fetchReels };
}

// ─── Partner Logos ───
export interface PartnerLogo {
  id: string;
  image_url: string;
  name: string;
  display_order: number;
}

const defaultLogos: PartnerLogo[] = [
  { id: '1', image_url: '/logos/IHG.png', name: 'IHG', display_order: 0 },
  { id: '2', image_url: '/logos/amazon.png', name: 'Amazon', display_order: 1 },
  { id: '3', image_url: '/logos/astrotalk.png', name: 'Astrotalk', display_order: 2 },
  { id: '4', image_url: '/logos/casio.png', name: 'Casio', display_order: 3 },
  { id: '5', image_url: '/logos/hyatt.png', name: 'Hyatt', display_order: 4 },
  { id: '6', image_url: '/logos/jeevansathi.png', name: 'Jeevansathi', display_order: 5 },
  { id: '7', image_url: '/logos/rswm.png', name: 'RSWM', display_order: 6 },
];

export function usePartnerLogos() {
  const [data, setData] = useState<PartnerLogo[]>(defaultLogos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogos();
  }, []);

  async function fetchLogos() {
    try {
      const { data: logos, error } = await supabase
        .from('partner_logos')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      if (logos && logos.length > 0) setData(logos);
    } catch {
      console.warn('Using default logos');
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, refetch: fetchLogos };
}

// ─── Studio Photos ───
export interface StudioPhoto {
  id: string;
  image_url: string;
  caption: string;
  height: number; // display height hint for masonry (200–600)
  display_order: number;
}

const defaultStudioPhotos: StudioPhoto[] = [
  { id: '1', image_url: '/media/curved-images/akashh.webp', caption: 'pepsodent saab', height: 400, display_order: 0 },
  { id: '2', image_url: '/media/curved-images/gaurav.webp', caption: 'Vice pepsodent saab', height: 300, display_order: 1 },
  { id: '3', image_url: '/media/curved-images/bca-syncup.webp', caption: 'BCA Sync Up', height: 500, display_order: 2 },
  { id: '4', image_url: '/media/curved-images/bcaa.webp', caption: 'BCA Team', height: 350, display_order: 3 },
  { id: '5', image_url: '/media/curved-images/cb-syncup.webp', caption: 'CB Sync Up', height: 450, display_order: 4 },
  { id: '6', image_url: '/media/curved-images/groupp.webp', caption: 'Group Photo', height: 300, display_order: 5 },
  { id: '7', image_url: '/media/curved-images/himanshi-syncup.webp', caption: 'Himanshi Sync Up', height: 400, display_order: 6 },
  { id: '8', image_url: '/media/curved-images/hiya-sak.webp', caption: 'Hiya & Saksham', height: 350, display_order: 7 },
  { id: '9', image_url: '/media/curved-images/hiyaa.webp', caption: 'Hiya', height: 500, display_order: 8 },
  { id: '10', image_url: '/media/curved-images/sak-price.webp', caption: 'Saksham', height: 300, display_order: 9 },
  { id: '11', image_url: '/media/curved-images/svee-syncup.webp', caption: 'Svee Sync Up', height: 450, display_order: 10 },
  { id: '12', image_url: '/media/curved-images/trinity.webp', caption: 'Trinity', height: 400, display_order: 11 },
  { id: '13', image_url: '/media/curved-images/bcaa.webp', caption: 'BCA Team', height: 450, display_order: 12 },
  { id: '14', image_url: '/media/curved-images/himanshi-syncup.webp', caption: 'Himanshi Sync Up', height: 350, display_order: 13 },
  { id: '15', image_url: '/media/curved-images/sak-price.webp', caption: 'Saksham', height: 400, display_order: 14 },
  { id: '16', image_url: '/media/curved-images/gaurav.webp', caption: 'Vice pepsodent saab', height: 320, display_order: 15 },
  { id: '17', image_url: '/media/curved-images/trinity.webp', caption: 'Trinity', height: 500, display_order: 16 },
  { id: '18', image_url: '/media/curved-images/groupp.webp', caption: 'Group Photo', height: 420, display_order: 17 },
  { id: '19', image_url: '/media/curved-images/akashh.webp', caption: 'pepsodent saab', height: 480, display_order: 18 },
  { id: '20', image_url: '/media/curved-images/cb-syncup.webp', caption: 'CB Sync Up', height: 360, display_order: 19 },
  { id: '21', image_url: '/media/curved-images/hiya-sak.webp', caption: 'Hiya & Saksham', height: 440, display_order: 20 },
  { id: '22', image_url: '/media/curved-images/svee-syncup.webp', caption: 'Svee Sync Up', height: 310, display_order: 21 },
  { id: '23', image_url: '/media/curved-images/bca-syncup.webp', caption: 'BCA Sync Up', height: 550, display_order: 22 },
  { id: '24', image_url: '/media/curved-images/hiyaa.webp', caption: 'Hiya', height: 380, display_order: 23 },
];

export function useStudioPhotos() {
  const [data, setData] = useState<StudioPhoto[]>(defaultStudioPhotos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    try {
      const { data: photos, error } = await supabase
        .from('studio_photos')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      if (photos && photos.length > 0) setData(photos);
    } catch {
      console.warn('Using default studio photos');
    } finally {
      setLoading(false);
    }
  }

  return { data, loading, refetch: fetchPhotos };
}
