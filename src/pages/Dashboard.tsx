import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Images, MessageSquareQuote, Film, Award, LogOut, LayoutDashboard, Menu, X, Clapperboard } from 'lucide-react';
import GalleryManager from '@/components/dashboard/GalleryManager';
import TestimonialsManager from '@/components/dashboard/TestimonialsManager';
import ReelsManager from '@/components/dashboard/ReelsManager';
import LogosManager from '@/components/dashboard/LogosManager';
import StudioManager from '@/components/dashboard/StudioManager';

type Tab = 'gallery' | 'testimonials' | 'reels' | 'logos' | 'studio';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'gallery', label: 'Gallery', icon: Images },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { id: 'reels', label: 'Reels / Videos', icon: Film },
  { id: 'logos', label: 'Partner Logos', icon: Award },
  { id: 'studio', label: 'Studio Showcase', icon: Clapperboard },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('gallery');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Close mobile menu when switching tabs
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeTab]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/dashboard/login');
  }

  return (
    <div className="h-screen bg-[#0a0a0a] flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-[#111] border-r border-gray-800 flex flex-col fixed h-full z-50 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/main logo.png" alt="Logo" className="w-9 h-9 rounded-lg" />
            <div>
              <h1 className="text-white font-black text-sm">Endurance</h1>
              <p className="text-gray-500 text-[10px] font-medium">Admin Panel</p>
            </div>
          </div>
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3 px-3">Content</div>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-black/5'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-800 space-y-2">
          <a href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-black/5 transition-all">
            <LayoutDashboard size={18} />
            View Site
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full md:ml-64 flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-gray-800 px-4 md:px-8 py-4 md:py-5 z-30 flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="md:hidden text-white p-2 -ml-2 hover:bg-black/10 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <div>
            <h2 className="text-white text-lg md:text-xl font-black flex items-center gap-2 md:gap-3">
              {(() => {
                const tab = tabs.find(t => t.id === activeTab);
                const Icon = tab?.icon || Images;
                return <><Icon size={20} className="text-purple-500 md:w-6 md:h-6" /> {tab?.label} Manager</>;
              })()}
            </h2>
            <p className="text-gray-500 text-xs md:text-sm mt-0.5">Manage your website content</p>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 flex-1">
          {activeTab === 'gallery' && <GalleryManager />}
          {activeTab === 'testimonials' && <TestimonialsManager />}
          {activeTab === 'reels' && <ReelsManager />}
          {activeTab === 'logos' && <LogosManager />}
          {activeTab === 'studio' && <StudioManager />}
        </div>
      </main>
    </div>
  );
}
