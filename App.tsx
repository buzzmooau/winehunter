import React, { useState, useMemo } from 'react';
import { MapVisualization } from './components/MapVisualization';
import { WineryCard } from './components/WineryCard';
import { FilterBar } from './components/FilterBar';
import { WINERIES } from './constants';
import { Winery } from './types';
import { Menu, Wine, Search, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { smartWineSearch } from './services/geminiService';

const App: React.FC = () => {
  const [activeWinery, setActiveWinery] = useState<Winery | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Filtering State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVarieties, setSelectedVarieties] = useState<string[]>([]);

  // Smart Search State
  const [isSearchingWines, setIsSearchingWines] = useState(false);
  const [wineSearchResults, setWineSearchResults] = useState<{ searchedWineries: string[], matches: any[] } | null>(null);

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
      setWineSearchResults(null);
  };

  const handleSearchSubmit = async () => {
      if (!searchTerm.trim()) return;

      // Reset previous results
      setWineSearchResults(null);
      setActiveWinery(null);
      setIsSearchingWines(true);
      setSidebarOpen(true); // Open sidebar on mobile to show results

      // Trigger Smart Search
      try {
          const results = await smartWineSearch(searchTerm);
          setWineSearchResults(results);
      } catch (e) {
          console.error(e);
      } finally {
          setIsSearchingWines(false);
      }
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
                onSearchSubmit={handleSearchSubmit}
              />
          </div>

          <div className="flex-1 w-full relative rounded-2xl shadow-xl border-4 border-white overflow-hidden">
             <MapVisualization 
                wineries={filteredWineries}
                activeWinery={activeWinery}
                onWinerySelect={(w) => {
                    setActiveWinery(w);
                    setWineSearchResults(null); // Clear search results if selecting a winery directly
                    setSidebarOpen(true);
                }}
             />
             
             {/* Floating Info Prompt */}
             {!activeWinery && !wineSearchResults && !isSearchingWines && (
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
          ${activeWinery || sidebarOpen || wineSearchResults || isSearchingWines ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:w-0 md:p-0 md:opacity-0'}
        `}>
          {/* Back button for mobile */}
          <div className="md:hidden flex justify-end mb-2">
             <button 
               onClick={() => { setActiveWinery(null); setWineSearchResults(null); setSidebarOpen(false); }}
               className="text-sm font-bold text-wine-700 underline"
             >
               Back to Map
             </button>
          </div>

          {isSearchingWines && (
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-wine-100 p-8 flex flex-col items-center justify-center text-center">
                  <Sparkles className="w-12 h-12 text-wine-300 animate-bounce mb-4" />
                  <h3 className="font-serif font-bold text-xl text-wine-900 mb-2">Asking the Sommelier...</h3>
                  <p className="text-gray-500">Searching cellars for "{searchTerm}"</p>
              </div>
          )}

          {!isSearchingWines && wineSearchResults && (
              <div className="flex-1 bg-white rounded-xl shadow-lg border border-wine-100 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-wine-100 bg-wine-50">
                      <h2 className="text-xl font-serif font-bold text-wine-900 flex items-center gap-2">
                          <Search className="w-5 h-5" />
                          Found {wineSearchResults.matches.length} Wines
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                          Scanned {wineSearchResults.searchedWineries.length} relevant wineries: {wineSearchResults.searchedWineries.join(', ')}
                      </p>
                  </div>
                  <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                      {wineSearchResults.matches.length > 0 ? (
                          <ul className="space-y-4">
                              {wineSearchResults.matches.map((item, idx) => (
                                  <li key={idx} className="pb-4 border-b border-gray-50 last:border-0">
                                      <div className="flex justify-between items-start mb-1">
                                          <span className="font-bold text-gray-800 text-sm">{item.wine}</span>
                                          <span className="text-wine-700 font-bold text-sm bg-wine-50 px-2 py-0.5 rounded">{item.price}</span>
                                      </div>
                                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                                          from <span className="font-semibold text-wine-600">{item.wineryName}</span>
                                      </p>
                                      <a 
                                          href={item.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs flex items-center gap-1 text-blue-600 hover:underline"
                                      >
                                          View Bottle <ExternalLink className="w-3 h-3" />
                                      </a>
                                  </li>
                              ))}
                          </ul>
                      ) : (
                          <div className="text-center py-10 text-gray-400 italic">
                              No specific bottles found matching your criteria. Try browsing the wineries directly on the map.
                          </div>
                      )}
                  </div>
                  <button 
                      onClick={() => setWineSearchResults(null)}
                      className="p-3 text-center text-sm font-bold text-wine-700 hover:bg-wine-50 transition-colors border-t border-wine-100"
                  >
                      Clear Results
                  </button>
              </div>
          )}

          {!isSearchingWines && !wineSearchResults && activeWinery && (
            <div className="h-full">
              <WineryCard 
                winery={activeWinery} 
                onClose={() => setActiveWinery(null)} 
              />
            </div>
          )}

          {!isSearchingWines && !wineSearchResults && !activeWinery && (
             // Placeholder for desktop right panel if nothing selected
             <div className="hidden md:flex h-full items-center justify-center text-wine-300/50 flex-col gap-4">
                <Wine className="w-16 h-16 opacity-20" />
                <p className="font-serif italic text-lg opacity-40">Select a winery to view details</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
