import React from 'react';
import { Winery } from '../types';
import { X, MapPin, Globe, Phone, Grape, ShoppingBag, Loader2, ExternalLink } from 'lucide-react';
import { searchWinesForSale, WineSearchResponse } from '../services/geminiService';

interface WineryCardProps {
  winery: Winery;
  onClose: () => void;
}

export const WineryCard: React.FC<WineryCardProps> = ({ winery, onClose }) => {
  const [wineList, setWineList] = React.useState<WineSearchResponse | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setWineList(null);
    
    // Updated: Passing the specific shopUrl along with the name
    searchWinesForSale(winery.name, winery.shopUrl).then(data => {
      if (active) {
        setWineList(data);
        setLoading(false);
      }
    });
    
    return () => { active = false; };
  }, [winery.id, winery.name, winery.shopUrl]);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-wine-100 flex flex-col h-full animate-fade-in">
      <div className="relative h-48 bg-gray-200 shrink-0">
        <img 
          src={winery.image} 
          alt={winery.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 p-1 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-2xl font-serif font-bold">{winery.name}</h2>
          <span className="text-sm font-light opacity-90 flex items-center gap-1">
             <MapPin className="w-3 h-3" /> {winery.district}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        <p className="text-gray-600 italic font-serif leading-relaxed mb-6 border-l-4 border-wine-300 pl-4">
          "{winery.description}"
        </p>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase text-wine-500 tracking-wider mb-2 flex items-center gap-2">
              <Grape className="w-4 h-4" /> Signature Varieties
            </h4>
            <div className="flex flex-wrap gap-2">
              {winery.varieties.map(v => (
                <span key={v} className="px-3 py-1 bg-vine-100 text-vine-900 rounded-full text-xs font-semibold">
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-wine-300 shrink-0 mt-0.5" />
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(winery.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-wine-700"
              >
                {winery.address}
              </a>
            </div>
            
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-wine-300 shrink-0" />
              <a 
                href={winery.website || `https://www.google.com/search?q=${encodeURIComponent(winery.name + ' website')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine-700 hover:underline"
              >
                Visit Website
              </a>
            </div>

            {winery.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-wine-300 shrink-0" />
                <span>{winery.phone}</span>
              </div>
            )}
          </div>

          {/* Wines For Sale Section */}
          <div className="mt-8 pt-6 border-t border-wine-100 min-h-[200px]">
             <h4 className="text-lg font-serif font-bold text-wine-900 mb-4 flex items-center gap-2">
               <ShoppingBag className="w-5 h-5 text-wine-500" />
               Current Vintages
             </h4>
             
             {loading ? (
               <div className="flex flex-col items-center justify-center py-8 text-wine-300">
                 <Loader2 className="w-8 h-8 animate-spin mb-2" />
                 <span className="text-xs uppercase tracking-widest">Searching Cellar...</span>
               </div>
             ) : wineList ? (
               <div className="space-y-4 animate-fade-in">
                 <ul className="space-y-3">
                   {wineList.wines.length > 0 ? (
                       wineList.wines.map((wine, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                           <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-wine-300 shrink-0"></span>
                           <a 
                             href={wine.link} 
                             target="_blank" 
                             rel="noopener noreferrer" 
                             title={`Open purchase page for ${wine.name}`}
                             className="group flex flex-col sm:flex-row sm:items-baseline gap-1 text-gray-700 hover:text-wine-700 transition-colors"
                           >
                             <span className="font-medium underline decoration-wine-200 underline-offset-2 decoration-1 group-hover:decoration-wine-500">{wine.name}</span>
                             {wine.price && wine.price.toLowerCase() !== 'price n/a' && (
                               <span className="text-gray-500 font-normal text-xs sm:text-sm">{wine.price}</span>
                             )}
                             <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1 inline-block" />
                           </a>
                        </li>
                       ))
                   ) : (
                       <li className="text-sm text-gray-400 italic">No specific vintages found available online.</li>
                   )}
                 </ul>
                 
                 {wineList.sources.length > 0 && (
                   <div className="mt-6 pt-4 border-t border-gray-50">
                     <p className="text-[10px] uppercase text-gray-400 font-bold mb-2">Verified Sources</p>
                     <div className="flex flex-wrap gap-2">
                       {wineList.sources.map((source, idx) => (
                         <a 
                           key={idx} 
                           href={source.uri} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex items-center gap-1 text-[10px] text-wine-600 bg-wine-50 px-2 py-1 rounded hover:bg-wine-100 transition-colors border border-wine-100"
                         >
                           {source.title.length > 25 ? source.title.substring(0, 25) + '...' : source.title}
                           <ExternalLink className="w-3 h-3" />
                         </a>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
             ) : (
                <p className="text-sm text-gray-400 italic">No current vintage information available.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
