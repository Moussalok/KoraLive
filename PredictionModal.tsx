
import React from 'react';
import { Match } from '../types';

interface PredictionModalProps {
  match: Match | null;
  analysis: string;
  loading: boolean;
  onClose: () => void;
}

const PredictionModal: React.FC<PredictionModalProps> = ({ match, analysis, loading, onClose }) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-4 bg-green-600 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">تحليل الذكاء الاصطناعي</h3>
          <button onClick={onClose} className="p-1 hover:bg-green-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-center gap-4 mb-6 text-sm font-bold text-gray-500">
             <span>{match.homeTeam.name}</span>
             <span className="text-gray-300">ضد</span>
             <span>{match.awayTeam.name}</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-600 font-medium">جاري تحليل البيانات وتوقع النتيجة...</p>
            </div>
          ) : (
            <div className="prose prose-green max-w-none text-right">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {analysis}
              </p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;
