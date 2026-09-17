import React, { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Book, 
  Pencil, 
  FileText,
  Briefcase,
  Lightbulb
} from 'lucide-react';
import gsap from 'gsap';

const ICONS = [GraduationCap, Book, Pencil, FileText, Briefcase, Lightbulb];

interface DecorationItem {
  id: number;
  Icon: React.ElementType;
  x: string;
  y: string;
  scale: number;
  rotation: number;
  animationClass: string;
  delay: number;
}

export const DesktopDecorations: React.FC = () => {
  const [items, setItems] = useState<DecorationItem[]>([]);

  useEffect(() => {
    // Generate static safe positions (avoiding the center area where content is)
    const safeZones = [
      { x: '10%', y: '15%' }, // top left
      { x: '85%', y: '12%' }, // top right
      { x: '5%', y: '50%' },  // mid left
      { x: '92%', y: '60%' }, // mid right
      { x: '15%', y: '85%' }, // bottom left
      { x: '82%', y: '80%' }, // bottom right
    ];

    // Pick 4-6 random objects based on window width
    const numObjects = window.innerWidth > 1280 ? 6 : 4;
    const selectedZones = safeZones.slice(0, numObjects);

    const generatedItems: DecorationItem[] = selectedZones.map((zone, i) => ({
      id: i,
      Icon: ICONS[Math.floor(Math.random() * ICONS.length)],
      x: zone.x,
      y: zone.y,
      scale: 0.7 + Math.random() * 0.4, // 0.7 to 1.1
      rotation: -15 + Math.random() * 30, // -15 to +15 deg
      animationClass: i % 2 === 0 ? 'animate-float-slow' : 'animate-float-slower',
      delay: Math.random() * 2,
    }));

    setItems(generatedItems);

    // Initial fade in for objects
    gsap.fromTo('.desktop-decoration-item', 
      { opacity: 0, scale: 0.5 }, 
      { opacity: 1, scale: 1, duration: 1.5, stagger: 0.2, ease: 'power2.out', delay: 0.5 }
    );
  }, []);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden="true">
      {items.map((item) => {
        const Icon = item.Icon;
        return (
          <div
            key={item.id}
            className="desktop-decoration-item absolute opacity-10 dark:opacity-15 motion-safe:transition-all"
            style={{ 
              top: item.y, 
              left: item.x,
              transform: `scale(${item.scale}) rotate(${item.rotation}deg)`,
            }}
          >
            <div className={`motion-safe:${item.animationClass}`} style={{ animationDelay: `${item.delay}s` }}>
              <Icon className="w-12 h-12 text-[#007DCC] dark:text-[#9ccaff] drop-shadow-sm" strokeWidth={1} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
