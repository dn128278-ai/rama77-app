import React, { useState, useEffect } from 'react';
import { History, ChevronRight, Filter, ArrowLeft, FolderX, FileText, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import { backendApiStore, PlacedBidRecord } from '../../data/backendApiStore';
import { MarketItem } from '../../types';

interface HistoryScreenProps {
  darkMode: boolean;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ darkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [bids, setBids] = useState<PlacedBidRecord[]>(backendApiStore.getBids());
  const [markets, setMarkets] = useState<MarketItem[]>(backendApiStore.getMarkets());

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setBids(backendApiStore.getBids());
      setMarkets(backendApiStore.getMarkets());
    });
    return unsub;
  }, []);

  const historyCategories = [
    { id: 'game_bid', title: 'Game Bid History', icon: History, count: bids.length },
    { id: 'starline_bid', title: 'Starline Bid History', icon: History, count: 0 },
    { id: 'jackpot_bid', title: 'Jackpot Bid History', icon: History, count: 0 },
    { id: 'game_result', title: 'Game Result History', icon: FileText, count: markets.length },
    { id: 'starline_result', title: 'Starline Result History', icon: FileText, count: 0 },
    { id: 'jackpot_result', title: 'Jackpot Result History', icon: FileText, count: 0 },
  ];

  if (selectedCategory) {
    const activeItem = historyCategories.find((c) => c.id === selectedCategory);

    return (
      <div
        className={`h-full flex flex-col ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
        }`}
      >
        {/* Detail Header with Orange Filter Button (Video 00:14) */}
        <div
          className={`px-4 py-3 border-b flex items-center justify-between shadow-xs ${
            darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h3 className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
                {activeItem?.title}
              </h3>
              <span className="text-[10px] text-zinc-400">Live Matka777 Synced</span>
            </div>
          </div>

          <button
            onClick={() => {}}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F16521] text-white rounded-full text-xs font-bold shadow-xs hover:bg-[#e05410] cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Content View: Real-Time Bids from Admin Panel Database */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-20">
          {selectedCategory === 'game_bid' && bids.length > 0 ? (
            bids.map((bid) => (
              <div
                key={bid.id}
                className={`p-3.5 rounded-2xl border shadow-xs transition-all ${
                  darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#F16521]">
                        {bid.marketName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          bid.session === 'Open'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {bid.session}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 mt-1">
                      {bid.gameTitle} · Digit/Pana:{' '}
                      <span className="font-mono font-bold text-base text-zinc-900 dark:text-white ml-1">
                        {bid.number}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{bid.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className="font-black text-sm text-zinc-900 dark:text-white">
                      ₹{bid.points}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        bid.status === 'Won'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : bid.status === 'Lost'
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : bid.status === 'Refunded'
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}
                    >
                      {bid.status === 'Won' && <CheckCircle2 className="w-3 h-3" />}
                      {bid.status === 'Lost' && <XCircle className="w-3 h-3" />}
                      {bid.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {bid.status}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : selectedCategory === 'game_result' ? (
            markets.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-2xl border shadow-xs ${
                  darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{m.name}</h4>
                    <span className="text-[11px] text-zinc-400">
                      {m.openTime} - {m.closeTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-sm text-[#F16521]">
                      {m.openPana}-{m.jodi}-{m.closePana}
                    </span>
                    <div className="text-[10px] text-zinc-500">{m.status}</div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State matching video 00:15 */
            <div className="flex flex-col items-center justify-center p-8 text-center mt-12">
              <div className="w-24 h-24 bg-orange-100/60 rounded-full flex items-center justify-center mb-4">
                <FolderX className="w-12 h-12 text-[#F16521]" />
              </div>
              <h4 className="font-black text-lg text-zinc-900 dark:text-white">No Data Found</h4>
              <p className="text-zinc-500 text-xs mt-1 max-w-xs">
                There is no data for this category right now. Place a bid in Game Center to view records!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-full overflow-y-auto p-4 space-y-3 pb-20 ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      <div className="space-y-3">
        {historyCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border shadow-xs transition-all active:scale-[0.99] text-left cursor-pointer ${
                darkMode
                  ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80'
                  : 'bg-white border-zinc-200/60 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F16521] to-[#E05410] flex items-center justify-center text-white shadow-xs">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-zinc-800'}`}>
                    {cat.title}
                  </span>
                  {cat.count > 0 && (
                    <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                      {cat.count} records
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
