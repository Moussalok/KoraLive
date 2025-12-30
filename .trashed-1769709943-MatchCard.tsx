
import React from 'react';
import { Match, MatchStatus } from '../types';

interface MatchCardProps {
  match: Match;
  onAnalyze: (match: Match) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onAnalyze }) => {
  const isLive = match.status === MatchStatus.LIVE;
  const isFinished = match.status === MatchStatus.FINISHED;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {match.league}
        </span>
        {isLive && (
          <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded animate-pulse">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
            مباشر - {match.minute}'
          </span>
        )}
        {isFinished && (
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
            انتهت
          </span>
        )}
        {!isLive && !isFinished && (
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {new Date(match.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Home Team */}
        <div className="flex flex-col items-center flex-1 text-center">
          <img src={match.homeTeam.logo} alt={match.homeTeam.name} className="w-12 h-12 mb-2 rounded-full object-cover border" />
          <span className="text-sm font-bold truncate w-full">{match.homeTeam.name}</span>
        </div>

        {/* Score/VS */}
        <div className="flex flex-col items-center justify-center">
          {(isLive || isFinished) ? (
            <div className="flex items-center gap-2 text-2xl font-black text-gray-800">
              <span>{match.homeScore}</span>
              <span className="text-gray-300">-</span>
              <span>{match.awayScore}</span>
            </div>
          ) : (
            <div className="text-lg font-bold text-gray-300">VS</div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center flex-1 text-center">
          <img src={match.awayTeam.logo} alt={match.awayTeam.name} className="w-12 h-12 mb-2 rounded-full object-cover border" />
          <span className="text-sm font-bold truncate w-full">{match.awayTeam.name}</span>
        </div>
      </div>

      <button
        onClick={() => onAnalyze(match)}
        className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        تحليل الذكاء الاصطناعي
      </button>
    </div>
  );
};

export default MatchCard;
