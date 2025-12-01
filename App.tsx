import React, { useState, useMemo } from 'react';
import { MapVisualization } from './components/MapVisualization';
import { WineryCard } from './components/WineryCard';
import { FilterBar } from './components/FilterBar';
import { WINERIES } from './constants';
import { Winery } from './types';
import { Menu, Wine } from 'lucide-react';

const App: React.FC = () => {
  const [activeWinery, setActiveWinery] = useState<Winery | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);

  // Derived Data
  const allVarieties = useMemo(() => {
    const varieties = new Set<string>();
    WINERIES.forEach(w => w.varieties.forEach(v => varieties.add(v)));
    return Array.from(varieties).sort();
  }, []);

  const filteredWineries = useMemo(() => {
    return WINERIES.filter(winery => {
      // 1. Text Search Filter
      const matchesSearch = 
        searchTerm === '' ||
        winery.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winery.district.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Variety Filter (Union/OR Logic: Match ANY selected variety)
      // If no varieties selected, show all (that match search)
      const matchesVariety = 
        selectedVarieties.length === 0 ||
        winery.varieties.some(v => selectedVarieties.includes(v));

      return matchesSearch && matchesVariety;
    });
  }, [searchTerm, selectedVarieties]);

  const handleToggleVariety = (variety: string) => {
    setSelectedVarieties(prev => 
      prev.includes(variety) 
        ? prev.filter(v => v !== variety)
        : [...prev, variety]
    );
  };

  const handleClearFilters = () => {
      setSearchTerm('');
      setSelectedVarieties([]);
  };

  return (
    <div className="flex flex-col h-screen bg-paper font-sans text-gray-800 overflow-hidden">
      {/* Header */}
      <header className="flex-none h-16 bg-white border-b border-wine-100 flex items-center justify-between px-6 z-20 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-wine-700 rounded-lg flex items-center justify-center text-white">
            <Wine className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-wine-900 tracking-tight">Canberra Terroir</h1>
            <p className="text-xs text-wine-500 uppercase tracking-widest">Wine Region Guide</p>
          </div>
        </div>
        <button 
          className="md:hidden p-2 text-wine-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Map & Filter */}
        <div className="flex-1 relative p-4 md:p-6 transition-all duration-500 ease-in-out flex flex-col gap-4">
          
          {/* Filter Bar */}
          <div className="flex-none z-10">
              <FilterBar 
                availableVarieties={allVarieties}
                selectedVarieties={selectedVarieties}
                onToggleVariety={handleToggleVariety}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onClearFilters={handleClearFilters}
              />
          </div>

          <div className="flex-1 w-full relative rounded-2xl shadow-xl border-4 border-white overflow-hidden">
             <MapVisualization 
                wineries={filteredWineries}
                activeWinery={activeWinery}
                onWinerySelect={setActiveWinery}
             />
             
             {/* Floating Info Prompt */}
             {!activeWinery && (
               <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-wine-100 pointer-events-none animate-pulse">
                 <p className="text-wine-800 font-serif italic text-sm">
                    {filteredWineries.length === 0 ? "No wineries match your filter" : "Select a winery to explore"}
                 </p>
               </div>
             )}
          </div>
        </div>

        {/* Right: Info Panel (Desktop) / Drawer (Mobile) */}
        <div className={`
          absolute md:relative inset-y-0 right-0 w-full md:w-[450px] bg-paper md:bg-transparent
          transform transition-transform duration-300 ease-in-out z-30 flex flex-col p-4 md:p-6 gap-4
          ${activeWinery || sidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:p-0 md:opacity-0'}
        `}>
          {/* Back button for mobile */}
          <div className="md:hidden flex justify-end mb-2">
             <button 
               onClick={() => { setActiveWinery(null); setSidebarOpen(false); }}
               className="text-sm font-bold text-wine-700 underline"
             >
               Back to Map
             </button>
          </div>

          {activeWinery ? (
            <div className="h-full">
              <WineryCard 
                winery={activeWinery} 
                onClose={() => setActiveWinery(null)} 
              />
            </div>
          ) : (
             // Placeholder for desktop right panel if nothing selected
             <div className="hidden md:flex h-full items-center justify-center text-wine-300 opacity-0">
                Select a winery
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;