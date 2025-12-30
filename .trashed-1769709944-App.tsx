
import React, { useState, useMemo } from 'react';
import { MOCK_MATCHES, LEAGUES } from './mockData';
import { Match, MatchStatus } from './types';
import MatchCard from './components/MatchCard';
import LeagueFilter from './components/LeagueFilter';
import PredictionModal from './components/PredictionModal';
import { getMatchAnalysis } from './geminiService';

const App: React.FC = () => {
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MatchStatus>(MatchStatus.LIVE);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredMatches = useMemo(() => {
    return MOCK_MATCHES.filter(match => {
      const leagueMatch = activeLeague ? match.league === activeLeague : true;
      const statusMatch = match.status === activeTab;
      return leagueMatch && statusMatch;
    });
  }, [activeLeague, activeTab]);

  const handleAnalyze = async (match: Match) => {
    setSelectedMatch(match);
    setIsAnalyzing(true);
    setAnalysis('');
    
    const result = await getMatchAnalysis(match);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-green-700 text-white sticky top-0 z-40 shadow-lg p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-white p-1.5 rounded-lg">
                <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 4c-.55 0-1 .45-1 1v1.17c-2.03.23-3.77 1.63-4.33 3.53a1 1 0 1 0 1.91.58c.28-.95 1.15-1.65 2.17-1.76V11c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.66 0 3-1.34 3-3v-2c0-1.66-1.34-3-3-3V8.51c2.03-.23 3.77-1.63 4.33-3.53a1 1 0 1 0-1.91-.58c-.28.95-1.15 1.65-2.17 1.76V5c0-.55-.45-1-1-1zm0 9c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1v-2c0-.55.45-1 1-1z" />
                </svg>
             </div>
             <h1 className="text-xl font-black">كورة ناو</h1>
          </div>
          <div className="text-sm font-medium opacity-80">
            {new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* League Horizontal Filter */}
        <section>
          <LeagueFilter 
            leagues={LEAGUES} 
            activeLeague={activeLeague} 
            onSelect={setActiveLeague} 
          />
        </section>

        {/* Status Tabs */}
        <section className="flex border-b border-gray-200">
          <button 
            onClick={() => setActiveTab(MatchStatus.LIVE)}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === MatchStatus.LIVE ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'}`}
          >
            المباشر
          </button>
          <button 
            onClick={() => setActiveTab(MatchStatus.UPCOMING)}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === MatchStatus.UPCOMING ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'}`}
          >
            القادمة
          </button>
          <button 
            onClick={() => setActiveTab(MatchStatus.FINISHED)}
            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === MatchStatus.FINISHED ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500'}`}
          >
            النتائج
          </button>
        </section>

        {/* Match List */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.length > 0 ? (
            filteredMatches.map(match => (
              <MatchCard 
                key={match.id} 
                match={match} 
                onAnalyze={handleAnalyze} 
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-dashed">
              <p className="font-bold">لا يوجد مباريات متوفرة حالياً في هذا القسم</p>
            </div>
          )}
        </section>
      </main>

      {/* Prediction Modal */}
      <PredictionModal 
        match={selectedMatch}
        analysis={analysis}
        loading={isAnalyzing}
        onClose={() => setSelectedMatch(null)}
      />

      {/* Floating Bottom Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around items-center md:hidden z-40">
        <button className="flex flex-col items-center gap-1 text-green-600">
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
           <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
           <span className="text-[10px] font-bold">الترتيب</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-400">
           <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z"/></svg>
           <span className="text-[10px] font-bold">الأخبار</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
