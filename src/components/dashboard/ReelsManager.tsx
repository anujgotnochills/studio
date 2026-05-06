import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Plus, Edit3, Save, X, Play } from 'lucide-react';

interface Reel {
  id: string;
  youtube_url: string;
  video_id: string;
  title: string;
  display_order: number;
}

function extractVideoId(url: string): string {
  // Handle youtube.com/shorts/ID, youtu.be/ID, youtube.com/watch?v=ID
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
  return url; // assume raw ID
}

export default function ReelsManager() {
  const [items, setItems] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [formTitle, setFormTitle] = useState('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    setLoading(true);
    const { data, error } = await supabase.from('reels').select('*').order('display_order');
    if (!error && data) setItems(data);
    setLoading(false);
  }

  async function handleAdd() {
    const videoId = extractVideoId(formUrl);
    await supabase.from('reels').insert({
      youtube_url: formUrl,
      video_id: videoId,
      title: formTitle || `Reel ${items.length + 1}`,
      display_order: items.length,
    });
    setFormUrl(''); setFormTitle(''); setShowAddForm(false);
    fetchItems();
  }

  async function handleUpdate(id: string) {
    const videoId = extractVideoId(formUrl);
    await supabase.from('reels').update({ youtube_url: formUrl, video_id: videoId, title: formTitle }).eq('id', id);
    setEditingId(null);
    fetchItems();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this reel?')) return;
    await supabase.from('reels').delete().eq('id', id);
    fetchItems();
  }

  function startEdit(item: Reel) {
    setEditingId(item.id);
    setFormUrl(item.youtube_url);
    setFormTitle(item.title);
  }

  const LIMIT = 10;
  const isLimitReached = items.length >= LIMIT;

  if (loading) return <div className="text-gray-400 p-8">Loading reels...</div>;

  return (
    <div className="space-y-6">
      {/* Items counter */}
      <div className="flex items-center justify-between px-2">
        <span className="text-gray-500 text-sm font-medium">Current: {items.length} / {LIMIT}</span>
        {isLimitReached && <span className="text-purple-500 text-xs font-bold animate-pulse">Limit Reached</span>}
      </div>

      {/* Add New */}
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6">
        {showAddForm ? (
          <div className="space-y-4">
            <h3 className="text-white font-bold flex items-center gap-2"><Plus size={18} /> Add New Reel</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={formUrl} onChange={e => setFormUrl(e.target.value)} placeholder="YouTube URL (shorts, watch, etc.)" className="px-3 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" disabled={isLimitReached} />
              <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="Title" className="px-3 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500" disabled={isLimitReached} />
            </div>
            {formUrl && (
              <div className="flex items-center gap-3 bg-[#111] rounded-xl p-3 border border-gray-800">
                <img src={`https://img.youtube.com/vi/${extractVideoId(formUrl)}/mqdefault.jpg`} className="w-24 h-14 rounded-lg object-cover" alt="Thumbnail" />
                <div>
                  <p className="text-white text-xs font-medium">{formTitle || 'Untitled'}</p>
                  <p className="text-gray-500 text-xs mt-0.5">ID: {extractVideoId(formUrl)}</p>
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <button 
                onClick={handleAdd} 
                disabled={isLimitReached}
                className="px-5 py-2 bg-purple-500 disabled:bg-gray-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm flex items-center gap-1.5"
              >
                <Save size={14} /> Save
              </button>
              <button onClick={() => { setShowAddForm(false); setFormUrl(''); setFormTitle(''); }} className="px-5 py-2 bg-gray-700 text-white rounded-xl text-sm flex items-center gap-1.5"><X size={14} /> Cancel</button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => !isLimitReached && setShowAddForm(true)} 
            disabled={isLimitReached}
            className={`w-full py-3 border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium ${isLimitReached ? 'border-gray-800 text-gray-600 grayscale' : 'border-gray-700 text-gray-400 hover:text-purple-500 hover:border-purple-500/50'}`}
          >
            <Plus size={18} /> {isLimitReached ? 'Limit Reached (Max 10)' : 'Add New Reel'}
          </button>
        )}
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
            {editingId === item.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={formUrl} onChange={e => setFormUrl(e.target.value)} className="px-3 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500" />
                  <input value={formTitle} onChange={e => setFormTitle(e.target.value)} className="px-3 py-2.5 bg-[#111] border border-gray-700 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(item.id)} className="px-5 py-2 bg-purple-500 text-white font-bold rounded-xl text-sm flex items-center gap-1.5"><Save size={14} /> Update</button>
                  <button onClick={() => setEditingId(null)} className="px-5 py-2 bg-gray-700 text-white rounded-xl text-sm flex items-center gap-1.5"><X size={14} /> Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`} className="w-28 h-16 rounded-lg object-cover" alt={item.title} />
                  <div className="absolute inset-0 flex items-center justify-center"><Play size={20} className="text-white drop-shadow-lg" /></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  <p className="text-gray-500 text-xs truncate mt-0.5">{item.youtube_url}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => startEdit(item)} className="w-8 h-8 bg-[#222] rounded-lg flex items-center justify-center text-gray-400 hover:text-purple-500"><Edit3 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 bg-[#222] rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
