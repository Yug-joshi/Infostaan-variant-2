export interface Mentor {
  id: string;
  name: string;
  role: string;
  area: string;
  company: string;
  experience: string;
  price: number;
  avatar: string;
  desc: string;
  about: string;
  highlights: string[];
  availableSlots: string[];
  online: boolean;
}

export const MENTORS_DATA: Mentor[] = [
  {
    id: 'm1',
    name: 'Rohan Sharma',
    role: 'Investment Banker',
    area: 'Finance & Banking',
    company: 'Top Tier Investment Bank',
    experience: '5+ Years',
    price: 499,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    desc: 'Specializing in M&A, equity research, and corporate finance career roadmaps.',
    about: 'Senior Analyst with 5+ years of experience navigating South Mumbai finance corridors and Big 4 corporate finance environments. Helps commerce & finance students crack high-yield banking interviews.',
    highlights: [
      'Resume & CV Tailoring for Finance Roles',
      'Technical & Behavioral Interview Prep',
      'CA + IB Dual Career Synchronization',
      'Networking Strategies for BKC & Fort Firms',
    ],
    availableSlots: ['Today 05:00 PM', 'Today 07:30 PM', 'Tomorrow 11:00 AM', 'Tomorrow 06:00 PM'],
    online: true,
  },
  {
    id: 'm2',
    name: 'Priya Patel',
    role: 'Chartered Accountant',
    area: 'CA & Articleship',
    company: 'Big 4 Audit Firm',
    experience: '3+ Years',
    price: 399,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    desc: 'Big 4 CA rankholder assisting with articleship placements and lecture timing balance.',
    about: 'Achieved All-India Rank in CA Intermediate while balancing B.Com lectures at South Mumbai colleges. Specializes in helping CA aspirants balance college schedules with Big 4 articleships.',
    highlights: [
      'CA Inter / Final Study Strategy & Timetables',
      'Big 4 Audit & Tax Articleship Interview Guidance',
      'College Schedule vs Articleship Balancing',
      'Mock Technical Case Discussions',
    ],
    availableSlots: ['Today 06:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 04:00 PM', 'Sat 02:00 PM'],
    online: true,
  },
  {
    id: 'm3',
    name: 'Aditya Desai',
    role: 'Software Engineer',
    area: 'Tech & Engineering',
    company: 'Leading Tech MNC',
    experience: '4+ Years',
    price: 499,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    desc: 'Full-stack software lead helping B.Sc IT & CS students master DSA and product roles.',
    about: 'Experienced software engineer guiding tech students across Mumbai universities in Data Structures, System Design fundamentals, and off-campus tech placement strategies.',
    highlights: [
      'Data Structures & Algorithms Roadmap',
      'Tech Project Architecture & Portfolio Review',
      'System Design Basics for Undergrads',
      'Off-campus Job Search & Referral Tips',
    ],
    availableSlots: ['Today 08:00 PM', 'Tomorrow 01:00 PM', 'Tomorrow 07:00 PM', 'Sat 04:00 PM'],
    online: true,
  },
  {
    id: 'm4',
    name: 'Neha Gupta',
    role: 'Management Consultant',
    area: 'Strategy & Consulting',
    company: 'MBB Consulting Firm',
    experience: '2+ Years',
    price: 599,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    desc: 'Strategy consultant sharing case study interview frameworks and BMS placement tips.',
    about: 'BMS alumna from HR College, now working at an MBB consulting firm. Helps management students master case interview frameworks, guesstimates, and consulting profiles.',
    highlights: [
      'Case Interview Frameworks & Guesstimates',
      'BMS / BBA Campus Placement Prep',
      'Consulting Resume Structuring',
      'MBA Entrance & Profile Building Strategy',
    ],
    availableSlots: ['Today 04:00 PM', 'Tomorrow 12:00 PM', 'Tomorrow 05:00 PM', 'Sun 11:00 AM'],
    online: true,
  },
  {
    id: 'm5',
    name: 'Vikram Mehta',
    role: 'Product Manager',
    area: 'Product & FinTech',
    company: 'Suburban FinTech Hub',
    experience: '6+ Years',
    price: 499,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    desc: 'Product manager helping students transition into product management and UX design.',
    about: 'Leading product initiatives for fintech applications in Mumbai. Guides students on how to transition into Associate Product Manager (APM) roles straight out of college.',
    highlights: [
      'APM Interview & Product Sense Frameworks',
      'Product Metrics & Growth Experiments',
      'Portfolio & Product Teardown Reviews',
      'Cross-functional Team Leadership Guidance',
    ],
    availableSlots: ['Tomorrow 03:00 PM', 'Tomorrow 08:00 PM', 'Sat 11:00 AM', 'Sun 03:00 PM'],
    online: true,
  },
  {
    id: 'm6',
    name: 'Ananya Roy',
    role: 'Brand Strategist',
    area: 'Media & Branding',
    company: 'Digital Media Agency',
    experience: '4+ Years',
    price: 399,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    desc: 'BMM graduate leading brand strategy and creative campaigns for top consumer brands.',
    about: 'Mithibai BMM alumna working with premier digital agencies in Mumbai. Specializes in guiding media, marketing, and PR aspirants on agency portfolios and brand strategy roles.',
    highlights: [
      'BMM / Mass Media Career Roadmap',
      'Creative Portfolio & Campaign Reviews',
      'PR & Agency Internship Placement Tips',
      'Digital Marketing & Content Strategy',
    ],
    availableSlots: ['Today 05:30 PM', 'Tomorrow 02:00 PM', 'Tomorrow 06:30 PM', 'Sat 05:00 PM'],
    online: true,
  },
];
