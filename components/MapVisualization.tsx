import React, { useState, useRef, useEffect } from 'react';
import { Winery } from '../types';
import { Wine, Plus, Minus } from 'lucide-react';

interface MapVisualizationProps {
  wineries: Winery[];
  activeWinery: Winery | null;
  onWinerySelect: (winery: Winery) => void;
}

export const MapVisualization: React.FC<MapVisualizationProps> = ({ wineries, activeWinery, onWinerySelect }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 4));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 1));

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Reset position when scaling back to 1 to ensure map is centered
  useEffect(() => {
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  return (
    <div 
      className={`relative w-full h-full bg-[#f0ebd8] overflow-hidden rounded-xl shadow-inner border border-[#d8d0b0] ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={containerRef}
    >
      {/* Transformable Container */}
      <div 
        className="w-full h-full relative transition-transform duration-100 ease-out origin-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
        }}
      >
        {/* Abstract stylized map background elements */}
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none select-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Lake George */}
          <path d="M 85 20 C 90 25, 95 35, 88 45 C 80 55, 82 40, 85 20 Z" fill="#a2d2df" />
          
          {/* Highways (Stylized) */}
          {/* Barton Hwy */}
          <path d="M 100 0 L 50 60 L 55 65" stroke="#a0a0a0" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />
          {/* Federal Hwy */}
          <path d="M 50 60 L 90 20" stroke="#a0a0a0" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />
          {/* Monaro Hwy */}
          <path d="M 50 60 L 50 100" stroke="#a0a0a0" strokeWidth="0.8" fill="none" strokeDasharray="2,1" />

          {/* Canberra City Marker area */}
          <circle cx="50" cy="65" r="5" fill="#d6b3b9" />
          <text x="52" y="70" fontSize="3" fontFamily="serif" fill="#722f37" className="italic">Canberra</text>
          
          {/* Murrumbateman Region Text */}
          <text x="25" y="20" fontSize="4" fontFamily="serif" fill="#586940" className="uppercase tracking-widest opacity-60">Murrumbateman</text>
          
          {/* Lake George Region Text */}
          <text x="75" y="50" fontSize="4" fontFamily="serif" fill="#586940" className="uppercase tracking-widest opacity-60">Lake George</text>
          
          {/* Topography Lines (Decoration) */}
          <path d="M 0 50 Q 25 40 50 50 T 100 50" stroke="#d8d0b0" strokeWidth="0.2" fill="none" />
          <path d="M 0 60 Q 30 70 60 60 T 100 70" stroke="#d8d0b0" strokeWidth="0.2" fill="none" />
        </svg>

        {/* Markers */}
        {wineries.map((winery) => {
          const isActive = activeWinery?.id === winery.id;
          return (
            <button
              key={winery.id}
              onClick={(e) => {
                e.stopPropagation(); // Prevent drag interpreting as click
                onWinerySelect(winery);
              }}
              className={`absolute group z-10 focus:outline-none`}
              style={{ 
                left: `${winery.coordinates.x}%`, 
                top: `${winery.coordinates.y}%`,
                // Counter-scale the marker so it stays the same visual size while map zooms
                transform: `translate(-50%, -50%) scale(${1 / scale})`
              }}
            >
              <div className="relative flex flex-col items-center">
                
                <div className="relative">
                  {/* Pulse Effect for Active State */}
                  {isActive && (
                    <div className="absolute inset-0 -m-1 bg-wine-400 rounded-full animate-ping opacity-75"></div>
                  )}

                  {/* The Pin */}
                  <div className={`
                    relative p-2 rounded-full shadow-lg border-2 transition-all duration-300
                    ${isActive 
                      ? 'bg-wine-800 border-white z-20 ring-2 ring-wine-300' 
                      : 'bg-white border-wine-500 hover:bg-wine-100'}
                  `}
                  // Apply local scaling for active/hover state separate from zoom counter-scaling
                  style={{ transform: isActive ? 'scale(1.25)' : 'scale(1)' }}
                  >
                    <Wine 
                      className={`w-5 h-5 ${isActive ? 'text-white' : 'text-wine-700'}`} 
                    />
                  </div>
                </div>
                
                {/* Label (Always visible now) */}
                <div className={`
                  mt-2 px-4 py-1.5 rounded-full shadow-md text-xs font-bold whitespace-nowrap
                  transition-all duration-300 pointer-events-none border
                  ${isActive 
                    ? 'bg-wine-900 text-white border-wine-800 shadow-xl z-30' 
                    : 'bg-white/95 backdrop-blur-sm text-wine-900 border-wine-100'}
                `}
                style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }}
                >
                  {winery.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend / Compass */}
      <div className="absolute bottom-4 left-4 flex flex-col items-center opacity-50 pointer-events-none z-0">
        <div className="w-12 h-12 border-2 border-wine-900 rounded-full flex items-center justify-center relative">
          <span className="absolute top-1 text-[10px] font-bold text-wine-900">N</span>
          <div className="w-0.5 h-8 bg-wine-900"></div>
          <div className="w-6 h-0.5 bg-wine-900 absolute"></div>
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
         <button 
           onClick={handleZoomIn} 
           className="p-2 bg-white rounded-full shadow-md text-wine-900 hover:bg-wine-100 border border-wine-100 active:bg-wine-200 transition-colors"
           title="Zoom In"
         >
           <Plus className="w-5 h-5" />
         </button>
         <button 
           onClick={handleZoomOut} 
           className="p-2 bg-white rounded-full shadow-md text-wine-900 hover:bg-wine-100 border border-wine-100 active:bg-wine-200 transition-colors"
           title="Zoom Out"
         >
           <Minus className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};