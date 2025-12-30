
import React from 'react';
import { League } from '../types';

interface LeagueFilterProps {
  leagues: League[];
  activeLeague: string | null;
  onSelect: (leagueName: string | null) => void;
}

const LeagueFilter: React.FC<LeagueFilterProps> = ({ leagues, activeLeague, onSelect }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors ${
          activeLeague === null ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
      >
        الكل
      </button>
      {leagues.map((league) => (
        <button
          key={league.id}
          onClick={() => onSelect(league.name)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${
            activeLeague === league.name ? 'bg-green-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span>{league.icon}</span>
          {league.name}
        </button>
      ))}
    </div>
  );
};

export default LeagueFilter;
