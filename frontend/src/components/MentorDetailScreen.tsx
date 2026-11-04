import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Clock,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Video,
  Star,
  Sparkles,
  Check,
} from 'lucide-react';
import { MENTORS_DATA, Mentor } from '../data/mentorsData';

interface MentorDetailScreenProps {
  onNavigate: (path: string) => void;
}

export const MentorDetailScreen: React.FC<MentorDetailScreenProps> = ({ onNavigate }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mentor: Mentor =
    MENTORS_DATA.find((m) => m.id === id) || MENTORS_DATA[0];

  const [selectedSlot, setSelectedSlot] = useState<string>(mentor.availableSlots[0]);
  const [isBooked, setIsBooked] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mentor.availableSlots.length > 0) {
      setSelectedSlot(mentor.availableSlots[0]);
    }
  }, [id, mentor]);

  const handleBooking = () => {
    setIsBooked(true);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <main className="w-full pt-20 sm:pt-24 pb-20 bg-slate-50 dark:bg-[#070D18] min-h-screen text-slate-900 dark:text-[#F4F7FB] transition-colors duration-200">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl bg-slate-900 dark:bg-[#1a202b] text-white shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-bold">Session Confirmed!</p>
            <p className="text-xs text-slate-300">
              One on One session booked with {mentor.name} ({selectedSlot}).
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-[#0D1828] text-slate-700 dark:text-[#A9B8CA] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-[#161c27] text-xs sm:text-sm font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Mentors</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Infostaan Verified Mentor</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          {/* Left 2 Cols: Mentor Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mentor Profile Hero Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative shrink-0">
                <img
                  src={mentor.avatar}
                  alt={mentor.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-[#007DCC]/20"
                />
                {mentor.online && (
                  <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold tracking-wider uppercase ring-2 ring-white dark:ring-[#0D1828]">
                    Online
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-[#007DCC] dark:text-[#86cfff] text-xs font-bold">
                    {mentor.area}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-[#A9B8CA] text-xs font-medium">
                    {mentor.experience} Experience
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-[#F4F7FB]">
                  {mentor.name}
                </h1>

                <p className="text-sm font-semibold text-[#007DCC] dark:text-[#86cfff] flex items-center gap-2">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>{mentor.role} at {mentor.company}</span>
                </p>
              </div>
            </div>

            {/* About Mentor */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                About {mentor.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-[#A9B8CA] leading-relaxed">
                {mentor.about}
              </p>
            </div>

            {/* What you will get */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F4F7FB]">
                What You Will Get in 1:1 Session
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mentor.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#161c27] border border-slate-100 dark:border-white/5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#007DCC] dark:text-[#86cfff] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#F4F7FB]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 1 Col: Booking Card */}
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0D1828] border border-slate-200 dark:border-white/10 shadow-lg sticky top-24 space-y-6">
              <div className="border-b border-slate-100 dark:border-white/10 pb-5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Session Fee
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-[#F4F7FB]">
                    ₹{mentor.price}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    / 30 min 1:1 session
                  </span>
                </div>
              </div>

              {/* Slot Selector */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-[#F4F7FB] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#007DCC]" />
                  <span>Select Time Slot</span>
                </h3>

                <div className="grid grid-cols-2 gap-2">
                  {mentor.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-3 rounded-xl text-xs font-bold transition-all text-center ${
                        selectedSlot === slot
                          ? 'bg-[#007DCC] text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-[#A9B8CA] hover:bg-slate-200 dark:hover:bg-white/10'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Inclusions */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-white/10 text-xs text-slate-500 dark:text-[#71839A]">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#007DCC]" />
                  <span>Private Google Meet Call</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>Actionable Follow-up Summary</span>
                </div>
              </div>

              {/* CTA Button */}
              {isBooked ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 font-bold text-sm">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Session Booked!</span>
                  </div>
                  <p className="text-xs">Meet link sent to your email for {selectedSlot}.</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleBooking}
                  className="w-full py-4 rounded-2xl bg-[#007DCC] hover:bg-[#006cb0] text-white font-extrabold text-sm transition-all shadow-md active:scale-95 text-center"
                >
                  Book One on One Session
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
