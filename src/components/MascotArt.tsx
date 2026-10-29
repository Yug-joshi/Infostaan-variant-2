import React, { useState } from 'react';
import welcomeImg from '../assets/images/Cheerful Winking Lightbulb Graduate.png';
import thinkingImg from '../assets/images/Curious Lightbulb Scholar.png';
import ideaImg from '../assets/images/Cheerful Graduate Lightbulb Mascot.png';
import studyingImg from '../assets/images/Cheerful Lightbulb Scholar Reading.png';
import successImg from '../assets/images/Joyful Lightbulb Graduate Mascot.png';

export type MascotVariant = 'welcome' | 'thinking' | 'idea' | 'studying' | 'success';

interface MascotArtProps {
  variant: MascotVariant;
  className?: string;
  alt?: string;
  lazy?: boolean;
}

const assetMap: Record<MascotVariant, string> = {
  welcome: welcomeImg,
  thinking: thinkingImg,
  idea: ideaImg,
  studying: studyingImg,
  success: successImg,
};

const altMap: Record<MascotVariant, string> = {
  welcome: 'InfoBuddy mascot greeting students on the homepage',
  thinking: 'InfoBuddy mascot thinking through a student choice',
  idea: 'InfoBuddy mascot sharing a new idea',
  studying: 'InfoBuddy mascot studying with a book',
  success: 'InfoBuddy mascot celebrating a successful action',
};

export const MascotArt: React.FC<MascotArtProps> = ({
  variant,
  className = '',
  alt,
  lazy = true,
}) => {
  const [hasError, setHasError] = useState(false);

  if (!assetMap[variant] || hasError) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] text-amber-700 dark:from-[#1E293B] dark:to-[#0F172A] dark:text-amber-400 ${className}`}
        aria-hidden="true"
        role="img"
      >
        <span className="text-xs font-bold uppercase tracking-wider">InfoBuddy</span>
      </div>
    );
  }

  return (
    <img
      src={assetMap[variant]}
      alt={alt ?? altMap[variant]}
      loading={lazy ? 'lazy' : 'eager'}
      className={`block w-full h-auto object-contain select-none ${className}`}
      onError={() => setHasError(true)}
      draggable={false}
    />
  );
};
