import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Briefcase, BookOpen, MonitorPlay, TrendingUp, Building2 } from 'lucide-react';

import laptopImg from '../assets/images/laptop.png';
import booksImg from '../assets/images/books.png';
import gradCapImg from '../assets/images/grad_cap.png';

gsap.registerPlugin(ScrollTrigger);

export const ScrollStorySection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Desktop refs
  const booksRef = useRef<HTMLImageElement>(null);
  const gradCapRef = useRef<HTMLImageElement>(null);
  const laptopRef = useRef<HTMLImageElement>(null);
  
  const text1Ref = useRef<HTMLDivElement>(null);
  const text2Ref = useRef<HTMLDivElement>(null);
  const text3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      // Desktop animations (pinning)
      mm.add("(min-width: 768px)", () => {
        // Initial States
        gsap.set([gradCapRef.current, laptopRef.current], { opacity: 0, scale: 0.5, x: 200 });
        gsap.set(booksRef.current, { opacity: 1, scale: 1, x: 0 });
        
        gsap.set([text2Ref.current, text3Ref.current], { opacity: 0, y: 50 });
        gsap.set(text1Ref.current, { opacity: 1, y: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=3000",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          }
        });

        // Phase 1 to Phase 2
        tl.to(text1Ref.current, { opacity: 0, y: -50, duration: 1 }, "+=0.5")
          .to(booksRef.current, { opacity: 0, scale: 0.5, x: -200, duration: 1 }, "<")
          .to(gradCapRef.current, { opacity: 1, scale: 1, x: 0, duration: 1 }, "<")
          .to(text2Ref.current, { opacity: 1, y: 0, duration: 1 }, "<")

        // Phase 2 to Phase 3
          .to(text2Ref.current, { opacity: 0, y: -50, duration: 1 }, "+=1")
          .to(gradCapRef.current, { opacity: 0, scale: 0.5, x: -200, duration: 1 }, "<")
          .to(laptopRef.current, { opacity: 1, scale: 1, x: 0, duration: 1 }, "<")
          .to(text3Ref.current, { opacity: 1, y: 0, duration: 1 }, "<")
          
        // Hold at end before unpinning
          .to({}, { duration: 0.5 });
      });
      
      // Mobile animations (simple fade in on scroll, no pinning)
      mm.add("(max-width: 767px)", () => {
        const mobileBlocks = document.querySelectorAll('.mobile-story-block');
        mobileBlocks.forEach((block) => {
          gsap.fromTo(block, 
            { opacity: 0, y: 50 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8, 
              ease: 'power2.out',
              scrollTrigger: {
                trigger: block,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      });

    }, containerRef); // Scope to container

    return () => ctx.revert();
  }, []);

  const glassClasses = "bg-white/40 dark:bg-[#070D18]/40 backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_8px_32px_0_rgba(0,125,204,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] rounded-3xl p-8 lg:p-12";

  return (
    <section ref={containerRef} className="relative w-full text-slate-900 dark:text-[#F4F7FB]">
      
      {/* ----------------- DESKTOP PINNED VIEW ----------------- */}
      <div className="hidden md:flex w-full h-screen items-center justify-center relative">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 h-full flex items-center gap-12 lg:gap-24">
          
          {/* Left: Images */}
          <div className="w-1/2 relative h-[500px] flex items-center justify-center">
            <img ref={booksRef} src={booksImg} alt="School and Junior College" className="absolute w-80 lg:w-[28rem] object-contain drop-shadow-2xl" />
            <img ref={gradCapRef} src={gradCapImg} alt="College and Degree" className="absolute w-80 lg:w-[28rem] object-contain drop-shadow-2xl" />
            <img ref={laptopRef} src={laptopImg} alt="Career and Jobs" className="absolute w-80 lg:w-[28rem] object-contain drop-shadow-2xl" />
          </div>

          {/* Right: Text Blocks */}
          <div className="w-1/2 relative h-[400px]">
            
            {/* Phase 1 Text */}
            <div ref={text1Ref} className={`absolute inset-0 flex flex-col justify-center ${glassClasses}`}>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-[#007DCC]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">
                School & Junior College
              </h2>
              <p className="text-slate-600 dark:text-[#A9B8CA] text-lg mb-6 leading-relaxed">
                Build your foundation. Discover the best schools and junior colleges in Mumbai. Compare institutions, explore streams, and find the perfect environment for early academic growth.
              </p>
              <div className="flex items-center gap-4 text-sm font-bold text-slate-500 dark:text-[#71839A]">
                <span className="flex items-center gap-1"><CheckIcon /> FYJC</span>
                <span className="flex items-center gap-1"><CheckIcon /> Coaching Classes</span>
                <span className="flex items-center gap-1"><CheckIcon /> Streams</span>
              </div>
            </div>

            {/* Phase 2 Text */}
            <div ref={text2Ref} className={`absolute inset-0 flex flex-col justify-center ${glassClasses}`}>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">
                College & Graduation
              </h2>
              <p className="text-slate-600 dark:text-[#A9B8CA] text-lg mb-6 leading-relaxed">
                Take the next big step. Access detailed cutoff data, specialized degree programs, and compare top-tier colleges across Mumbai to secure your admission.
              </p>
              <div className="flex items-center gap-4 text-sm font-bold text-slate-500 dark:text-[#71839A]">
                <span className="flex items-center gap-1"><CheckIcon /> Degrees</span>
                <span className="flex items-center gap-1"><CheckIcon /> Cutoffs</span>
                <span className="flex items-center gap-1"><CheckIcon /> Specializations</span>
              </div>
            </div>

            {/* Phase 3 Text */}
            <div ref={text3Ref} className={`absolute inset-0 flex flex-col justify-center ${glassClasses}`}>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                <Briefcase className="w-6 h-6" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">
                Career & Beyond
              </h2>
              <p className="text-slate-600 dark:text-[#A9B8CA] text-lg mb-6 leading-relaxed">
                Launch your professional life. Connect with industry experts for 1:1 guidance, discover high-growth internships, and navigate your way into a successful career.
              </p>
              <div className="flex items-center gap-4 text-sm font-bold text-slate-500 dark:text-[#71839A]">
                <span className="flex items-center gap-1"><CheckIcon /> Internships</span>
                <span className="flex items-center gap-1"><CheckIcon /> Jobs</span>
                <span className="flex items-center gap-1"><CheckIcon /> Mentorship</span>
              </div>
            </div>

          </div>
        </div>
      </div>


      {/* ----------------- MOBILE STACKED VIEW ----------------- */}
      <div className="md:hidden flex flex-col gap-16 px-4 py-16">
        
        {/* Mobile Phase 1 */}
        <div className={`mobile-story-block relative ${glassClasses} flex flex-col items-center text-center p-6`}>
          <img src={booksImg} alt="School" className="w-48 h-48 object-contain mb-6 drop-shadow-xl" />
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-[#007DCC]">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold mb-3">School & Junior College</h2>
          <p className="text-slate-600 dark:text-[#A9B8CA] text-sm mb-5">
            Build your foundation. Discover the best schools and junior colleges, compare streams, and find the perfect environment.
          </p>
        </div>

        {/* Mobile Phase 2 */}
        <div className={`mobile-story-block relative ${glassClasses} flex flex-col items-center text-center p-6`}>
          <img src={gradCapImg} alt="College" className="w-48 h-48 object-contain mb-6 drop-shadow-xl" />
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold mb-3">College & Graduation</h2>
          <p className="text-slate-600 dark:text-[#A9B8CA] text-sm mb-5">
            Take the next big step. Access cutoff data, degree programs, and compare top-tier colleges.
          </p>
        </div>

        {/* Mobile Phase 3 */}
        <div className={`mobile-story-block relative ${glassClasses} flex flex-col items-center text-center p-6`}>
          <img src={laptopImg} alt="Career" className="w-48 h-48 object-contain mb-6 drop-shadow-xl" />
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold mb-3">Career & Beyond</h2>
          <p className="text-slate-600 dark:text-[#A9B8CA] text-sm mb-5">
            Launch your professional life. Connect with industry experts, discover high-growth internships, and navigate your career.
          </p>
        </div>

      </div>

    </section>
  );
};

// Helper for checkmarks
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#007DCC] dark:text-[#19A7E8]">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
