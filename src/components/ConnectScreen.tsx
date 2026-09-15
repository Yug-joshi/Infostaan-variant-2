import React, { useEffect, useRef } from 'react';
import { Briefcase, Clock, IndianRupee, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import gsap from 'gsap';

interface ConnectScreenProps {
  onNavigate: (path: string) => void;
}

export const ConnectScreen: React.FC<ConnectScreenProps> = ({ onNavigate }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (containerRef.current) {
        gsap.fromTo(
          containerRef.current.children,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const mentors = [
    {
      id: '1',
      name: 'Rohan Sharma',
      role: 'Investment Banker',
      company: 'Top Tier Bank',
      experience: '5+ Years',
      price: 499,
      tags: ['Finance', 'Interviews', 'Networking'],
    },
    {
      id: '2',
      name: 'Priya Patel',
      role: 'Chartered Accountant',
      company: 'Big 4 Audit Firm',
      experience: '3+ Years',
      price: 399,
      tags: ['Articleship', 'CA Exams', 'Audit'],
    },
    {
      id: '3',
      name: 'Aditya Desai',
      role: 'Software Engineer',
      company: 'Leading Tech MNC',
      experience: '4+ Years',
      price: 499,
      tags: ['Tech Placement', 'DSA', 'Resume Review'],
    },
    {
      id: '4',
      name: 'Neha Gupta',
      role: 'Management Consultant',
      company: 'MBB Firm',
      experience: '2+ Years',
      price: 599,
      tags: ['Case Prep', 'Consulting', 'B-School'],
    }
  ];

  return (
    <main className="w-full flex-1 pt-24 sm:pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      <div ref={containerRef} className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/40 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold tracking-wider uppercase mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Infostaan Connect</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-[#F4F7FB] mb-6">
            1:1 Guidance from Industry Experts
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
            Don't guess your career roadmap. Book a paid 1:1 session with working professionals in Mumbai to get authentic, actionable advice on placements, exams, and articleships.
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((mentor) => (
            <div 
              key={mentor.id}
              className="bg-white dark:bg-[#0D1828] rounded-2xl border border-slate-200 dark:border-[#D3B5E8]/15 hover:border-[#007DCC] transition-colors shadow-sm hover:shadow-md p-6 flex flex-col h-full"
            >
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#161c27] flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-slate-500 dark:text-[#A9B8CA]">
                    {mentor.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-[#F4F7FB] leading-tight">
                    {mentor.name}
                  </h3>
                  <p className="text-xs text-[#007DCC] dark:text-[#86cfff] font-medium mt-0.5">
                    {mentor.role}
                  </p>
                </div>
              </div>

              {/* Work Info */}
              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#A9B8CA]">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>{mentor.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-[#A9B8CA]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{mentor.experience} Exp.</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mentor.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-[#161c27] text-slate-600 dark:text-[#A9B8CA]">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Pricing & CTA */}
              <div className="pt-5 border-t border-slate-100 dark:border-white/5 mt-auto">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider font-semibold">30 Min Session</span>
                  <div className="flex items-center font-bold text-slate-900 dark:text-[#F4F7FB]">
                    <IndianRupee className="w-4 h-4" />
                    <span>{mentor.price}</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={() => onNavigate('/search?category=internships')}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Book Session</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* How it works section */}
        <div className="mt-20 p-8 sm:p-10 rounded-2xl bg-slate-50 dark:bg-[#161c27] border border-slate-200 dark:border-white/5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-[#F4F7FB] mb-8 text-center">
            How Infostaan Connect Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-[#0D1828] shadow-sm flex items-center justify-center text-[#007DCC] dark:text-[#86cfff]">
                <span className="font-bold">1</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-[#F4F7FB]">Choose a Mentor</h3>
              <p className="text-sm text-slate-500 dark:text-[#A9B8CA]">Select an industry professional who aligns with your target career path.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-[#0D1828] shadow-sm flex items-center justify-center text-[#007DCC] dark:text-[#86cfff]">
                <span className="font-bold">2</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-[#F4F7FB]">Book a Time</h3>
              <p className="text-sm text-slate-500 dark:text-[#A9B8CA]">Pay securely and schedule a 30-minute virtual session that fits your routine.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-white dark:bg-[#0D1828] shadow-sm flex items-center justify-center text-[#007DCC] dark:text-[#86cfff]">
                <span className="font-bold">3</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-[#F4F7FB]">Get Clarity</h3>
              <p className="text-sm text-slate-500 dark:text-[#A9B8CA]">Get your resume reviewed, ask questions, and build your career roadmap.</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};
