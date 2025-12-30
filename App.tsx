
import React, { useState, useMemo, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

// --- Types ---
enum MatchStatus {
  LIVE = 'LIVE',
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED'
}

interface Team { id: string; name: string; logo: string; }
interface Match {
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
interface League { id: string; name: string; icon: string; }

// --- Mock Data ---
const LEAGUES: League[] = [
  { id: '1', name: 'الدوري الإسباني', icon: '🇪🇸' },
  { id: '2', name: 'الدوري الإنجليزي', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  { id: '3', name: 'دوري أبطال أوروبا', icon: '🏆' },
  { id: '4', name: 'الدوري السعودي', icon: '🇸🇦' },
  { id: '5', name: 'الدوري المصري', icon: '🇪🇬' },
];

const MOCK_MATCHES: Match[] = [
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
  }
];

// --- Components ---

const MatchCard: React.FC<{ match: Match; onAnalyze: (m: Match) => void }> = ({ match, onAnalyze }) => {
  const isLive = match.status === MatchStatus.LIVE;
  const isFinished = match.status === MatchStatus.FINISHED;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 transition-all active:scale-[0.98]">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
          {match.league}
        </span>
        {isLive ? (
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
            مباشر {match.minute}'
          </span>
        ) : isFinished ? (
          <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">انتهت</span>
        ) : (
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
            {new Date(match.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col items-center flex-1 space-y-2">
          <img src={match.homeTeam.logo} alt="" className="w-14 h-14 rounded-full border-2 border-gray-50 object-cover shadow-sm" />
          <span className="text-sm font-bold text-gray-800 text-center leading-tight">{match.homeTeam.name}</span>
        </div>

        <div className="flex flex-col items-center justify-center min-w-[60px]">
          {(isLive || isFinished) ? (
            <div className="text-3xl font-black text-gray-900 flex items-center gap-1">
              <span>{match.homeScore}</span>
              <span className="text-gray-200">-</span>
              <span>{match.awayScore}</span>
            </div>
          ) : (
            <div className="text-xs font-black text-gray-300 tracking-widest">VS</div>
          )}
        </div>

        <div className="flex flex-col items-center flex-1 space-y-2">
          <img src={match.awayTeam.logo} alt="" className="w-14 h-14 rounded-full border-2 border-gray-50 object-cover shadow-sm" />
          <span className="text-sm font-bold text-gray-800 text-center leading-tight">{match.awayTeam.name}</span>
        </div>
      </div>

      <button
        onClick={() => onAnalyze(match)}
        className="mt-5 w-full py-3 bg-green-600 active:bg-green-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-green-100 flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        تحليل الذكاء الاصطناعي
      </button>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [activeLeague, setActiveLeague] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<MatchStatus>(MatchStatus.LIVE);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredMatches = useMemo(() => {
    return MOCK_MATCHES.filter(m => (!activeLeague || m.league === activeLeague) && m.status === activeTab);
  }, [activeLeague, activeTab]);

  const handleAnalyze = async (match: Match) => {
    setSelectedMatch(match);
    setIsAnalyzing(true);
    setAnalysis('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const prompt = `حلل مباراة ${match.homeTeam.name} ضد ${match.awayTeam.name} في ${match.league} وقدم توقعا للنتيجة باللغة العربية.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setAnalysis(response.text || "لا يتوفر تحليل حالياً.");
    } catch (e) {
      setAnalysis("حدث خطأ في الاتصال بالذكاء الاصطناعي.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="bg-green-700 text-white sticky top-0 z-50 shadow-md safe-area-top">
        <div className="max-w-4xl mx-auto px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-lg">
              <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM12 4c-.55 0-1 .45-1 1v1.17c-2.03.23-3.77 1.63-4.33 3.53a1 1 0 1 0 1.91.58c.28-.95 1.15-1.65 2.17-1.76V11c-1.66 0-3 1.34-3 3v2c0 1.66 1.34 3 3 3v1c0 .55.45 1 1 1s1-.45 1-1v-1c1.66 0 3-1.34 3-3v-2c0-1.66-1.34-3-3-3V8.51c2.03-.23 3.77-1.63 4.33-3.53a1 1 0 1 0-1.91-.58c-.28.95-1.15 1.65-2.17 1.76V5c0-.55-.45-1-1-1zm0 9c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1s-1-.45-1-1v-2c0-.55.45-1 1-1z" /></svg>
            </div>
            <h1 className="text-xl font-black">كورة ناو</h1>
          </div>
          <button onClick={() => window.location.reload()} className="p-2 bg-green-800 rounded-full active:scale-90 transition-transform">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Leagues */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
          <button onClick={() => setActiveLeague(null)} className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all ${!activeLeague ? 'bg-green-600 text-white' : 'bg-white text-gray-500'}`}>الكل</button>
          {LEAGUES.map(l => (
            <button key={l.id} onClick={() => setActiveLeague(l.name)} className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all flex items-center gap-2 ${activeLeague === l.name ? 'bg-green-600 text-white' : 'bg-white text-gray-500'}`}>
              <span>{l.icon}</span> {l.name}
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
          {[MatchStatus.LIVE, MatchStatus.UPCOMING, MatchStatus.FINISHED].map(status => (
            <button key={status} onClick={() => setActiveTab(status)} className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${activeTab === status ? 'bg-green-600 text-white shadow-md shadow-green-100' : 'text-gray-400'}`}>
              {status === MatchStatus.LIVE ? 'المباشر' : status === MatchStatus.UPCOMING ? 'القادمة' : 'النتائج'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.length > 0 ? filteredMatches.map(m => <MatchCard key={m.id} match={m} onAnalyze={handleAnalyze} />) : (
            <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-3xl border border-dashed flex flex-col items-center">
              <svg className="w-12 h-12 mb-3 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              <p className="font-bold">لا يوجد مباريات حالياً</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="p-5 bg-green-700 text-white flex justify-between items-center">
              <h3 className="font-bold">تحليل الذكاء الاصطناعي</h3>
              <button onClick={() => setSelectedMatch(null)} className="p-2 hover:bg-green-800 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              {isAnalyzing ? (
                <div className="flex flex-col items-center py-10 space-y-5">
                  <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-bold text-sm">جاري التوقع...</p>
                </div>
              ) : <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">{analysis}</p>}
            </div>
            <div className="p-5 border-t bg-gray-50 flex justify-center">
               <button onClick={() => setSelectedMatch(null)} className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-xl text-sm">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 p-4 pb-8 flex justify-around items-center z-50 md:hidden safe-area-bottom">
        <button className="flex flex-col items-center gap-1 text-green-700">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          <span className="text-[10px] font-bold">الرئيسية</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-300">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/></svg>
          <span className="text-[10px] font-bold">الترتيب</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-gray-300">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10z"/></svg>
          <span className="text-[10px] font-bold">الأخبار</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
