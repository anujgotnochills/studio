import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, Upload, ImagePlus, GripVertical } from 'lucide-react';

interface StudioPhoto {
  id: string;
  image_url: string;
  caption: string;
  height: number;
  display_order: number;
}

const HEIGHT_OPTIONS = [
  { label: 'Short (200)', value: 200 },
  { label: 'Small (300)', value: 300 },
  { label: 'Medium (400)', value: 400 },
  { label: 'Tall (500)', value: 500 },
  { label: 'Extra Tall (600)', value: 600 },
];

export default function StudioManager() {
  const [photos, setPhotos] = useState<StudioPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newHeight, setNewHeight] = useState(400);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => { fetchPhotos(); }, []);

  async function fetchPhotos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('studio_photos')
      .select('*')
      .order('display_order');
    if (!error && data) setPhotos(data);
    setLoading(false);
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `studio_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('asset endurance')
      .upload(`studio/${fileName}`, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('asset endurance')
      .getPublicUrl(`studio/${fileName}`);

    await supabase.from('studio_photos').insert({
      image_url: publicUrl,
      caption: newCaption || file.name.replace(/\.[^/.]+$/, ''),
      height: newHeight,
      display_order: photos.length,
    });

    setNewCaption('');
    setUploading(false);
    fetchPhotos();
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) await uploadFile(file);
  }

  async function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) await uploadFile(file);
  }

  async function handleDelete(id: string, imageUrl: string) {
    if (!confirm('Delete this studio photo?')) return;
    // Delete from storage
    try {
      const path = imageUrl.split('/studio/')[1];
      if (path) await supabase.storage.from('asset endurance').remove([`studio/${path}`]);
    } catch { /* ignore storage errors */ }
    await supabase.from('studio_photos').delete().eq('id', id);
    fetchPhotos();
  }

  async function updateCaption(id: string, caption: string) {
    await supabase.from('studio_photos').update({ caption }).eq('id', id);
  }

  async function updateHeight(id: string, height: number) {
    await supabase.from('studio_photos').update({ height }).eq('id', id);
    fetchPhotos();
  }

  async function moveItem(index: number, direction: 'up' | 'down') {
    const arr = [...photos];
    const swapIdx = direction === 'up' ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    const tmp = arr[index].display_order;
    arr[index].display_order = arr[swapIdx].display_order;
    arr[swapIdx].display_order = tmp;
    await Promise.all([
      supabase.from('studio_photos').update({ display_order: arr[index].display_order }).eq('id', arr[index].id),
      supabase.from('studio_photos').update({ display_order: arr[swapIdx].display_order }).eq('id', arr[swapIdx].id),
    ]);
    fetchPhotos();
  }

  const LIMIT = 20;
  const isLimitReached = photos.length >= LIMIT;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading studio photos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-gray-400 text-sm">
            <span className="text-white font-bold">{photos.length}</span> / {LIMIT} photos
          </span>
        </div>
        {isLimitReached && (
          <span className="text-xs font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
            Limit Reached
          </span>
        )}
      </div>

      {/* Upload Card */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 md:p-6 space-y-4">
        <h3 className="text-white font-bold flex items-center gap-2 text-base">
          <ImagePlus size={18} className="text-purple-500" />
          Add Studio Photo
        </h3>

        {/* Caption + Height row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={newCaption}
            onChange={e => setNewCaption(e.target.value)}
            placeholder="Caption / name (optional)"
            disabled={isLimitReached}
            className="px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 disabled:opacity-50"
          />
          <select
            value={newHeight}
            onChange={e => setNewHeight(Number(e.target.value))}
            disabled={isLimitReached}
            className="px-4 py-2.5 bg-[#0a0a0a] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500 disabled:opacity-50"
          >
            {HEIGHT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Drag & Drop upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer
            ${dragActive ? 'border-purple-500 bg-purple-500/5' : 'border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/5'}
            ${isLimitReached ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Upload className="text-purple-400" size={24} />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-sm">
              {uploading ? 'Uploading...' : 'Drop image here or click to browse'}
            </p>
            <p className="text-gray-500 text-xs mt-1">PNG, JPG, WEBP — max 10MB</p>
          </div>
          {!uploading && !isLimitReached && (
            <label className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl text-sm cursor-pointer transition-all flex items-center gap-2">
              <Plus size={16} /> Choose File
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
                disabled={uploading}
              />
            </label>
          )}
          {uploading && (
            <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
              <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
              Uploading to studio...
            </div>
          )}
        </div>
      </div>

      {/* Photos Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-gray-800 rounded-2xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-900 flex items-center justify-center">
            <ImagePlus size={28} className="text-gray-600" />
          </div>
          <p className="text-gray-400 font-semibold">No studio photos yet</p>
          <p className="text-gray-600 text-sm mt-1">Upload your first photo above to get started</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-white font-bold text-sm">Uploaded Photos</h3>
            <p className="text-gray-500 text-xs">Drag order affects masonry layout</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative bg-[#111] border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/40 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-black aspect-[3/4]">
                  <img
                    src={photo.image_url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="w-7 h-7 bg-black/80 rounded-lg flex items-center justify-center text-gray-300 hover:text-white text-xs disabled:opacity-30"
                    >↑</button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === photos.length - 1}
                      className="w-7 h-7 bg-black/80 rounded-lg flex items-center justify-center text-gray-300 hover:text-white text-xs disabled:opacity-30"
                    >↓</button>
                    <button
                      onClick={() => handleDelete(photo.id, photo.image_url)}
                      className="w-7 h-7 bg-red-500/90 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical size={14} className="text-gray-400" />
                  </div>
                </div>

                {/* Edit Caption & Height */}
                <div className="p-2.5 space-y-2">
                  <input
                    type="text"
                    defaultValue={photo.caption}
                    onBlur={e => updateCaption(photo.id, e.target.value)}
                    placeholder="Caption..."
                    className="w-full px-2.5 py-1.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white text-xs placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <select
                    defaultValue={photo.height}
                    onChange={e => updateHeight(photo.id, Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-[#0a0a0a] border border-gray-700 rounded-lg text-gray-400 text-xs focus:outline-none focus:border-purple-500"
                  >
                    {HEIGHT_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
