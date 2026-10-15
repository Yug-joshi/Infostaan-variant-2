export interface ReelItem {
  id: string;
  title: string;
  tag: string;
  coverImage: string;
  videoUrl: string;
  durationText?: string;
  views?: string;
  author: {
    name: string;
    handle: string;
  };
}

export const INSTAGRAM_REELS: ReelItem[] = [
  {
    id: 'fyjc-reality-check',
    title: 'FYJC Reality Check: FYJC is not just a waiting room',
    tag: 'FYJC Admissions',
    coverImage: '/reels/reel_DecGRhYTXih.jpg',
    videoUrl: '/reels/reel_DecGRhYTXih.mp4',
    durationText: '0:52',
    views: '18.2K',
    author: {
      name: 'Infostaan',
      handle: '@infostaan',
    },
  },
  {
    id: 'mumbai-college-culture',
    title: 'Mithibai vs NM vs HR: Which Mumbai college is right for you?',
    tag: 'College Comparison',
    coverImage: '/reels/reel_DecGRhYTXih.jpg',
    videoUrl: '/reels/reel_DecGRhYTXih.mp4',
    durationText: '0:48',
    views: '24.6K',
    author: {
      name: 'Infostaan',
      handle: '@infostaan',
    },
  },
  {
    id: 'ca-with-bcom-guide',
    title: 'Can you crack CA Foundation while doing regular B.Com in Mumbai?',
    tag: 'Course Guidance',
    coverImage: '/reels/reel_DecGRhYTXih.jpg',
    videoUrl: '/reels/reel_DecGRhYTXih.mp4',
    durationText: '1:05',
    views: '15.9K',
    author: {
      name: 'Infostaan',
      handle: '@infostaan',
    },
  },
  {
    id: 'cutoff-mastery',
    title: 'How Mumbai College Cutoffs actually work: Round 1 vs Special Round',
    tag: 'Cutoff Insights',
    coverImage: '/reels/reel_DecGRhYTXih.jpg',
    videoUrl: '/reels/reel_DecGRhYTXih.mp4',
    durationText: '0:44',
    views: '31.1K',
    author: {
      name: 'Infostaan',
      handle: '@infostaan',
    },
  },
];
