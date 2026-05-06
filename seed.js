// Run this once to create tables and seed your Supabase database with existing data
// Usage: node seed.js

const SUPABASE_URL = 'https://gquixdtuvdmmtzxgvqzn.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdxdWl4ZHR1dmRtbXR6eGd2cXpuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDgwNzEzMSwiZXhwIjoyMDkwMzgzMTMxfQ.uz-fQLnZ16uezEYEuSpmoJ5jHK6k-RMgwH1hmvZLnmo';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Prefer': 'return=minimal',
};

async function sql(query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query }),
  });
  return res;
}

async function insert(table, rows) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=minimal' },
    body: JSON.stringify(rows),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  ✗ Error inserting into ${table}:`, err);
  } else {
    console.log(`  ✓ Inserted ${rows.length} rows into ${table}`);
  }
}

async function createTables() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS gallery_photos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      image_url TEXT NOT NULL,
      caption TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS testimonials (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      client_name TEXT NOT NULL,
      company TEXT DEFAULT '',
      quote TEXT NOT NULL,
      image_url TEXT DEFAULT '',
      rating INTEGER DEFAULT 5,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS reels (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      youtube_url TEXT NOT NULL,
      video_id TEXT NOT NULL,
      title TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS partner_logos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      image_url TEXT NOT NULL,
      name TEXT DEFAULT '',
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );`,
    `CREATE TABLE IF NOT EXISTS studio_photos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      image_url TEXT NOT NULL,
      caption TEXT DEFAULT '',
      height INTEGER DEFAULT 400,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now()
    );`,
    // RLS
    `ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE reels ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE partner_logos ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE studio_photos ENABLE ROW LEVEL SECURITY;`,
    // Public read policies (drop first to avoid duplicates)
    `DROP POLICY IF EXISTS "Public read gallery_photos" ON gallery_photos; CREATE POLICY "Public read gallery_photos" ON gallery_photos FOR SELECT USING (true);`,
    `DROP POLICY IF EXISTS "Public read testimonials" ON testimonials; CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);`,
    `DROP POLICY IF EXISTS "Public read reels" ON reels; CREATE POLICY "Public read reels" ON reels FOR SELECT USING (true);`,
    `DROP POLICY IF EXISTS "Public read partner_logos" ON partner_logos; CREATE POLICY "Public read partner_logos" ON partner_logos FOR SELECT USING (true);`,
    `DROP POLICY IF EXISTS "Public read studio_photos" ON studio_photos; CREATE POLICY "Public read studio_photos" ON studio_photos FOR SELECT USING (true);`,
    // Auth write policies
    `DROP POLICY IF EXISTS "Auth write gallery_photos" ON gallery_photos; CREATE POLICY "Auth write gallery_photos" ON gallery_photos FOR ALL USING (auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "Auth write testimonials" ON testimonials; CREATE POLICY "Auth write testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "Auth write reels" ON reels; CREATE POLICY "Auth write reels" ON reels FOR ALL USING (auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "Auth write partner_logos" ON partner_logos; CREATE POLICY "Auth write partner_logos" ON partner_logos FOR ALL USING (auth.role() = 'authenticated');`,
    `DROP POLICY IF EXISTS "Auth write studio_photos" ON studio_photos; CREATE POLICY "Auth write studio_photos" ON studio_photos FOR ALL USING (auth.role() = 'authenticated');`,
  ];

  for (const query of queries) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    });
    if (!res.ok) {
      // Tables already exist or policy already exists - that's fine
    }
  }
}

const testimonials = [
  { client_name: 'Sarah Mitchell', company: 'Luxe Fashion Co.', quote: 'Endurance Production transformed our brand campaign into something truly cinematic. The attention to detail and creative vision exceeded all expectations.', image_url: '/media/MagicBento/Akash.webp', rating: 5, display_order: 0 },
  { client_name: 'James Rivera', company: 'TechVault Inc.', quote: 'Their product photography doubled our conversion rate. The team understands how to make every shot sell.', image_url: '/media/MagicBento/Gaurav.webp', rating: 5, display_order: 1 },
  { client_name: 'Priya Kapoor', company: 'Bloom Events', quote: 'The live event coverage was seamless. Same-day edits that blew our audience away!', image_url: '/media/MagicBento/Dev.webp', rating: 5, display_order: 2 },
  { client_name: 'Alex Chen', company: 'Horizon Startups', quote: 'From our pitch video to social media content — Endurance is our go-to creative partner.', image_url: '/media/MagicBento/Sara.webp', rating: 5, display_order: 3 },
  { client_name: 'Daniel Okafor', company: 'Pulse Records', quote: 'The music video they produced for us was a visual masterpiece. Truly world-class.', image_url: '/media/MagicBento/Yash.webp', rating: 5, display_order: 4 },
];

const reels = [
  { youtube_url: 'https://youtube.com/shorts/izLpuW4-LGw', video_id: 'izLpuW4-LGw', title: 'Event 1', display_order: 0 },
  { youtube_url: 'https://youtube.com/shorts/_IXqxwfr0Ng', video_id: '_IXqxwfr0Ng', title: 'Event 2', display_order: 1 },
  { youtube_url: 'https://youtube.com/shorts/cAlOhnobNac', video_id: 'cAlOhnobNac', title: 'Event 3', display_order: 2 },
  { youtube_url: 'https://youtube.com/shorts/z308WDBflx0', video_id: 'z308WDBflx0', title: 'Event 4', display_order: 3 },
  { youtube_url: 'https://youtube.com/shorts/UgRM0AwjLss', video_id: 'UgRM0AwjLss', title: 'Event 5', display_order: 4 },
  { youtube_url: 'https://youtube.com/shorts/-s3NN8ze6kM', video_id: '-s3NN8ze6kM', title: 'Event 6', display_order: 5 },
  { youtube_url: 'https://youtube.com/shorts/tjknJ0q41JI', video_id: 'tjknJ0q41JI', title: 'Event 7', display_order: 6 },
  { youtube_url: 'https://youtube.com/shorts/iXaQxa3ctHw', video_id: 'iXaQxa3ctHw', title: 'Event 8', display_order: 7 },
  { youtube_url: 'https://youtube.com/shorts/5zLu9VLYK6M', video_id: '5zLu9VLYK6M', title: 'Event 9', display_order: 8 },
];

const partnerLogos = [
  { image_url: '/logos/IHG.png', name: 'IHG', display_order: 0 },
  { image_url: '/logos/amazon.png', name: 'Amazon', display_order: 1 },
  { image_url: '/logos/astrotalk.png', name: 'Astrotalk', display_order: 2 },
  { image_url: '/logos/casio.png', name: 'Casio', display_order: 3 },
  { image_url: '/logos/hyatt.png', name: 'Hyatt', display_order: 4 },
  { image_url: '/logos/jeevansathi.png', name: 'Jeevansathi', display_order: 5 },
  { image_url: '/logos/rswm.png', name: 'RSWM', display_order: 6 },
];

const galleryPhotos = [
  { image_url: '/media/curved-images/akashh.webp', caption: 'Akash', display_order: 0 },
  { image_url: '/media/curved-images/gaurav.webp', caption: 'Gaurav', display_order: 1 },
  { image_url: '/media/curved-images/bca-syncup.webp', caption: 'BCA Sync Up', display_order: 2 },
  { image_url: '/media/curved-images/bcaa.webp', caption: 'BCA Team', display_order: 3 },
  { image_url: '/media/curved-images/cb-syncup.webp', caption: 'CB Sync Up', display_order: 4 },
  { image_url: '/media/curved-images/groupp.webp', caption: 'Group Photo', display_order: 5 },
  { image_url: '/media/curved-images/himanshi-syncup.webp', caption: 'Himanshi Sync Up', display_order: 6 },
  { image_url: '/media/curved-images/hiya-sak.webp', caption: 'Hiya & Saksham', display_order: 7 },
  { image_url: '/media/curved-images/hiyaa.webp', caption: 'Hiya', display_order: 8 },
  { image_url: '/media/curved-images/sak-price.webp', caption: 'Saksham', display_order: 9 },
  { image_url: '/media/curved-images/svee-syncup.webp', caption: 'Svee Sync Up', display_order: 10 },
  { image_url: '/media/curved-images/trinity.webp', caption: 'Trinity', display_order: 11 },
];

const studioPhotos = [
  { image_url: '/media/curved-images/akashh.webp', caption: 'Akash', height: 400, display_order: 0 },
  { image_url: '/media/curved-images/gaurav.webp', caption: 'Gaurav', height: 320, display_order: 1 },
  { image_url: '/media/curved-images/bca-syncup.webp', caption: 'BCA Sync Up', height: 520, display_order: 2 },
  { image_url: '/media/curved-images/bcaa.webp', caption: 'BCA Team', height: 360, display_order: 3 },
  { image_url: '/media/curved-images/cb-syncup.webp', caption: 'CB Sync Up', height: 460, display_order: 4 },
  { image_url: '/media/curved-images/groupp.webp', caption: 'Group Photo', height: 340, display_order: 5 },
  { image_url: '/media/curved-images/himanshi-syncup.webp', caption: 'Himanshi Sync Up', height: 420, display_order: 6 },
  { image_url: '/media/curved-images/hiya-sak.webp', caption: 'Hiya & Saksham', height: 380, display_order: 7 },
];

async function main() {
  console.log('🚀 Seeding Supabase database...\n');

  // Create any missing tables/policies first.
  await createTables();

  console.log('📋 Seeding testimonials...');
  await insert('testimonials', testimonials);

  console.log('🎬 Seeding reels...');
  await insert('reels', reels);

  console.log('🏢 Seeding partner logos...');
  await insert('partner_logos', partnerLogos);

  console.log('🖼️  Seeding gallery photos...');
  await insert('gallery_photos', galleryPhotos);

  console.log('🎞️  Seeding studio photos...');
  await insert('studio_photos', studioPhotos);

  console.log('\n✅ Done! Refresh your dashboard to see the data.');
}

main().catch(console.error);
