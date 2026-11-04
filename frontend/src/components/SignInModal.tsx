import React, { useState } from 'react';
import { X, User, MapPin, Check, Sparkles } from 'lucide-react';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (name: string, location: string, stream: string) => void;
}

export const SignInModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('Student');
  const [commuteBase, setCommuteBase] = useState('Borivali / Western Line');
  const [stream, setStream] = useState('Commerce & CA / Finance');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    if (onSave) {
      onSave(name, commuteBase, stream);
    }
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0B111E] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-[#F8FAFC] transition-colors duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-[#111A28]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-950 text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#F8FAFC]">
                Student Profile & Preferences
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#A9B8CA]">Personalize Mumbai recommendations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:text-[#A9B8CA] dark:hover:text-[#F8FAFC] rounded-lg hover:bg-slate-100 dark:hover:bg-[#242a36] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Aryan Sharma"
              className="w-full bg-slate-50 dark:bg-[#141E2E] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider mb-1.5">
              Home Commute Hub / Transit Station
            </label>
            <select
              value={commuteBase}
              onChange={(e) => setCommuteBase(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#141E2E] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] focus:outline-none focus:border-amber-500"
            >
              <option value="Borivali / Western Line">Borivali / Western Line (Suburban)</option>
              <option value="Andheri / Western & Metro">Andheri / Western & Metro</option>
              <option value="Dadar / Western & Central Junction">Dadar / Western & Central Junction</option>
              <option value="Thane / Central Line">Thane / Central Line</option>
              <option value="Vashi / Harbour Line">Vashi / Harbour Line</option>
              <option value="Churchgate / South Mumbai">Churchgate / South Mumbai</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-[#A9B8CA] uppercase tracking-wider mb-1.5">
              Target Academic Stream
            </label>
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#141E2E] border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-[#F8FAFC] focus:outline-none focus:border-amber-500"
            >
              <option value="Commerce & CA / Finance">Commerce & CA / Finance (B.Com, BAF, BFM)</option>
              <option value="Management & Business">Management & Business (BMS, BBA)</option>
              <option value="Technology & Data">Technology & Data (B.Sc IT, CS)</option>
              <option value="Media & Mass Communication">Media & Mass Communication (BAMMC)</option>
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-slate-950 hover:bg-black text-white text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <span>Save Preferences</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
