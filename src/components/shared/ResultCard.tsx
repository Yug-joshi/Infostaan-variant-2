import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight, Bookmark } from 'lucide-react';
import { SearchResultItem } from '../../types';

interface ResultCardProps {
  item: SearchResultItem;
  onActionClick: (item: SearchResultItem) => void;
  isSaved?: boolean;
  onToggleSave?: (item: SearchResultItem) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ item, onActionClick, isSaved, onToggleSave }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article
      className="result-card-anim group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#0D1828] transition-all duration-200 shadow-sm border border-slate-200 dark:border-[#D3B5E8]/15 text-left overflow-hidden"
      data-category={item.category}
    >
      <div className="p-5 sm:p-6 pb-0">
        {/* Category & Region Metadata */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                item.tagColor === 'tertiary'
                  ? 'text-emerald-600 dark:text-[#51dcbc]'
                  : item.tagColor === 'secondary'
                  ? 'text-blue-600 dark:text-[#86cfff]'
                  : 'text-purple-600 dark:text-[#D3B5E8]'
              }`}
            >
              {item.badgeCategory}
            </span>
            <span className="text-slate-300 dark:text-[#8a919c] text-xs">•</span>
            <span className="text-xs text-slate-500 dark:text-[#A9B8CA]">{item.badgeSub}</span>
          </div>
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(item);
              }}
              className="text-slate-400 hover:text-[#007DCC] transition-colors p-1 -mr-1"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#007DCC] text-[#007DCC]' : ''}`} />
            </button>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F4F7FB] tracking-tight mb-1">
          {item.title}
        </h2>

        {/* Subtitle / Program Specs */}
        {item.subtitle && (
          <div className="text-slate-600 dark:text-[#A9B8CA] text-xs sm:text-sm mb-3">
            <span>{item.subtitle}</span>
          </div>
        )}

        {/* Why Relevant - Level 2 (always visible) */}
        <p className="text-sm text-slate-700 dark:text-[#F4F7FB] mb-4">
          <span className="font-semibold text-slate-900 dark:text-white mr-1.5">Relevant to your search:</span>
          {item.whyRelevant}
        </p>
      </div>

      {/* Expanded Content - Level 3 */}
      <div 
        className={`transition-all duration-300 ease-in-out px-5 sm:px-6 bg-slate-50 dark:bg-white/5 ${
          isExpanded ? 'grid-rows-[1fr] opacity-100 py-4 border-t border-slate-100 dark:border-white/10' : 'grid-rows-[0fr] opacity-0 h-0 overflow-hidden'
        }`}
        style={{ display: 'grid' }}
      >
        <div className="min-h-0 space-y-4">
          {/* We are faking detailed data using item properties for the demo */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Details & Context</h5>
            <div className="flex flex-wrap gap-2 mt-2">
              {item.meta.map((m, idx) => (
                <span key={idx} className="px-2 py-1 bg-white dark:bg-[#1a202b] text-slate-600 dark:text-[#A9B8CA] text-xs rounded border border-slate-200 dark:border-white/10">
                  {m}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-1">Action & Next Steps</h5>
            <p className="text-xs text-slate-600 dark:text-[#A9B8CA]">
              Click the button below to view the complete {item.category.slice(0, -1)} profile, including verified reviews and admission procedures.
            </p>
          </div>
        </div>
      </div>

      {/* Persistent Bottom Bar */}
      <div className="p-4 sm:p-5 mt-auto flex items-center justify-between border-t border-slate-100 dark:border-white/5">
        <button
          type="button"
          onClick={() => onActionClick(item)}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-white bg-[#007DCC] hover:bg-[#006cb0] px-4 py-2 rounded-lg transition-colors"
        >
          <span>{item.actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center focus:outline-none"
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Show less" : "Show more details"}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
    </article>
  );
};
