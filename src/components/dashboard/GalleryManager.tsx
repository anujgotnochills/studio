import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, GripVertical, Upload } from 'lucide-react';

interface Photo {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
}

export default function GalleryManager() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newCaption, setNewCaption] = useState('');

  useEffect(() => { fetchPhotos(); }, []);

  async function fetchPhotos() {
    setLoading(true);
    const { data, error } = await supabase.from('gallery_photos').select('*').order('display_order');
    if (!error && data) setPhotos(data);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage.from('asset endurance').upload(`gallery/${fileName}`, file);

    if (uploadError) { alert('Upload failed: ' + uploadError.message); setUploading(false); return; }

    const { data: { publicUrl } } = supabase.storage.from('asset endurance').getPublicUrl(`gallery/${fileName}`);

    await supabase.from('gallery_photos').insert({
      image_url: publicUrl,
      caption: newCaption || file.name.split('.')[0],
      display_order: photos.length,
    });

    setNewCaption('');
    setUploading(false);
    fetchPhotos();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo?')) return;
    await supabase.from('gallery_photos').delete().eq('id', id);
    fetchPhotos();
  }

  async function moveItem(index: number, direction: 'up' | 'down') {
    const newPhotos = [...photos];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newPhotos.length) return;

    const temp = newPhotos[index].display_order;
    newPhotos[index].display_order = newPhotos[swapIndex].display_order;
    newPhotos[swapIndex].display_order = temp;

    await Promise.all([
      supabase.from('gallery_photos').update({ display_order: newPhotos[index].display_order }).eq('id', newPhotos[index].id),
      supabase.from('gallery_photos').update({ display_order: newPhotos[swapIndex].display_order }).eq('id', newPhotos[swapIndex].id),
    ]);
    fetchPhotos();
  }

  const LIMIT = 15;
  const isLimitReached = photos.length >= LIMIT;

  if (loading) return <div className="text-gray-400 p-8">Loading photos...</div>;

  return (
    <div className="space-y-6">
      {/* Items counter */}
      <div className="flex items-center justify-between px-2">
        <span className="text-gray-500 text-sm font-medium">Current: {photos.length} / {LIMIT}</span>
        {isLimitReached && <span className="text-purple-500 text-xs font-bold animate-pulse">Limit Reached</span>}
      </div>

      {/* Upload Section */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 flex items-center gap-2"><Plus size={18} /> Add New Photo</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="flex-1 px-4 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500"
            disabled={isLimitReached}
          />
          <label className={`px-6 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 text-sm justify-center ${isLimitReached ? 'bg-gray-800 text-gray-500 cursor-not-allowed grayscale' : 'bg-purple-500 hover:bg-purple-600 text-white cursor-pointer'}`}>
            <Upload size={16} />
            {uploading ? 'Uploading...' : isLimitReached ? 'Limit Reached' : 'Upload Photo'}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading || isLimitReached} />
          </label>
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No photos yet</p>
          <p className="text-sm mt-1">Upload your first gallery photo above</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="group relative bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all">
              <img src={photo.image_url} alt={photo.caption} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-white text-xs font-medium truncate">{photo.caption}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveItem(index, 'up')} className="w-7 h-7 bg-black/70 rounded-lg flex items-center justify-center text-gray-300 hover:text-white text-xs">↑</button>
                <button onClick={() => moveItem(index, 'down')} className="w-7 h-7 bg-black/70 rounded-lg flex items-center justify-center text-gray-300 hover:text-white text-xs">↓</button>
                <button onClick={() => handleDelete(photo.id)} className="w-7 h-7 bg-red-500/80 rounded-lg flex items-center justify-center text-white"><Trash2 size={12} /></button>
              </div>
              <div className="absolute top-2 left-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
