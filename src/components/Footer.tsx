import React from 'react';
import { ScreenType } from '../types';

interface FooterProps {
  onSelectCategory?: (category: string) => void;
  onNavigate?: (screen: ScreenType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCategory, onNavigate }) => {
  return (
    <footer className="w-full bg-[#161c27]/80 border-t border-[#D3B5E8]/15 py-10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-[#A9B8CA]">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-semibold tracking-wider uppercase text-[#F4F7FB] text-xs">Infostaan</span>
          <p className="text-xs text-[#A9B8CA]/70">
            Infostaan • Dedicated to students across Mumbai
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
          <button
            onClick={() => onSelectCategory?.('colleges')}
            className="hover:text-[#F4F7FB] transition-colors"
          >
            Colleges
          </button>
          <button
            onClick={() => onSelectCategory?.('courses')}
            className="hover:text-[#F4F7FB] transition-colors"
          >
            Courses
          </button>
          <button
            onClick={() => onSelectCategory?.('careers')}
            className="hover:text-[#F4F7FB] transition-colors"
          >
            Careers
          </button>
          <button
            onClick={() => onSelectCategory?.('internships')}
            className="hover:text-[#F4F7FB] transition-colors"
          >
            Internships
          </button>
          <button
            onClick={() => onNavigate?.('guidance')}
            className="hover:text-[#F4F7FB] transition-colors"
          >
            Guidance
          </button>
        </div>
      </div>
    </footer>
  );
};
