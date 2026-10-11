import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Gauge,
  Layers,
  Sparkles,
  Users,
  Grid,
} from 'lucide-react';
import { GameOption, GameSession, MarketItem } from '../../types';
import { GAME_OPTIONS } from '../../data/mockData';
import { backendApiStore } from '../../data/backendApiStore';
import { showNativeAlert } from './nativeAlertStore';

interface GameCenterScreenProps {
  market: MarketItem;
  onBack: () => void;
  onSelectGame: (gameOption: GameOption, session: GameSession) => void;
  darkMode?: boolean;
}

export const GameCenterScreen: React.FC<GameCenterScreenProps> = ({
  market,
  onBack,
  onSelectGame,
  darkMode = false,
}) => {
  // Real-time live wallet balance from backend store
  const [balance, setBalance] = useState<number>(backendApiStore.getUser().balance);

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setBalance(backendApiStore.getUser().balance);
    });
    return unsub;
  }, []);

  // Custom high-fidelity icons matching the video's exact design
  const renderGameIcon = (iconType: string) => {
    switch (iconType) {
      case 'dice_1':
        // Dice with 1 white dot
        return (
          <div className="w-8 h-8 rounded-lg bg-[#E85D04] shadow-xs flex items-center justify-center shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-white shadow-2xs"></span>
          </div>
        );

      case 'dice_2':
        // Dice with 2 diagonal white dots
        return (
          <div className="w-8 h-8 rounded-lg bg-[#E85D04] shadow-xs p-1.5 flex flex-col justify-between shrink-0">
            <span className="w-2 h-2 rounded-full bg-white self-start shadow-2xs"></span>
            <span className="w-2 h-2 rounded-full bg-white self-end shadow-2xs"></span>
          </div>
        );

      case 'dice_all':
        // All In One: 2 dice overlapping
        return (
          <div className="relative w-8 h-8 shrink-0">
            <div className="absolute top-0 left-0 w-6 h-6 rounded-md bg-[#E85D04] flex items-center justify-center shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 rounded-md bg-[#C04800] p-1 flex justify-between shadow-xs">
              <span className="w-1 h-1 rounded-full bg-white"></span>
              <span className="w-1 h-1 rounded-full bg-white self-end"></span>
            </div>
          </div>
        );

      case 'card_single':
        // Single Pana: 1 playing card
        return (
          <div className="w-7 h-9 rounded-md bg-white border border-[#E85D04] shadow-xs flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
            <div className="w-3.5 h-3.5 rotate-45 bg-[#E85D04] rounded-2xs"></div>
          </div>
        );

      case 'card_double':
        // Double Pana: 2 playing cards
        return (
          <div className="relative w-8 h-9 shrink-0">
            <div className="absolute top-1 left-0 w-6 h-8 rounded-md bg-white border border-[#E85D04] shadow-xs flex items-center justify-center rotate-[-8deg]">
              <div className="w-2.5 h-2.5 rotate-45 bg-[#E85D04] rounded-2xs"></div>
            </div>
            <div className="absolute top-0 right-0 w-6 h-8 rounded-md bg-white border border-[#E85D04] shadow-xs flex items-center justify-center rotate-[8deg]">
              <div className="w-2.5 h-2.5 rotate-45 bg-[#E85D04] rounded-2xs"></div>
            </div>
          </div>
        );

      case 'card_triple':
        // Triple Pana: 3 playing cards
        return (
          <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
            <div className="absolute top-1 left-0 w-5 h-7 rounded-sm bg-white border border-[#E85D04] -rotate-12 flex items-center justify-center">
              <div className="w-2 h-2 rotate-45 bg-[#E85D04]"></div>
            </div>
            <div className="absolute top-0 w-5 h-7 rounded-sm bg-white border border-[#E85D04] z-10 flex items-center justify-center">
              <div className="w-2 h-2 rotate-45 bg-[#E85D04]"></div>
            </div>
            <div className="absolute top-1 right-0 w-5 h-7 rounded-sm bg-white border border-[#E85D04] rotate-12 flex items-center justify-center">
              <div className="w-2 h-2 rotate-45 bg-[#E85D04]"></div>
            </div>
          </div>
        );

      case 'two_digit':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#E85D04] shadow-xs flex items-center justify-center shrink-0 text-white font-extrabold text-xs">
            CP
          </div>
        );

      case 'motor':
        return (
          <div className="w-8 h-8 rounded-lg bg-[#E85D04] shadow-xs flex items-center justify-center shrink-0 text-white">
            <Gauge className="w-4 h-4" />
          </div>
        );

      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-[#E85D04] shadow-xs flex items-center justify-center shrink-0 text-white">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div
      className={`h-full flex flex-col overflow-hidden select-none ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#F8F9FA] text-zinc-900'
      }`}
    >
      {/* Top Header Bar matching Video (Frames 00:00 - 00:02) */}
      <div className="bg-white px-3.5 py-2.5 flex items-center justify-between border-b border-zinc-200/80 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          {/* Orange rounded back button with white arrow */}
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-[#E85D04] hover:bg-[#d85404] active:scale-95 flex items-center justify-center text-white transition-all shadow-xs cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Market Title in Bold Orange/Red */}
          <h2 className="font-black text-lg tracking-wide uppercase text-[#E85D04] leading-tight">
            {market.name}
          </h2>
        </div>

        {/* Live Wallet Balance Pill */}
        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-zinc-300/90 bg-white text-xs font-black text-zinc-800 shadow-2xs">
          <span>₹{balance}</span>
        </div>
      </div>

      {/* Live Market Session Banner */}
      {market.status === 'Running for Close' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Open Session Closed ({market.openPana}-{market.jodi[0]}*)</span>
          </div>
          <span className="font-extrabold text-[11px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
            Running for Close
          </span>
        </div>
      )}

      {market.status === 'Closed for Today' && (
        <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-2 flex items-center justify-between text-xs">
          <span className="font-bold text-red-700">
            Market Closed for Today ({market.openPana}-{market.jodi}-{market.closePana})
          </span>
          <span className="font-extrabold text-[11px] text-red-800 bg-red-100 px-2 py-0.5 rounded-full">
            Closed
          </span>
        </div>
      )}

      {/* Sub-game Option Cards List (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 overscroll-contain">
        {GAME_OPTIONS.map((option) => {
          const isJodiGame =
            option.id === 'jodi_digit' || option.id === 'jodi_digit_bulk';
          const isJodiBlocked =
            isJodiGame && market.status === 'Running for Close';
          const isMarketClosed = market.status === 'Closed for Today';

          const handleOptionClick = () => {
            if (isMarketClosed) {
              showNativeAlert({
                title: `${market.name} is Closed`,
                message: `Bidding has concluded for today.\n\nResult: ${market.openPana}-${market.jodi}-${market.closePana}\n\nNext bidding re-opens tomorrow at ${market.openTime}.`,
                type: 'info',
              });
              return;
            }

            if (isJodiBlocked) {
              showNativeAlert({
                title: 'Jodi Bidding Closed',
                message: `Open result is already declared for ${market.name} (${market.openPana}-${market.jodi[0]}*). Jodi betting is closed once Open Ank is known.\n\nYou can still play Single Digit & Pana on Close session!`,
                type: 'info',
              });
              return;
            }

            const session: GameSession =
              market.status === 'Running for Close' ? 'Close' : 'Open';
            onSelectGame(option, session);
          };

          return (
            <div
              key={option.id}
              onClick={handleOptionClick}
              className={`rounded-2xl border px-4 py-3.5 flex items-center justify-between transition-all cursor-pointer active:scale-[0.99] shadow-2xs ${
                isJodiBlocked
                  ? 'opacity-60 bg-zinc-100 border-zinc-200'
                  : darkMode
                  ? 'bg-zinc-900 border-zinc-800 hover:border-orange-500/50 text-white'
                  : 'bg-white border-zinc-200/90 hover:border-orange-400 hover:shadow-xs text-zinc-900'
              }`}
            >
              {/* Left: Icon & Title */}
              <div className="flex items-center gap-3.5 min-w-0">
                {renderGameIcon(option.iconType)}
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[14.5px] tracking-tight truncate">
                    {option.title}
                  </span>
                  {isJodiBlocked && (
                    <span className="text-[10px] font-bold text-red-500">
                      Closed for Today
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Chevron Arrow */}
              <ChevronRight className="w-4 h-4 text-zinc-800 shrink-0 stroke-[2.5]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
