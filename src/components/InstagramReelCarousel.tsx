import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  Eye,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { INSTAGRAM_REELS, ReelItem, OFFICIAL_YOUTUBE_URL } from '../data/instagramReels';

export const InstagramReelCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showPlayStateFlash, setShowPlayStateFlash] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const total = INSTAGRAM_REELS.length;
  const activeReel = INSTAGRAM_REELS[activeIndex];

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    setIsPlaying(true);
    setProgress(0);
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
    setIsPlaying(true);
    setProgress(0);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Video playback coordination
  useEffect(() => {
    // Pause and reset all non-active videos
    Object.entries(videoRefs.current).forEach(([id, vid]) => {
      const videoEl = vid as HTMLVideoElement | null;
      if (videoEl && id !== activeReel.id) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });

    const activeVideo = videoRefs.current[activeReel.id];
    if (activeVideo) {
      activeVideo.muted = isMuted;
      if (isPlaying) {
        const p = activeVideo.play();
        if (p !== undefined) {
          p.catch((err) => {
            console.log('Video autoplay note:', err);
          });
        }
      } else {
        activeVideo.pause();
      }
    }
  }, [activeIndex, isPlaying, isMuted, activeReel.id]);

  // Pause active video when section moves off-screen
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const activeVideo = videoRefs.current[activeReel.id];
        if (!entry.isIntersecting) {
          if (activeVideo && !activeVideo.paused) {
            activeVideo.pause();
          }
        } else if (isPlaying && activeVideo) {
          activeVideo.play().catch(() => {});
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [activeReel.id, isPlaying]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    setShowPlayStateFlash(true);
    setTimeout(() => setShowPlayStateFlash(false), 600);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted((prev) => {
      const nextMuted = !prev;
      const activeVideo = videoRefs.current[activeReel.id];
      if (activeVideo) {
        activeVideo.muted = nextMuted;
      }
      return nextMuted;
    });
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const activeVideo = videoRefs.current[activeReel.id];
    if (activeVideo) {
      activeVideo.currentTime = 0;
      activeVideo.play().catch(() => {});
      setIsPlaying(true);
      setProgress(0);
    }
  };

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    setTouchDeltaX(e.touches[0].clientX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    if (touchDeltaX < -45) {
      handleNext();
    } else if (touchDeltaX > 45) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Helper to calculate relative distance for looping carousel
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;
    return diff;
  };

  return (
    <section
      ref={sectionRef}
      className="w-full py-12 bg-gradient-to-b from-transparent via-slate-50/50 to-transparent dark:via-white/[0.02] text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200 select-none overflow-hidden relative"
      aria-label="Student Guidance Reels"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-extrabold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>STUDENT REELS & GUIDES</span>
          </div>

          <p className="text-xs sm:text-base text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
            Real advice, FYJC realities, and Mumbai college guidance in 60 seconds.
          </p>
        </div>

        {/* Carousel Viewport (Center focused card with peeking adjacent cards) */}
        <div
          className="relative w-full max-w-4xl mx-auto h-[460px] sm:h-[520px] md:h-[560px] flex items-center justify-center touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Desktop Navigation Chevrons */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous reel"
            className="hidden sm:flex absolute left-2 md:left-4 z-30 w-11 h-11 rounded-full bg-white/90 dark:bg-[#141E2E]/90 border border-slate-200 dark:border-white/10 shadow-lg items-center justify-center text-slate-700 dark:text-white hover:bg-white dark:hover:bg-[#1E293B] hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next reel"
            className="hidden sm:flex absolute right-2 md:right-4 z-30 w-11 h-11 rounded-full bg-white/90 dark:bg-[#141E2E]/90 border border-slate-200 dark:border-white/10 shadow-lg items-center justify-center text-slate-700 dark:text-white hover:bg-white dark:hover:bg-[#1E293B] hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Reel Cards Track */}
          <div className="relative w-full h-full flex items-center justify-center">
            {INSTAGRAM_REELS.map((reel, index) => {
              const offset = getOffset(index);
              const isActive = offset === 0;
              const isPrev = offset === -1;
              const isNext = offset === 1;
              const isVisible = Math.abs(offset) <= 1;

              if (!isVisible) return null;

              let opacityStyle = 0;
              let zIndex = 10;

              if (isActive) {
                opacityStyle = 1;
                zIndex = 20;
              } else if (isPrev || isNext) {
                opacityStyle = 0.55;
                zIndex = 10;
              }

              return (
                <div
                  key={reel.id}
                  onClick={() => {
                    if (isPrev) handlePrev();
                    else if (isNext) handleNext();
                    else togglePlayPause();
                  }}
                  style={{
                    opacity: opacityStyle,
                    zIndex,
                  }}
                  className={`absolute w-[240px] sm:w-[270px] md:w-[290px] h-[420px] sm:h-[480px] md:h-[510px] rounded-3xl overflow-hidden transition-all duration-300 ease-out cursor-pointer shadow-xl ${
                    isActive
                      ? 'ring-2 ring-amber-400/50 shadow-2xl shadow-amber-500/10 translate-x-0 scale-100'
                      : isPrev
                      ? '-translate-x-[68%] sm:-translate-x-[64%] scale-[0.88] hover:opacity-75 filter blur-[0.3px]'
                      : 'translate-x-[68%] sm:translate-x-[64%] scale-[0.88] hover:opacity-75 filter blur-[0.3px]'
                  }`}
                >
                  {/* Media Container: Real Playable Video for Active Reel */}
                  <div className="relative w-full h-full bg-slate-950">
                    {/* Top Progress Bar for Active Playing Video */}
                    {isActive && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 transition-all duration-100 ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}

                    {isActive ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[reel.id] = el;
                        }}
                        src={reel.videoUrl}
                        poster={reel.coverImage}
                        playsInline
                        loop
                        muted={isMuted}
                        autoPlay
                        preload="auto"
                        onTimeUpdate={(e) => {
                          const v = e.currentTarget;
                          if (v.duration) {
                            setProgress((v.currentTime / v.duration) * 100);
                          }
                        }}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                    ) : (
                      <img
                        src={reel.coverImage}
                        alt={reel.title}
                        className="w-full h-full object-cover select-none pointer-events-none"
                      />
                    )}

                    {/* Gradient Vignette Overlays for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

                    {/* Top Bar: Author & Duration */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between text-white z-10 pointer-events-none">
                      <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[11px] font-bold tracking-tight">
                          {reel.author.name}
                        </span>
                      </div>

                      {reel.durationText && (
                        <span className="text-[10px] font-semibold bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                          {reel.durationText}
                        </span>
                      )}
                    </div>

                    {/* Center Play/Pause Flash Overlay */}
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div
                          className={`w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all duration-300 ${
                            !isPlaying || showPlayStateFlash
                              ? 'opacity-100 scale-100'
                              : 'opacity-0 scale-90'
                          }`}
                        >
                          {isPlaying ? (
                            <Pause className="w-6 h-6 fill-white" />
                          ) : (
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bottom Content Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10 flex flex-col gap-2.5">
                      {/* Tag & Views */}
                      <div className="flex items-center gap-2 text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                        <span>{reel.tag}</span>
                        {reel.views && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-white/40" />
                            <span className="flex items-center gap-1 text-slate-300 normal-case font-medium">
                              <Eye className="w-3 h-3" />
                              {reel.views}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Reel Title / Caption */}
                      <p className="text-xs sm:text-sm font-bold line-clamp-2 leading-snug drop-shadow-sm text-left">
                        {reel.title}
                      </p>

                      {/* Native Player Controls Bar (No external links) */}
                      {isActive && (
                        <div className="pt-1 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlayPause();
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                          >
                            {isPlaying ? (
                              <>
                                <Pause className="w-3.5 h-3.5 fill-white" />
                                <span>Pause</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Play</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={toggleMute}
                            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white transition-colors cursor-pointer"
                          >
                            {isMuted ? (
                              <VolumeX className="w-4 h-4 text-amber-400" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-emerald-400" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleReplay}
                            aria-label="Replay video"
                            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/15 text-white transition-colors cursor-pointer"
                          >
                            <RotateCcw className="w-4 h-4 text-slate-200" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Navigation Indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {INSTAGRAM_REELS.map((reel, idx) => (
            <button
              key={reel.id}
              type="button"
              onClick={() => {
                setActiveIndex(idx);
                setIsPlaying(true);
              }}
              aria-label={`Go to reel ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx
                  ? 'w-7 bg-amber-500'
                  : 'w-2 bg-slate-300 dark:bg-white/20 hover:bg-slate-400 dark:hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Official YouTube Channel CTA */}
        <div className="flex justify-center mt-6 sm:mt-7">
          <a
            href={OFFICIAL_YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-red-600/10 hover:bg-red-600/15 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs sm:text-sm font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-xs group"
            aria-label="Visit our official YouTube channel (opens in new tab)"
          >
            <Youtube className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};
