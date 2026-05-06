import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, Upload } from 'lucide-react';

interface Logo {
  id: string;
  image_url: string;
  name: string;
  display_order: number;
}

export default function LogosManager() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => { fetchLogos(); }, []);

  async function fetchLogos() {
    setLoading(true);
    const { data, error } = await supabase.from('partner_logos').select('*').order('display_order');
    if (!error && data) setLogos(data);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('asset endurance').upload(`logos/${fileName}`, file);
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('asset endurance').getPublicUrl(`logos/${fileName}`);
    await supabase.from('partner_logos').insert({ image_url: publicUrl, name: newName || file.name.split('.')[0], display_order: logos.length });
    setNewName('');
    setUploading(false);
    fetchLogos();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this logo?')) return;
    await supabase.from('partner_logos').delete().eq('id', id);
    fetchLogos();
  }

  const LIMIT = 10;
  const isLimitReached = logos.length >= LIMIT;

  if (loading) return <div className="text-gray-400 p-8">Loading logos...</div>;

  return (
    <div className="space-y-6">
      {/* Items counter */}
      <div className="flex items-center justify-between px-2">
        <span className="text-gray-500 text-sm font-medium">Current: {logos.length} / {LIMIT}</span>
        {isLimitReached && <span className="text-purple-500 text-xs font-bold animate-pulse">Limit Reached</span>}
      </div>

      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus size={18} /> Add Partner Logo</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Brand name" className="flex-1 px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" disabled={isLimitReached} />
          <label className={`px-6 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 text-sm justify-center ${isLimitReached ? 'bg-gray-800 text-gray-500 cursor-not-allowed grayscale' : 'bg-purple-500 hover:bg-purple-600 text-white cursor-pointer'}`}>
            <Upload size={16} /> {uploading ? 'Uploading...' : isLimitReached ? 'Limit Reached' : 'Upload Logo'}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading || isLimitReached} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {logos.map(logo => (
          <div key={logo.id} className="group relative bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex flex-col items-center hover:border-purple-500/30 transition-all">
            <img src={logo.image_url} alt={logo.name} className="h-16 w-auto object-contain mb-3" />
            <p className="text-white text-xs font-medium">{logo.name}</p>
            <button onClick={() => handleDelete(logo.id)} className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 rounded-lg flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
