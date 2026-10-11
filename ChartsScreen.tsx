import React, { useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';
import { MARKETS_LIST, SAMPLE_CHART_ROWS } from '../../data/mockData';

interface ChartsScreenProps {
  onBack: () => void;
  darkMode: boolean;
}

export const ChartsScreen: React.FC<ChartsScreenProps> = ({ onBack, darkMode }) => {
  const [selectedChart, setSelectedChart] = useState<{ market: string; type: 'Jodi' | 'Panel' } | null>(null);

  // If viewing a specific chart (Video 02:02 - 02:16)
  if (selectedChart) {
    const scrollTo = (direction: 'top' | 'bottom') => {
      const container = document.getElementById('chart-table-container');
      if (container) {
        container.scrollTop = direction === 'top' ? 0 : container.scrollHeight;
      }
    };

    return (
      <div
        className={`h-full flex flex-col ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
        }`}
      >
        {/* Top Header matching video 02:02 */}
        <div className="bg-[#F16521] px-4 py-3 text-white flex items-center gap-3 shadow-xs">
          <button
            onClick={() => setSelectedChart(null)}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 className="font-bold text-sm tracking-wide truncate">
            {selectedChart.market} {selectedChart.type} Chart
          </h3>
        </div>

        {/* Sticky Actions: Go To Top / Go To Bottom */}
        <div className="p-3 bg-zinc-50 border-b border-zinc-200 grid grid-cols-2 gap-3">
          <button
            onClick={() => scrollTo('top')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#F16521] to-[#E05410] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
          >
            <ChevronUp className="w-4 h-4" />
            <span>Go To Top</span>
          </button>

          <button
            onClick={() => scrollTo('bottom')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-[#F16521] to-[#E05410] text-white rounded-xl text-xs font-bold shadow-xs active:scale-95"
          >
            <ChevronDown className="w-4 h-4" />
            <span>Go To Bottom</span>
          </button>
        </div>

        {/* Weekly Table matching Video 02:02 - 02:10 */}
        <div id="chart-table-container" className="flex-1 overflow-y-auto overflow-x-auto">
          <table className="w-full text-center border-collapse text-xs">
            <thead>
              <tr className="bg-[#FFEADB] text-[#C2410C] font-black border-b border-orange-200 sticky top-0 shadow-xs">
                <th className="py-2.5 px-2 border-r border-orange-200/60 min-w-[70px]">Date</th>
                <th className="py-2.5 px-1.5 border-r border-orange-200/60 min-w-[36px]">Mon</th>
                <th className="py-2.5 px-1.5 border-r border-orange-200/60 min-w-[36px]">Tue</th>
                <th className="py-2.5 px-1.5 border-r border-orange-200/60 min-w-[36px]">Wed</th>
                <th className="py-2.5 px-1.5 border-r border-orange-200/60 min-w-[36px]">Thu</th>
                <th className="py-2.5 px-1.5 border-r border-orange-200/60 min-w-[36px]">Fri</th>
                <th className="py-2.5 px-1.5 border-r border-orange-200/60 min-w-[36px]">Sat</th>
                <th className="py-2.5 px-1.5 min-w-[36px]">Sun</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-medium">
              {SAMPLE_CHART_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-orange-50/50">
                  <td className="py-2 px-1 text-[10px] text-zinc-500 font-mono whitespace-pre-line border-r border-zinc-100 bg-zinc-50/50">
                    {row.dateRange}
                  </td>
                  <td className="py-2 px-1 border-r border-zinc-100 font-bold text-zinc-800">
                    {row.mon}
                  </td>
                  <td className="py-2 px-1 border-r border-zinc-100 font-bold text-zinc-800">
                    {row.tue}
                  </td>
                  <td className="py-2 px-1 border-r border-zinc-100 font-bold text-zinc-800">
                    {row.wed}
                  </td>
                  <td className="py-2 px-1 border-r border-zinc-100 font-bold text-zinc-800">
                    {row.thu}
                  </td>
                  <td className="py-2 px-1 border-r border-zinc-100 font-bold text-zinc-800">
                    {row.fri}
                  </td>
                  <td className="py-2 px-1 border-r border-zinc-100 font-bold text-zinc-800">
                    {row.sat}
                  </td>
                  <td className="py-2 px-1 font-bold text-zinc-800">
                    {row.sun}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Markets List with Jodi & Panel Buttons (Video 01:57)
  return (
    <div
      className={`h-full flex flex-col ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      {/* Top Header */}
      <div className="bg-[#F16521] px-4 py-3 text-white flex items-center gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-base">Charts</h3>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-3 pb-20">
        {/* Matka Chart Title Card */}
        <div className="bg-[#F16521] text-white font-black text-center py-3 rounded-2xl shadow-sm text-base">
          Matka Chart
        </div>

        {/* Markets with Jodi & Panel buttons matching Video 01:57 */}
        <div className="space-y-2.5">
          {MARKETS_LIST.map((market) => (
            <div
              key={market}
              className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between"
            >
              <span className="font-bold text-xs text-zinc-900 tracking-wide">
                {market}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedChart({ market, type: 'Jodi' })}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F16521] text-white text-xs font-bold shadow-xs hover:bg-[#e05410] active:scale-95"
                >
                  Jodi
                </button>
                <button
                  onClick={() => setSelectedChart({ market, type: 'Panel' })}
                  className="px-3.5 py-1.5 rounded-xl bg-[#F16521] text-white text-xs font-bold shadow-xs hover:bg-[#e05410] active:scale-95"
                >
                  Panel
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
