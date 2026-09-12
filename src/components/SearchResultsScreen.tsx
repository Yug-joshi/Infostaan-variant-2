import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Check } from 'lucide-react';
import { CategoryType, ScreenType, SearchResultItem } from '../types';
import { ALL_SEARCH_RESULTS } from '../data/mockData';

interface SearchResultsScreenProps {
  initialQuery: string;
  initialCategory?: string;
  onNavigate: (screen: ScreenType) => void;
  onSelectCollege: (collegeId: string) => void;
  onSaveItem?: (item: SearchResultItem) => void;
  savedItemIds?: string[];
}

export const SearchResultsScreen: React.FC<SearchResultsScreenProps> = ({
  initialQuery,
  initialCategory = 'all',
  onNavigate,
  onSelectCollege,
  onSaveItem,
  savedItemIds = [],
}) => {
  const [query, setQuery] = useState(initialQuery || 'finance');
  const [activeCategory, setActiveCategory] = useState<CategoryType>(
    (initialCategory as CategoryType) || 'all'
  );

  // Filter items
  const filteredResults = useMemo(() => {
    return ALL_SEARCH_RESULTS.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      const normalizedQuery = query.toLowerCase().trim();
      if (!normalizedQuery) return matchesCategory;
      const matchesText =
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.badgeSub.toLowerCase().includes(normalizedQuery) ||
        item.whyRelevant.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesText;
    });
  }, [query, activeCategory]);

  const counts = useMemo(() => {
    return {
      all: ALL_SEARCH_RESULTS.length,
      colleges: ALL_SEARCH_RESULTS.filter((i) => i.category === 'colleges').length,
      courses: ALL_SEARCH_RESULTS.filter((i) => i.category === 'courses').length,
      careers: ALL_SEARCH_RESULTS.filter((i) => i.category === 'careers').length,
      internships: ALL_SEARCH_RESULTS.filter((i) => i.category === 'internships').length,
    };
  }, []);

  const handleActionClick = (item: SearchResultItem) => {
    if (item.category === 'colleges') {
      onSelectCollege(item.collegeId || 'mithibai');
    } else {
      // Show confirmation or feedback
      onNavigate('guidance');
    }
  };

  return (
    <main className="w-full pt-16 bg-[#070D18] min-h-screen">
      <section className="w-full py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-0 flex flex-col gap-8">
          {/* Search Header and Filter Bar */}
          <div className="flex flex-col gap-6">
            {/* Input Bar */}
            <div className="relative flex items-center w-full bg-[#161c27] rounded-xl px-4 py-2.5 shadow-md transition-all focus-within:bg-[#1a202b] border border-[#D3B5E8]/10 focus-within:border-[#007DCC]">
              <Search className="text-[#9ccaff] mr-3 w-5 h-5 shrink-0" />
              <input
                aria-label="Search opportunities, courses, and institutions in Mumbai"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search colleges, courses, careers, internships..."
                className="w-full bg-transparent font-semibold text-base sm:text-lg text-[#F4F7FB] placeholder:text-[#A9B8CA]/60 focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  title="Clear search"
                  className="flex items-center justify-center p-1 text-[#A9B8CA] hover:text-[#F4F7FB] rounded-full transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none" role="tablist">
                {[
                  { id: 'all', label: 'All', count: counts.all },
                  { id: 'colleges', label: 'Colleges', count: counts.colleges },
                  { id: 'courses', label: 'Courses', count: counts.courses },
                  { id: 'careers', label: 'Careers', count: counts.careers },
                  { id: 'internships', label: 'Internships', count: counts.internships },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id as CategoryType)}
                    className={`filter-tab px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center ${
                      activeCategory === tab.id
                        ? 'bg-[#1a202b] text-[#9ccaff] shadow-sm'
                        : 'text-[#A9B8CA] hover:text-[#F4F7FB] hover:bg-[#161c27]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[#A9B8CA]/80 ml-1.5 font-normal">{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status text */}
            <p className="text-xs sm:text-sm text-[#A9B8CA] tracking-wide">
              Showing what's relevant for {query ? `"${query}"` : 'all programs'} in Mumbai.
            </p>
          </div>

          {/* Results List */}
          <div className="flex flex-col gap-5" id="results-list">
            {filteredResults.length === 0 ? (
              <div className="p-10 text-center rounded-xl bg-[#161c27] text-[#A9B8CA]">
                <p className="text-base font-medium text-[#F4F7FB] mb-1">No exact matches found</p>
                <p className="text-sm">Try searching for "colleges", "finance", "CA", or "internship"</p>
                <button
                  onClick={() => {
                    setQuery('finance');
                    setActiveCategory('all');
                  }}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#007DCC] text-white text-sm font-medium hover:bg-[#19A7E8]"
                >
                  Reset to Finance
                </button>
              </div>
            ) : (
              filteredResults.map((item) => (
                <article
                  key={item.id}
                  className="group relative flex flex-col p-5 sm:p-6 rounded-xl bg-[#161c27] hover:bg-[#1a202b] transition-all duration-300 shadow-sm border border-[#D3B5E8]/10 hover:border-[#D3B5E8]/30"
                  data-category={item.category}
                >
                  {/* Category & Region Metadata */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider ${
                        item.tagColor === 'tertiary'
                          ? 'text-[#51dcbc]'
                          : item.tagColor === 'secondary'
                          ? 'text-[#86cfff]'
                          : 'text-[#D3B5E8]'
                      }`}
                    >
                      {item.badgeCategory}
                    </span>
                    <span className="text-[#8a919c] text-xs">•</span>
                    <span className="text-xs sm:text-sm text-[#A9B8CA]">{item.badgeSub}</span>
                  </div>

                  {/* Title */}
                  <h2
                    onClick={() => handleActionClick(item)}
                    className="text-xl sm:text-2xl font-semibold text-[#F4F7FB] tracking-tight mb-2 group-hover:text-[#9ccaff] transition-colors cursor-pointer"
                  >
                    {item.title}
                  </h2>

                  {/* Subtitle / Program Specs */}
                  {item.subtitle && (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#A9B8CA] text-xs sm:text-sm mb-3">
                      <span>{item.subtitle}</span>
                    </div>
                  )}

                  {/* Why Relevant High-Contrast Callout Box */}
                  <div className="p-3 bg-[#070D18] rounded-lg mb-4 border border-[#D3B5E8]/10">
                    <p className="text-sm text-[#F4F7FB] leading-relaxed">
                      <span
                        className={`font-semibold mr-1.5 ${
                          item.tagColor === 'tertiary' ? 'text-[#51dcbc]' : 'text-[#9ccaff]'
                        }`}
                      >
                        Why relevant:
                      </span>
                      {item.whyRelevant}
                    </p>
                  </div>

                  {/* Meta Strip & Action Link */}
                  <div className="flex items-center justify-between pt-1 flex-wrap gap-3">
                    <div className="flex items-center gap-2 text-[#A9B8CA] text-xs sm:text-sm">
                      {item.meta.map((m, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span className="text-[#8a919c] text-[10px]">•</span>}
                          <span>{m}</span>
                        </React.Fragment>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleActionClick(item)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#9ccaff] group-hover:text-white transition-colors"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Decision Catalyst Banner at Bottom */}
          <div className="mt-6 p-8 sm:p-10 rounded-xl bg-[#1a202b] text-center flex flex-col items-center justify-center gap-3 shadow-sm border border-[#D3B5E8]/15">
            <p className="text-base sm:text-lg text-[#A9B8CA] font-medium">
              Not sure which finance path fits you?
            </p>
            <button
              type="button"
              onClick={() => onNavigate('guidance')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#003257] bg-[#9ccaff] hover:bg-[#d0e4ff] px-6 py-2.5 rounded-lg transition-colors shadow-sm active:scale-95"
            >
              <span>Help Me Decide in 2 mins</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};
