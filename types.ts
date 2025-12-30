
export enum MatchStatus {
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED'
}

export interface Team {
  id: string;
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  startTime: string;
  status: MatchStatus;
  league: string;
  minute?: number;
}

export interface League {
  id: string;
  name: string;
  icon: string;
}
