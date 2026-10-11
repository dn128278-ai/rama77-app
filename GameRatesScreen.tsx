import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  GAME_RATES_STARLINE,
  GAME_RATES_JACKPOT,
} from '../../data/mockData';
import { backendApiStore } from '../../data/backendApiStore';

interface GameRatesScreenProps {
  onBack: () => void;
  darkMode: boolean;
}

export const GameRatesScreen: React.FC<GameRatesScreenProps> = ({ onBack, darkMode }) => {
  const [rates, setRates] = useState(backendApiStore.getGameRates());

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setRates(backendApiStore.getGameRates());
    });
    return unsub;
  }, []);

  return (
    <div
      className={`h-full flex flex-col ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      {/* Header */}
      <div className="bg-[#F16521] px-4 py-3 text-white flex items-center gap-3 shadow-xs">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="font-bold text-base">Game Rates</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 pb-20">
        {/* Section 1: RAMA77 Game Win Ratio */}
        <div>
          <h4 className="text-center font-bold text-sm text-zinc-800 mb-3">
            RAMA77 Game Win Ratio (Live API)
          </h4>
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs divide-y divide-zinc-100 overflow-hidden">
            {rates.map((item, i) => (
              <div
                key={i}
                className="px-4 py-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F16521]" />
                  <span className="font-semibold text-zinc-800">{item.title}</span>
                </div>
                <span className="font-extrabold text-[#F16521] tracking-wide">
                  {item.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Bombay Starline */}
        <div>
          <h4 className="text-center font-bold text-sm text-zinc-800 mb-3">
            Bombay Starline Game Win Ratio
          </h4>
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs divide-y divide-zinc-100 overflow-hidden">
            {GAME_RATES_STARLINE.map((item, i) => (
              <div
                key={i}
                className="px-4 py-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F16521]" />
                  <span className="font-semibold text-zinc-800">{item.title}</span>
                </div>
                <span className="font-extrabold text-[#F16521] tracking-wide">
                  {item.rate}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Bombay Jackpot */}
        <div>
          <h4 className="text-center font-bold text-sm text-zinc-800 mb-3">
            Bombay Jackpot Game Win Ratio
          </h4>
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs divide-y divide-zinc-100 overflow-hidden">
            {GAME_RATES_JACKPOT.map((item, i) => (
              <div
                key={i}
                className="px-4 py-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F16521]" />
                  <span className="font-semibold text-zinc-800">{item.title}</span>
                </div>
                <span className="font-extrabold text-[#F16521] tracking-wide">
                  {item.rate}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
