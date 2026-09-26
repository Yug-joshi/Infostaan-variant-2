import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#161c27]/80 border-t border-slate-200 dark:border-[#D3B5E8]/15 py-10 transition-colors duration-200">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-600 dark:text-[#A9B8CA]">
        <Link
            id="footer-logo-btn"
            to="/"
            className="flex flex-col gap-1 text-center md:text-left hover:opacity-85 transition-opacity cursor-pointer focus:outline-none"
            aria-label="Go to Infostaan Mumbai homepage"
          >
            <span className="font-semibold tracking-wider uppercase text-slate-900 dark:text-[#F4F7FB] text-xs">Infostaan</span>
            <p className="text-xs text-slate-500 dark:text-[#A9B8CA]/70">
              Infostaan • Dedicated to students across Mumbai
            </p>
        </Link>

        <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
          <Link
            to="/colleges"
            className="text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] transition-colors"
          >
            Colleges
          </Link>
          <Link
            to="/courses"
            className="text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] transition-colors"
          >
            Courses
          </Link>
          <Link
            to="/careers"
            className="text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] transition-colors"
          >
            Careers
          </Link>
          <Link
            to="/help-me-decide"
            className="text-slate-600 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F4F7FB] transition-colors"
          >
            Guidance & Roadmap
          </Link>
        </div>
      </div>
    </footer>
  );
};
