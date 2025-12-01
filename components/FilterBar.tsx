import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ChevronDown, Check, Filter } from 'lucide-react';

interface FilterBarProps {
  availableVarieties: string[];
  selectedVarieties: string[];
  onToggleVariety: (variety: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
  onSearchSubmit: () => void; // New prop
}

export const FilterBar: React.FC<FilterBarProps> = ({
  availableVarieties,
  selectedVarieties,
  onToggleVariety,
  searchTerm,
  onSearchChange,
  onClearFilters,
  onSearchSubmit
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          onSearchSubmit();
      }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 py-2 animate-fade-in z-20">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-wine-300" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search wineries OR 'Shiraz under $40'..."
          className="block w-full pl-10 pr-3 py-2 border border-wine-100 rounded-lg leading-5 bg-white placeholder-wine-300 focus:outline-none focus:ring-1 focus:ring-wine-500 focus:border-wine-500 sm:text-sm shadow-sm transition-all"
        />
        {searchTerm && (
           <button 
             onClick={() => onSearchChange('')}
             className="absolute inset-y-0 right-0 pr-3 flex items-center text-wine-300 hover:text-wine-500"
           >
             <X className="w-4 h-4" />
           </button>
        )}
      </div>

      {/* Dropdown Filter */}
      <div className="relative min-w-[220px]" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-2 border rounded-lg text-sm font-medium shadow-sm transition-all bg-white
            ${isOpen ? 'border-wine-500 ring-1 ring-wine-500' : 'border-wine-100 hover:border-wine-300'}
            ${selectedVarieties.length > 0 ? 'text-wine-900' : 'text-gray-500'}
          `}
        >
          <div className="flex items-center gap-2 truncate">
            <Filter className="w-4 h-4" />
            <span className="truncate">
              {selectedVarieties.length === 0 
                ? "Filter by Variety" 
                : `${selectedVarieties.length} Selected`}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full mt-1 w-full bg-white border border-wine-100 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50 custom-scrollbar animate-fade-in">
            <div className="p-1">
              {availableVarieties.map((variety) => {
                const isSelected = selectedVarieties.includes(variety);
                return (
                  <button
                    key={variety}
                    onClick={() => onToggleVariety(variety)}
                    className={`
                      w-full flex items-center justify-between px-3 py-2 text-sm text-left rounded-md transition-colors
                      ${isSelected ? 'bg-wine-50 text-wine-900 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                    `}
                  >
                    <span>{variety}</span>
                    {isSelected && <Check className="w-4 h-4 text-wine-700" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* Global Clear */}
      {(searchTerm || selectedVarieties.length > 0) && (
        <button 
            onClick={onClearFilters}
            className="self-center text-xs text-wine-500 hover:text-wine-700 underline px-2 whitespace-nowrap"
        >
            Reset All
        </button>
      )}
    </div>
  );
};
