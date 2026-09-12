import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, SlidersHorizontal } from 'lucide-react';
import { ScreenType } from '../types';

interface HomeScreenProps {
  onSearch: (query: string, category?: string) => void;
  onNavigate: (screen: ScreenType) => void;
  onSelectCollege: (collegeId: string) => void;
  onOpenPreferences: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSearch,
  onNavigate,
  onSelectCollege,
  onOpenPreferences,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    } else {
      onSearch('finance');
    }
  };

  const handleQuickSearch = (text: string) => {
    setQuery(text);
    onSearch(text);
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-16 sm:pt-20 pb-24 flex flex-col items-center">
      {/* Central Search Section */}
      <div className="w-full text-center mb-10 sm:mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F4F7FB] mb-4 leading-tight">
          What are you looking for?
        </h1>
        <p className="text-base sm:text-lg text-[#A9B8CA] max-w-xl mx-auto font-normal">
          Tell us what you want, and Infostaan figures out what's relevant in Mumbai.
        </p>

        {/* Spacious Search Input Box */}
        <form onSubmit={handleSubmit} className="mt-8 sm:mt-9 relative w-full group">
          <div className="relative flex items-center bg-[#0D1828] border border-[#D3B5E8]/15 rounded-2xl shadow-2xl transition-all duration-300 focus-within:border-[#007DCC] focus-within:ring-1 focus-within:ring-[#007DCC]/40 px-5 py-2">
            <Search className="text-[#A9B8CA] w-6 h-6 pointer-events-none select-none shrink-0" />
            <input
              id="main-query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search colleges, courses, careers, internships..."
              className="w-full bg-transparent py-4 pl-4 pr-14 text-base sm:text-lg text-[#F4F7FB] placeholder:text-[#A9B8CA]/60 border-none outline-none focus:ring-0"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-3.5 w-11 h-11 flex items-center justify-center rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white transition-all shadow-md active:scale-95"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>

        {/* Natural Soft Examples */}
        <div className="mt-4 flex items-center justify-center text-xs sm:text-sm text-[#A9B8CA]/80 gap-2 flex-wrap">
          <span className="font-medium text-[#A9B8CA]">Try:</span>
          <button
            type="button"
            onClick={() => handleQuickSearch('B.Com colleges near Churchgate')}
            className="hover:text-[#F4F7FB] underline decoration-[#A9B8CA]/40 transition-colors"
          >
            B.Com colleges near Churchgate
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handleQuickSearch('Finance internships')}
            className="hover:text-[#F4F7FB] underline decoration-[#A9B8CA]/40 transition-colors"
          >
            Finance internships
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => handleQuickSearch('CA coaching')}
            className="hover:text-[#F4F7FB] underline decoration-[#A9B8CA]/40 transition-colors"
          >
            CA coaching
          </button>
        </div>

        {/* Discovery Shortcuts: 4 clean, minimal pill buttons */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
          {['Colleges', 'Courses', 'Careers', 'Internships'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onSearch('', item.toLowerCase())}
              className="px-5 py-2.5 rounded-full bg-[#0D1828] hover:bg-[#122033] border border-[#D3B5E8]/15 text-[#F4F7FB] text-sm font-medium transition-all hover:border-[#D3B5E8]/40 hover:-translate-y-0.5 active:scale-95"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Calm "Help Me Decide" Invite Card */}
      <div className="w-full bg-[#091540] border border-[#D3B5E8]/20 rounded-2xl p-6 sm:p-9 my-6 sm:my-8 shadow-xl relative overflow-hidden transition-all hover:border-[#D3B5E8]/35">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="max-w-md">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#F4F7FB] mb-2 flex items-center gap-2">
              <span>Not sure where to start?</span>
            </h2>
            <p className="text-sm sm:text-base text-[#A9B8CA] leading-relaxed">
              Let's figure it out together in 2 minutes. We'll recommend paths calibrated to your current stage and goals.
            </p>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('guidance')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#007DCC] hover:bg-[#006cb0] text-white text-sm font-semibold transition-all shadow-md group active:scale-95"
            >
              <span>Help Me Decide</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Relevant Next Step (Open, gentle list with human reasoning) */}
      <div className="w-full mt-6 sm:mt-10">
        <div className="mb-5 flex items-baseline justify-between border-b border-[#D3B5E8]/15 pb-3">
          <div>
            <h3 className="text-base font-semibold text-[#F4F7FB]">Based on what you've explored</h3>
            <p className="text-xs sm:text-sm text-[#A9B8CA] mt-0.5">Commerce & Finance in Mumbai</p>
          </div>
          <button
            type="button"
            onClick={onOpenPreferences}
            className="text-xs sm:text-sm text-[#A9B8CA] hover:text-[#F4F7FB] transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal size={13} />
            <span>Edit preferences</span>
          </button>
        </div>

        {/* Clean recommendation list items */}
        <div className="flex flex-col gap-3">
          {/* Recommendation Row 1: NMIMS / Mithibai */}
          <div className="w-full bg-[#0D1828] border border-[#D3B5E8]/15 hover:border-[#D3B5E8]/30 rounded-xl p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#D3B5E8] font-medium">College Path</span>
                <span className="text-xs text-[#A9B8CA]">• Vile Parle West</span>
              </div>
              <h4
                onClick={() => onSelectCollege('mithibai')}
                className="text-base sm:text-lg font-semibold text-[#F4F7FB] group-hover:text-[#9ccaff] transition-colors cursor-pointer"
              >
                NMIMS — School of Commerce
              </h4>
              <p className="text-sm text-[#A9B8CA] leading-relaxed">
                Recommended because you showed interest in undergraduate management and corporate finance programs near Western Mumbai.
              </p>
            </div>
            <div className="shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={() => onSelectCollege('mithibai')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#007DCC] group-hover:text-white transition-colors"
              >
                <span>View details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recommendation Row 2: Motilal Oswal */}
          <div className="w-full bg-[#0D1828] border border-[#D3B5E8]/15 hover:border-[#D3B5E8]/30 rounded-xl p-5 sm:p-6 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
            <div className="space-y-1.5 max-w-lg">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#D3B5E8] font-medium">Internship Opportunity</span>
                <span className="text-xs text-[#A9B8CA]">• Motilal Oswal Financial Services</span>
              </div>
              <h4
                onClick={() => onSearch('finance')}
                className="text-base sm:text-lg font-semibold text-[#F4F7FB] group-hover:text-[#9ccaff] transition-colors cursor-pointer"
              >
                Equity Research Trainee
              </h4>
              <p className="text-sm text-[#A9B8CA] leading-relaxed">
                Recommended because it aligns with your finance pathway and offers hands-on valuation mentoring in Malad West.
              </p>
            </div>
            <div className="shrink-0 pt-2 sm:pt-0">
              <button
                type="button"
                onClick={() => onSearch('finance', 'internships')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#007DCC] group-hover:text-white transition-colors"
              >
                <span>View details</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
