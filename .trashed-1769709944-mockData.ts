
import { Match, MatchStatus, League } from './types';

export const LEAGUES: League[] = [
  { id: '1', name: 'الدوري الإسباني', icon: '🇪🇸' },
  { id: '2', name: 'الدوري الإنجليزي', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: '3', name: 'دوري أبطال أوروبا', icon: '🏆' },
  { id: '4', name: 'الدوري السعودي', icon: '🇸🇦' },
  { id: '5', name: 'الدوري المصري', icon: '🇪🇬' },
];

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm1',
    homeTeam: { id: 't1', name: 'ريال مدريد', logo: 'https://picsum.photos/seed/rm/100/100' },
    awayTeam: { id: 't2', name: 'برشلونة', logo: 'https://picsum.photos/seed/barca/100/100' },
    homeScore: 2,
    awayScore: 1,
    status: MatchStatus.LIVE,
    minute: 75,
    startTime: '2023-10-25T20:00:00Z',
    league: 'الدوري الإسباني'
  },
  {
    id: 'm2',
    homeTeam: { id: 't3', name: 'ليفربول', logo: 'https://picsum.photos/seed/lfc/100/100' },
    awayTeam: { id: 't4', name: 'مانشستر سيتي', logo: 'https://picsum.photos/seed/manc/100/100' },
    status: MatchStatus.UPCOMING,
    startTime: '2023-10-26T18:30:00Z',
    league: 'الدوري الإنجليزي'
  },
  {
    id: 'm3',
    homeTeam: { id: 't5', name: 'الهلال', logo: 'https://picsum.photos/seed/hilal/100/100' },
    awayTeam: { id: 't6', name: 'النصر', logo: 'https://picsum.photos/seed/nasr/100/100' },
    homeScore: 3,
    awayScore: 0,
    status: MatchStatus.FINISHED,
    startTime: '2023-10-24T19:00:00Z',
    league: 'الدوري السعودي'
  },
  {
    id: 'm4',
    homeTeam: { id: 't7', name: 'الأهلي', logo: 'https://picsum.photos/seed/ahly/100/100' },
    awayTeam: { id: 't8', name: 'الزمالك', logo: 'https://picsum.photos/seed/zamalek/100/100' },
    status: MatchStatus.UPCOMING,
    startTime: '2023-10-27T17:00:00Z',
    league: 'الدوري المصري'
  },
  {
    id: 'm5',
    homeTeam: { id: 't9', name: 'بايرن ميونخ', logo: 'https://picsum.photos/seed/bayern/100/100' },
    awayTeam: { id: 't10', name: 'باريس سان جيرمان', logo: 'https://picsum.photos/seed/psg/100/100' },
    homeScore: 1,
    awayScore: 1,
    status: MatchStatus.LIVE,
    minute: 12,
    startTime: '2023-10-25T20:45:00Z',
    league: 'دوري أبطال أوروبا'
  }
];
