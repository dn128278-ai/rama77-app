import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  X,
  Trash2,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { GameOption, GameSession, MarketItem, BetItem } from '../../types';
import {
  SINGLE_PANAS,
  DOUBLE_PANAS,
  TRIPLE_PANAS,
} from '../../data/mockData';
import { backendApiStore } from '../../data/backendApiStore';

interface SubGameBetScreenProps {
  market: MarketItem;
  gameOption: GameOption;
  session: GameSession;
  onBack: () => void;
  onBetPlaced: (totalPoints: number) => void;
  darkMode?: boolean;
}

interface TableBidRow {
  id: string;
  digit: string;
  points: number;
  gameType: GameSession;
  sourceDigit?: string; // for bulk tracking
}

export const SubGameBetScreen: React.FC<SubGameBetScreenProps> = ({
  market,
  gameOption,
  session: initialSession = 'Open',
  onBack,
  onBetPlaced,
  darkMode = false,
}) => {
  // Live user balance from backendApiStore
  const [balance, setBalance] = useState<number>(backendApiStore.getUser().balance);

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setBalance(backendApiStore.getUser().balance);
    });
    return unsub;
  }, []);

  // Game Type (Open / Close) Dropdown State
  const [selectedGameType, setSelectedGameType] = useState<GameSession>(
    market.status === 'Running for Close' ? 'Close' : initialSession
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (market.status === 'Running for Close' && selectedGameType === 'Open') {
      setSelectedGameType('Close');
    }
  }, [market.status, selectedGameType]);

  // Table bids list (for table-based games: Jodi, Bulk, Pana, etc.)
  const [tableBids, setTableBids] = useState<TableBidRow[]>([]);

  // -------------------------------------------------------------
  // Mode-Specific States
  // -------------------------------------------------------------

  // 1. Single Digit (Input points for digits 1..0)
  const [singleDigitPoints, setSingleDigitPoints] = useState<Record<string, string>>({
    '1': '', '2': '', '3': '', '4': '', '5': '',
    '6': '', '7': '', '8': '', '9': '', '0': '',
  });

  // 2. Single Digit Bulk
  const [bulkPointsInput, setBulkPointsInput] = useState<string>('');
  const [bulkSelectedDigits, setBulkSelectedDigits] = useState<Record<string, number>>({});

  // 3. Jodi Digit
  const [jodiInput, setJodiInput] = useState<string>('');
  const [jodiPointsInput, setJodiPointsInput] = useState<string>('');
  const [showJodiSuggestions, setShowJodiSuggestions] = useState(false);

  // 4. Jodi Digit Bulk (Rapid Auto-Add)
  const [jodiBulkPoints, setJodiBulkPoints] = useState<string>('');
  const [jodiBulkDigit, setJodiBulkDigit] = useState<string>('');

  // 5. Single Pana
  const [singlePanaInput, setSinglePanaInput] = useState<string>('');
  const [singlePanaPoints, setSinglePanaPoints] = useState<string>('');
  const [panaValidationError, setPanaValidationError] = useState<string | null>(null);
  const [showPanaSuggestions, setShowPanaSuggestions] = useState(false);

  // 6. Single Pana Bulk
  const [panaBulkPoints, setPanaBulkPoints] = useState<string>('');
  const [panaBulkActiveDigits, setPanaBulkActiveDigits] = useState<Record<string, number>>({});

  // 7. Double Pana
  const [doublePanaInput, setDoublePanaInput] = useState<string>('');
  const [doublePanaPoints, setDoublePanaPoints] = useState<string>('');
  const [doublePanaError, setDoublePanaError] = useState<string | null>(null);
  const [showDoublePanaSuggestions, setShowDoublePanaSuggestions] = useState(false);

  // 8. Double Pana Bulk
  const [doubleBulkPoints, setDoubleBulkPoints] = useState<string>('');
  const [doubleBulkActiveDigits, setDoubleBulkActiveDigits] = useState<Record<string, number>>({});

  // 9. Triple Pana
  const [triplePanaPoints, setTriplePanaPoints] = useState<Record<string, string>>({
    '111': '', '222': '', '333': '', '444': '', '555': '',
    '666': '', '777': '', '888': '', '999': '', '000': '',
  });

  // 10. Triple Pana Bulk
  const [tripleBulkPoints, setTripleBulkPoints] = useState<string>('');
  const [tripleBulkActive, setTripleBulkActive] = useState<Record<string, boolean>>({});

  // 11. All In One
  const [allInOneDigit, setAllInOneDigit] = useState<string>('');
  const [allInOnePoints, setAllInOnePoints] = useState<string>('');

  // 12. Motor Games (SP Motor, DP Motor)
  const [motorDigits, setMotorDigits] = useState<string>('');
  const [motorPoints, setMotorPoints] = useState<string>('');

  // -------------------------------------------------------------
  // Review Modal & Error Dialog States
  // -------------------------------------------------------------
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // All valid Panas flattened sets for instant validation
  const allSinglePanasSet = useMemo(() => {
    const set = new Set<string>();
    Object.values(SINGLE_PANAS).forEach((arr) => arr.forEach((p) => set.add(p)));
    return set;
  }, []);

  const allDoublePanasSet = useMemo(() => {
    const set = new Set<string>();
    Object.values(DOUBLE_PANAS).forEach((arr) => arr.forEach((p) => set.add(p)));
    return set;
  }, []);

  // -------------------------------------------------------------
  // Total Bids & Total Points Calculation
  // -------------------------------------------------------------
  const { totalBids, totalPoints, bidsToReview } = useMemo(() => {
    const bidsList: TableBidRow[] = [];

    if (gameOption.id === 'single_digit') {
      Object.entries(singleDigitPoints).forEach(([digit, ptsStr]) => {
        const pts = Number(ptsStr);
        if (pts > 0) {
          bidsList.push({
            id: `sd-${digit}`,
            digit,
            points: pts,
            gameType: selectedGameType,
          });
        }
      });
    } else if (gameOption.id === 'single_digit_bulk') {
      Object.entries(bulkSelectedDigits).forEach(([digit, pts]) => {
        if (pts > 0) {
          bidsList.push({
            id: `sdb-${digit}`,
            digit,
            points: pts,
            gameType: selectedGameType,
          });
        }
      });
    } else if (gameOption.id === 'triple_pana') {
      Object.entries(triplePanaPoints).forEach(([digit, ptsStr]) => {
        const pts = Number(ptsStr);
        if (pts > 0) {
          bidsList.push({
            id: `tp-${digit}`,
            digit,
            points: pts,
            gameType: selectedGameType,
          });
        }
      });
    } else if (gameOption.id === 'triple_pana_bulk') {
      const pts = Number(tripleBulkPoints) || 0;
      Object.entries(tripleBulkActive).forEach(([digit, active]) => {
        if (active && pts > 0) {
          bidsList.push({
            id: `tpb-${digit}`,
            digit,
            points: pts,
            gameType: selectedGameType,
          });
        }
      });
    } else {
      // All other table-based games (Jodi, Pana, Motor, All in One, etc.)
      bidsList.push(...tableBids);
    }

    const totalPts = bidsList.reduce((acc, b) => acc + b.points, 0);
    return {
      totalBids: bidsList.length,
      totalPoints: totalPts,
      bidsToReview: bidsList,
    };
  }, [
    gameOption.id,
    singleDigitPoints,
    bulkSelectedDigits,
    triplePanaPoints,
    tripleBulkPoints,
    tripleBulkActive,
    tableBids,
    selectedGameType,
  ]);

  // Handle Submit button on Bottom Bar
  const handleOpenReview = () => {
    if (totalBids === 0 || totalPoints === 0) return;
    setShowReviewModal(true);
  };

  // Handle Final Submission from Review Modal
  const handleFinalSubmit = () => {
    if (totalPoints > balance) {
      setShowErrorModal(true);
      return;
    }

    // Prepare bets array for backendApiStore
    const bets = bidsToReview.map((b) => ({
      number: b.digit,
      points: b.points,
    }));

    const res = backendApiStore.placeBidFromApp({
      marketName: market.name,
      session: selectedGameType,
      gameTitle: gameOption.title,
      bets,
    });

    if (res.success) {
      setShowReviewModal(false);
      setShowSuccessToast(true);
      onBetPlaced(totalPoints);

      // Reset local screen states
      setTableBids([]);
      setSingleDigitPoints({
        '1': '', '2': '', '3': '', '4': '', '5': '',
        '6': '', '7': '', '8': '', '9': '', '0': '',
      });
      setBulkSelectedDigits({});
      setTriplePanaPoints({
        '111': '', '222': '', '333': '', '444': '', '555': '',
        '666': '', '777': '', '888': '', '999': '', '000': '',
      });
      setPanaBulkActiveDigits({});
      setDoubleBulkActiveDigits({});

      setTimeout(() => {
        setShowSuccessToast(false);
        onBack();
      }, 1400);
    } else {
      setShowErrorModal(true);
    }
  };

  // Delete bid row from review modal or table
  const handleDeleteBidRow = (bidId: string) => {
    if (gameOption.id === 'single_digit') {
      const digit = bidId.replace('sd-', '');
      setSingleDigitPoints((prev) => ({ ...prev, [digit]: '' }));
    } else if (gameOption.id === 'single_digit_bulk') {
      const digit = bidId.replace('sdb-', '');
      setBulkSelectedDigits((prev) => {
        const next = { ...prev };
        delete next[digit];
        return next;
      });
    } else if (gameOption.id === 'triple_pana') {
      const digit = bidId.replace('tp-', '');
      setTriplePanaPoints((prev) => ({ ...prev, [digit]: '' }));
    } else {
      setTableBids((prev) => prev.filter((r) => r.id !== bidId));
    }
  };

  // -------------------------------------------------------------
  // Helpers for Pana Bulk & Double Pana Bulk
  // -------------------------------------------------------------
  const handleTogglePanaBulkDigit = (digit: string) => {
    const pts = Number(panaBulkPoints) || 0;
    if (pts <= 0) return;

    if (panaBulkActiveDigits[digit]) {
      // Remove all single panas generated by this digit
      setPanaBulkActiveDigits((prev) => {
        const next = { ...prev };
        delete next[digit];
        return next;
      });
      setTableBids((prev) => prev.filter((r) => r.sourceDigit !== digit));
    } else {
      // Add all 12 single panas for this digit
      const panas = SINGLE_PANAS[digit] || [];
      const newRows: TableBidRow[] = panas.map((p, idx) => ({
        id: `spb-${digit}-${p}-${Date.now()}-${idx}`,
        digit: p,
        points: pts,
        gameType: selectedGameType,
        sourceDigit: digit,
      }));

      setPanaBulkActiveDigits((prev) => ({ ...prev, [digit]: pts }));
      setTableBids((prev) => [...prev, ...newRows]);
    }
  };

  const handleToggleDoubleBulkDigit = (digit: string) => {
    const pts = Number(doubleBulkPoints) || 0;
    if (pts <= 0) return;

    if (doubleBulkActiveDigits[digit]) {
      setDoubleBulkActiveDigits((prev) => {
        const next = { ...prev };
        delete next[digit];
        return next;
      });
      setTableBids((prev) => prev.filter((r) => r.sourceDigit !== digit));
    } else {
      const panas = DOUBLE_PANAS[digit] || [];
      const newRows: TableBidRow[] = panas.map((p, idx) => ({
        id: `dpb-${digit}-${p}-${Date.now()}-${idx}`,
        digit: p,
        points: pts,
        gameType: selectedGameType,
        sourceDigit: digit,
      }));

      setDoubleBulkActiveDigits((prev) => ({ ...prev, [digit]: pts }));
      setTableBids((prev) => [...prev, ...newRows]);
    }
  };

  // Rapid Auto-Add for Jodi Digit Bulk
  const handleJodiBulkChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 2);
    setJodiBulkDigit(cleaned);

    const pts = Number(jodiBulkPoints) || 0;
    if (cleaned.length === 2 && pts > 0) {
      setTableBids((prev) => [
        {
          id: `jdb-${cleaned}-${Date.now()}`,
          digit: cleaned,
          points: pts,
          gameType: 'Close',
        },
        ...prev,
      ]);
      setJodiBulkDigit('');
    }
  };

  // Add Single Pana
  const handleAddSinglePana = () => {
    const pana = singlePanaInput.trim();
    const pts = Number(singlePanaPoints) || 0;

    if (!allSinglePanasSet.has(pana)) {
      setPanaValidationError('Bid digit must be a valid single pana');
      return;
    }
    if (pts <= 0) return;

    setPanaValidationError(null);
    setTableBids((prev) => [
      ...prev,
      {
        id: `sp-${pana}-${Date.now()}`,
        digit: pana,
        points: pts,
        gameType: selectedGameType,
      },
    ]);
    setSinglePanaInput('');
    setSinglePanaPoints('');
    setShowPanaSuggestions(false);
  };

  // Add Double Pana
  const handleAddDoublePana = () => {
    const pana = doublePanaInput.trim();
    const pts = Number(doublePanaPoints) || 0;

    if (!allDoublePanasSet.has(pana)) {
      setDoublePanaError('Bid digit must be a valid double pana');
      return;
    }
    if (pts <= 0) return;

    setDoublePanaError(null);
    setTableBids((prev) => [
      ...prev,
      {
        id: `dp-${pana}-${Date.now()}`,
        digit: pana,
        points: pts,
        gameType: selectedGameType,
      },
    ]);
    setDoublePanaInput('');
    setDoublePanaPoints('');
    setShowDoublePanaSuggestions(false);
  };

  // Add Jodi
  const handleAddJodi = () => {
    const jodi = jodiInput.trim();
    const pts = Number(jodiPointsInput) || 0;
    if (jodi.length !== 2 || pts <= 0) return;

    setTableBids((prev) => [
      ...prev,
      {
        id: `jodi-${jodi}-${Date.now()}`,
        digit: jodi,
        points: pts,
        gameType: 'Close',
      },
    ]);
    setJodiInput('');
    setJodiPointsInput('');
    setShowJodiSuggestions(false);
  };

  // Add All In One
  const handleAddAllInOne = () => {
    const dig = allInOneDigit.trim();
    const pts = Number(allInOnePoints) || 0;
    if (!dig || pts <= 0) return;

    setTableBids((prev) => [
      ...prev,
      {
        id: `aio-${dig}-${Date.now()}`,
        digit: dig,
        points: pts,
        gameType: selectedGameType,
      },
    ]);
    setAllInOneDigit('');
    setAllInOnePoints('');
  };

  // Autocomplete matching single panas
  const panaSuggestions = useMemo(() => {
    if (singlePanaInput.length < 2) return [];
    return Array.from(allSinglePanasSet)
      .filter((p) => p.startsWith(singlePanaInput))
      .slice(0, 5);
  }, [singlePanaInput, allSinglePanasSet]);

  // Autocomplete matching double panas
  const doublePanaSuggestions = useMemo(() => {
    if (doublePanaInput.length < 2) return [];
    return Array.from(allDoublePanasSet)
      .filter((p) => p.startsWith(doublePanaInput))
      .slice(0, 6);
  }, [doublePanaInput, allDoublePanasSet]);

  // Autocomplete matching jodis
  const jodiSuggestions = useMemo(() => {
    if (jodiInput.length !== 1) return [];
    const arr: string[] = [];
    for (let i = 0; i <= 9; i++) {
      arr.push(`${jodiInput}${i}`);
    }
    return arr;
  }, [jodiInput]);

  // Formatted date-time string matching video
  const formattedDateTime = useMemo(() => {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const mon = String(d.getMonth() + 1).padStart(2, '0');
    const yr = d.getFullYear();
    let hours = d.getHours();
    const mins = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const strHours = String(hours).padStart(2, '0');
    return `${day}/${mon}/${yr} - ${strHours}:${mins} ${ampm}`;
  }, []);

  return (
    <div
      className={`h-full flex flex-col overflow-hidden select-none relative ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'
      }`}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER (Video frame 00:03, 00:07, 00:35, 01:17, 01:38) */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white px-3.5 py-2.5 flex items-center justify-between border-b border-zinc-200/80 shrink-0 gap-3">
        {/* Left: Orange Back Button */}
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#E85D04] hover:bg-[#d85404] active:scale-95 flex items-center justify-center text-white transition-all shadow-xs cursor-pointer shrink-0"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Center: Scrolling Marquee Title Banner */}
        <div className="flex-1 overflow-hidden whitespace-nowrap min-w-0">
          <div className="animate-marquee font-black text-[13.5px] uppercase tracking-wide text-zinc-900 inline-block">
            <span>
              {market.name} - {gameOption.title} &nbsp;&nbsp;&nbsp;&nbsp; {market.name} - {gameOption.title} &nbsp;&nbsp;&nbsp;&nbsp; {market.name} - {gameOption.title} &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          </div>
        </div>

        {/* Right: Wallet Balance Pill */}
        <div className="flex items-center gap-1 px-3 py-1 rounded-full border border-zinc-300/90 bg-white text-xs font-black text-zinc-800 shadow-2xs shrink-0">
          <span>₹{balance}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SUB-GAME MAIN CONTENT AREA (Scrollable) */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 overflow-y-auto p-3.5 overscroll-contain">
        {/* ========================================================= */}
        {/* GAME TYPE DROPDOWN: Open / Close */}
        {/* Shown in Single Digit, Bulk, Pana, etc. */}
        {/* ========================================================= */}
        {gameOption.id !== 'jodi_digit' && gameOption.id !== 'jodi_digit_bulk' && (
          <div className="flex items-center justify-between mb-4 relative z-20">
            <span className="font-semibold text-sm text-zinc-700">Select Game Type</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-between gap-3 px-4 py-1.5 rounded-xl border border-orange-300 bg-white text-sm font-semibold text-zinc-800 shadow-2xs cursor-pointer min-w-[95px]"
              >
                <span>{selectedGameType}</span>
                <ChevronDown className="w-4 h-4 text-orange-500" />
              </button>

              {/* Dropdown Menu (Open / Close) */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg overflow-hidden py-1 z-30">
                  <button
                    type="button"
                    disabled={market.status === 'Running for Close'}
                    onClick={() => {
                      if (market.status !== 'Running for Close') {
                        setSelectedGameType('Open');
                        setIsDropdownOpen(false);
                      }
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors ${
                      market.status === 'Running for Close'
                        ? 'opacity-40 text-zinc-400 cursor-not-allowed bg-zinc-50'
                        : selectedGameType === 'Open'
                        ? 'bg-orange-50 text-orange-600 cursor-pointer'
                        : 'text-zinc-700 hover:bg-zinc-100 cursor-pointer'
                    }`}
                  >
                    Open {market.status === 'Running for Close' ? '(Closed)' : ''}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedGameType('Close');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      selectedGameType === 'Close' ? 'bg-orange-50 text-orange-600' : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN A: Single Digit (Video 00:07 - 00:20) */}
        {/* 2 columns: 1..5 on left, 6..0 on right */}
        {/* ========================================================= */}
        {gameOption.id === 'single_digit' && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {/* Left Column: 1 to 5 */}
            <div className="space-y-2.5">
              {['1', '2', '3', '4', '5'].map((digit) => (
                <div key={digit} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#E85D04] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {digit}
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter Points"
                    value={singleDigitPoints[digit]}
                    onChange={(e) =>
                      setSingleDigitPoints((prev) => ({
                        ...prev,
                        [digit]: e.target.value.replace(/\D/g, ''),
                      }))
                    }
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-[#E85D04]"
                  />
                </div>
              ))}
            </div>

            {/* Right Column: 6 to 0 */}
            <div className="space-y-2.5">
              {['6', '7', '8', '9', '0'].map((digit) => (
                <div key={digit} className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#E85D04] text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                    {digit}
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter Points"
                    value={singleDigitPoints[digit]}
                    onChange={(e) =>
                      setSingleDigitPoints((prev) => ({
                        ...prev,
                        [digit]: e.target.value.replace(/\D/g, ''),
                      }))
                    }
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 placeholder:font-normal focus:outline-none focus:border-[#E85D04]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN B: Single Digit Bulk (Video 00:35 - 00:54) */}
        {/* Points input + 10 Keypad buttons with points badges */}
        {/* ========================================================= */}
        {gameOption.id === 'single_digit_bulk' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Enter Points"
                value={bulkPointsInput}
                onChange={(e) => setBulkPointsInput(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
              />
            </div>

            {/* 10 Digit Keypad in 2 rows of 5 */}
            <div className="grid grid-cols-5 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => {
                const isSelected = Boolean(bulkSelectedDigits[digit]);
                const pts = bulkSelectedDigits[digit];

                return (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => {
                      const ptsNum = Number(bulkPointsInput) || 0;
                      if (ptsNum <= 0) return;
                      setBulkSelectedDigits((prev) => {
                        const next = { ...prev };
                        if (next[digit]) {
                          delete next[digit];
                        } else {
                          next[digit] = ptsNum;
                        }
                        return next;
                      });
                    }}
                    className={`relative h-12 rounded-xl font-black text-base flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isSelected
                        ? 'bg-[#E85D04] text-white ring-2 ring-[#E85D04]/30'
                        : 'bg-[#B0B3B8] text-white hover:bg-zinc-400'
                    }`}
                  >
                    <span>{digit}</span>
                    {/* Points badge in top-right corner */}
                    {isSelected && pts && (
                      <span className="absolute top-1 right-1 text-[9px] font-bold text-white bg-black/30 px-1 py-0.2 rounded-xs leading-none">
                        {pts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN C: Jodi Digit (Video 00:56 - 01:08) */}
        {/* Enter Jodi + Points + Add button + live table */}
        {/* ========================================================= */}
        {gameOption.id === 'jodi_digit' && (
          <div className="space-y-4">
            <div className="flex items-end gap-2 relative">
              <div className="flex-1 relative">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Enter Jodi</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Jodi"
                  value={jodiInput}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setJodiInput(v);
                    setShowJodiSuggestions(v.length === 1);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
                {/* Suggestions Dropdown */}
                {showJodiSuggestions && jodiSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full max-h-40 overflow-y-auto bg-white border border-zinc-200 rounded-xl shadow-lg z-30 py-1">
                    {jodiSuggestions.map((j) => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => {
                          setJodiInput(j);
                          setShowJodiSuggestions(false);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold text-zinc-800 hover:bg-orange-50 cursor-pointer"
                      >
                        {j}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Points"
                  value={jodiPointsInput}
                  onChange={(e) => setJodiPointsInput(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>

              <button
                type="button"
                onClick={handleAddJodi}
                className="px-5 py-2 bg-[#B0B3B8] hover:bg-[#E85D04] active:bg-[#E85D04] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN D: Jodi Digit Bulk (Video 01:17 - 01:35) */}
        {/* Points input + Enter Jodi input (Rapid Auto-Add) */}
        {/* ========================================================= */}
        {gameOption.id === 'jodi_digit_bulk' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Points"
                  value={jodiBulkPoints}
                  onChange={(e) => setJodiBulkPoints(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Enter Jodi</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Jodi"
                  value={jodiBulkDigit}
                  onChange={(e) => handleJodiBulkChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN E: Single Pana (Video 01:38 - 02:18) */}
        {/* Enter Pana + Points + Add + Autocomplete & validation */}
        {/* ========================================================= */}
        {gameOption.id === 'single_pana' && (
          <div className="space-y-4">
            <div className="flex items-end gap-2 relative">
              <div className="flex-1 relative">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Enter Pana</label>
                <div className="relative">
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter Pana"
                    value={singlePanaInput}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(0, 3);
                      setSinglePanaInput(v);
                      setPanaValidationError(null);
                      setShowPanaSuggestions(v.length >= 2);
                    }}
                    className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none ${
                      panaValidationError
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-zinc-300 focus:border-[#E85D04]'
                    }`}
                  />
                  {panaValidationError && (
                    <AlertCircle className="w-4 h-4 text-red-500 absolute right-2.5 top-3" />
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {showPanaSuggestions && panaSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg z-30 py-1">
                    {panaSuggestions.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setSinglePanaInput(p);
                          setShowPanaSuggestions(false);
                          setPanaValidationError(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold text-zinc-800 hover:bg-orange-50 cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Points"
                  value={singlePanaPoints}
                  onChange={(e) => setSinglePanaPoints(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>

              <button
                type="button"
                onClick={handleAddSinglePana}
                className="px-5 py-2 bg-[#E85D04] hover:bg-[#d85404] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Add
              </button>
            </div>

            {panaValidationError && (
              <p className="text-xs text-red-500 font-medium">{panaValidationError}</p>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN F: Single Pana Bulk (Video 02:26 - 03:26) */}
        {/* Points input + 10 Keypad buttons (1..0) generating all 12 panas */}
        {/* ========================================================= */}
        {gameOption.id === 'single_pana_bulk' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Enter Points"
                value={panaBulkPoints}
                onChange={(e) => setPanaBulkPoints(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
              />
            </div>

            {/* 10 Digit Keypad (1 to 0) */}
            <div className="grid grid-cols-5 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => {
                const isSelected = Boolean(panaBulkActiveDigits[digit]);
                const pts = panaBulkActiveDigits[digit];

                return (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleTogglePanaBulkDigit(digit)}
                    className={`relative h-12 rounded-xl font-black text-base flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isSelected
                        ? 'bg-[#E85D04] text-white ring-2 ring-[#E85D04]/30'
                        : 'bg-[#B0B3B8] text-white hover:bg-zinc-400'
                    }`}
                  >
                    <span>{digit}</span>
                    {isSelected && pts && (
                      <span className="absolute top-1 right-1 text-[9px] font-bold text-white bg-black/30 px-1 py-0.2 rounded-xs leading-none">
                        {pts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN G: Double Pana (Video 03:41 - 03:57) */}
        {/* ========================================================= */}
        {gameOption.id === 'double_pana' && (
          <div className="space-y-4">
            <div className="flex items-end gap-2 relative">
              <div className="flex-1 relative">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Enter Pana</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Pana"
                  value={doublePanaInput}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 3);
                    setDoublePanaInput(v);
                    setDoublePanaError(null);
                    setShowDoublePanaSuggestions(v.length >= 2);
                  }}
                  className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none ${
                    doublePanaError ? 'border-red-500 bg-red-50/20' : 'border-zinc-300 focus:border-[#E85D04]'
                  }`}
                />

                {showDoublePanaSuggestions && doublePanaSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-zinc-200 rounded-xl shadow-lg z-30 py-1 max-h-40 overflow-y-auto">
                    {doublePanaSuggestions.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setDoublePanaInput(p);
                          setShowDoublePanaSuggestions(false);
                          setDoublePanaError(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs font-bold text-zinc-800 hover:bg-orange-50 cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Points"
                  value={doublePanaPoints}
                  onChange={(e) => setDoublePanaPoints(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>

              <button
                type="button"
                onClick={handleAddDoublePana}
                className="px-5 py-2 bg-[#E85D04] hover:bg-[#d85404] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Add
              </button>
            </div>

            {doublePanaError && (
              <p className="text-xs text-red-500 font-medium">{doublePanaError}</p>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN H: Double Pana Bulk (Video 04:00 - 04:45) */}
        {/* ========================================================= */}
        {gameOption.id === 'double_pana_bulk' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Enter Points"
                value={doubleBulkPoints}
                onChange={(e) => setDoubleBulkPoints(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
              />
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((digit) => {
                const isSelected = Boolean(doubleBulkActiveDigits[digit]);
                const pts = doubleBulkActiveDigits[digit];

                return (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => handleToggleDoubleBulkDigit(digit)}
                    className={`relative h-12 rounded-xl font-black text-base flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isSelected
                        ? 'bg-[#E85D04] text-white ring-2 ring-[#E85D04]/30'
                        : 'bg-[#B0B3B8] text-white hover:bg-zinc-400'
                    }`}
                  >
                    <span>{digit}</span>
                    {isSelected && pts && (
                      <span className="absolute top-1 right-1 text-[9px] font-bold text-white bg-black/30 px-1 py-0.2 rounded-xs leading-none">
                        {pts}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN I: Triple Pana (Video 04:47 - 04:57) */}
        {/* 2 columns of 5 Triple Panas */}
        {/* ========================================================= */}
        {gameOption.id === 'triple_pana' && (
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
            {/* Column 1: 111 to 555 */}
            <div className="space-y-2.5">
              {['111', '222', '333', '444', '555'].map((digit) => (
                <div key={digit} className="flex items-center gap-2">
                  <div className="w-12 h-9 rounded-xl bg-[#E85D04] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {digit}
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter Points"
                    value={triplePanaPoints[digit]}
                    onChange={(e) =>
                      setTriplePanaPoints((prev) => ({
                        ...prev,
                        [digit]: e.target.value.replace(/\D/g, ''),
                      }))
                    }
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                  />
                </div>
              ))}
            </div>

            {/* Column 2: 666 to 000 */}
            <div className="space-y-2.5">
              {['666', '777', '888', '999', '000'].map((digit) => (
                <div key={digit} className="flex items-center gap-2">
                  <div className="w-12 h-9 rounded-xl bg-[#E85D04] text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {digit}
                  </div>
                  <input
                    type="number"
                    inputMode="numeric"
                    placeholder="Enter Points"
                    value={triplePanaPoints[digit]}
                    onChange={(e) =>
                      setTriplePanaPoints((prev) => ({
                        ...prev,
                        [digit]: e.target.value.replace(/\D/g, ''),
                      }))
                    }
                    className="flex-1 min-w-0 px-3 py-1.5 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN J: Triple Pana Bulk */}
        {/* ========================================================= */}
        {gameOption.id === 'triple_pana_bulk' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Enter Points"
                value={tripleBulkPoints}
                onChange={(e) => setTripleBulkPoints(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
              />
            </div>

            <div className="grid grid-cols-5 gap-2.5">
              {['000', '111', '222', '333', '444', '555', '666', '777', '888', '999'].map((digit) => {
                const isSelected = Boolean(tripleBulkActive[digit]);

                return (
                  <button
                    key={digit}
                    type="button"
                    onClick={() => {
                      setTripleBulkActive((prev) => ({
                        ...prev,
                        [digit]: !prev[digit],
                      }));
                    }}
                    className={`h-11 rounded-xl font-black text-xs flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 ${
                      isSelected ? 'bg-[#E85D04] text-white' : 'bg-[#B0B3B8] text-white hover:bg-zinc-400'
                    }`}
                  >
                    {digit}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN K: All In One (Video 00:03 - 00:05) */}
        {/* ========================================================= */}
        {gameOption.id === 'all_in_one' && (
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Enter Digit/Pana</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Digit/Pana"
                  value={allInOneDigit}
                  onChange={(e) => setAllInOneDigit(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Points"
                  value={allInOnePoints}
                  onChange={(e) => setAllInOnePoints(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>

              <button
                type="button"
                onClick={handleAddAllInOne}
                className="px-5 py-2 bg-[#B0B3B8] hover:bg-[#E85D04] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SCREEN L: SP Motor / DP Motor / Two Digit(CP, SR) */}
        {/* ========================================================= */}
        {(gameOption.id === 'sp_motor' || gameOption.id === 'dp_motor' || gameOption.id === 'two_digit_cp_sr') && (
          <div className="space-y-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Enter Digits (e.g. 1234)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Digits"
                  value={motorDigits}
                  onChange={(e) => setMotorDigits(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-zinc-600 mb-1">Points</label>
                <input
                  type="number"
                  inputMode="numeric"
                  placeholder="Enter Points"
                  value={motorPoints}
                  onChange={(e) => setMotorPoints(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#E85D04]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  const pts = Number(motorPoints) || 0;
                  const digits = motorDigits.split('');
                  if (digits.length < 3 || pts <= 0) return;

                  // Simple permutation generator for motor
                  const uniquePanas: string[] = [];
                  for (let i = 0; i < digits.length; i++) {
                    for (let j = i + 1; j < digits.length; j++) {
                      for (let k = j + 1; k < digits.length; k++) {
                        const pana = [digits[i], digits[j], digits[k]].sort().join('');
                        if (!uniquePanas.includes(pana)) uniquePanas.push(pana);
                      }
                    }
                  }

                  const newRows: TableBidRow[] = uniquePanas.map((p, idx) => ({
                    id: `motor-${p}-${Date.now()}-${idx}`,
                    digit: p,
                    points: pts,
                    gameType: selectedGameType,
                  }));

                  setTableBids((prev) => [...prev, ...newRows]);
                  setMotorDigits('');
                  setMotorPoints('');
                }}
                className="px-5 py-2 bg-[#E85D04] hover:bg-[#d85404] text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* LIVE ADDED BIDS TABLE (For Jodi, Pana, Bulk etc.) */}
        {/* Exact headers: Digit | Points | Game Type | Action */}
        {/* ========================================================= */}
        {tableBids.length > 0 && (
          <div className="mt-4 border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="grid grid-cols-4 px-3 py-2 bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-600">
              <div>Digit</div>
              <div className="text-center">Points</div>
              <div className="text-center">Game Type</div>
              <div className="text-right">Action</div>
            </div>

            <div className="divide-y divide-zinc-100 max-h-56 overflow-y-auto">
              {tableBids.map((row) => (
                <div key={row.id} className="grid grid-cols-4 px-3 py-2 text-xs items-center">
                  <div className="font-bold text-zinc-900">{row.digit}</div>
                  <div className="text-center font-bold text-zinc-900">{row.points}</div>
                  <div className="text-center">
                    <span
                      className={`font-bold ${
                        row.gameType === 'Open' ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {row.gameType}
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDeleteBidRow(row.id)}
                      className="text-[#E85D04] hover:text-red-700 p-1 cursor-pointer"
                      title="Delete Bid"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. BOTTOM SUMMARY BAR (Video frames 00:03, 00:20, 00:53, etc.) */}
      {/* Light salmon background (#FEEAE3) with Bids, Points, Submit */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#FEEAE3] border-t border-[#FCD6C9] px-4 py-2.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-6">
          <div>
            <div className="text-xs font-semibold text-zinc-600">Bids</div>
            <div className="font-black text-base text-[#E85D04] leading-tight">
              {totalBids}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-zinc-600">Points</div>
            <div className="font-black text-base text-[#E85D04] leading-tight">
              ₹{totalPoints}
            </div>
          </div>
        </div>

        {/* Orange Submit Button */}
        <button
          type="button"
          onClick={handleOpenReview}
          disabled={totalBids === 0 || totalPoints === 0}
          className="px-7 py-2.5 bg-[#B0B3B8] disabled:opacity-50 enabled:bg-[#E85D04] enabled:hover:bg-[#d85404] enabled:active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. REVIEW & CONFIRMATION MODAL (Video 00:21 - 00:26, 01:31) */}
      {/* ------------------------------------------------------------- */}
      {showReviewModal && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end justify-center">
          <div className="w-full bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[92%] overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
            {/* Header */}
            <div className="p-4 pb-2 border-b border-zinc-100 flex items-start justify-between shrink-0">
              <div>
                <h3 className="font-black text-lg text-[#E85D04] uppercase leading-tight">
                  {market.name}
                </h3>
                <div className="text-xs font-bold text-zinc-700">[{gameOption.title}]</div>
                <div className="text-[11px] text-zinc-500 font-medium mt-0.5">
                  {formattedDateTime}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:text-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bids Review Table */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
                <div className="grid grid-cols-4 px-3 py-2 bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-600">
                  <div>Digit</div>
                  <div className="text-center">Points</div>
                  <div className="text-center">Game Type</div>
                  <div className="text-right">Action</div>
                </div>

                <div className="divide-y divide-zinc-100 max-h-48 overflow-y-auto">
                  {bidsToReview.map((row) => (
                    <div key={row.id} className="grid grid-cols-4 px-3 py-2 text-xs items-center">
                      <div className="font-bold text-zinc-900">{row.digit}</div>
                      <div className="text-center font-bold text-zinc-900">{row.points}</div>
                      <div className="text-center">
                        <span
                          className={`font-bold ${
                            row.gameType === 'Open' ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {row.gameType}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleDeleteBidRow(row.id)}
                          className="text-[#E85D04] hover:text-red-700 p-1 cursor-pointer"
                          title="Delete Bid"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2x2 Summary Container (Matching Video 00:21) */}
              <div className="bg-[#FFF4F0] border border-[#FCD6C9] rounded-2xl p-3 grid grid-cols-2 gap-3 text-center">
                <div className="border-r border-[#FCD6C9] pr-2">
                  <div className="text-[11px] font-semibold text-zinc-600">Total Bids</div>
                  <div className="font-black text-base text-[#E85D04]">{totalBids}</div>
                </div>
                <div className="pl-2">
                  <div className="text-[11px] font-semibold text-zinc-600">Total Bid Amount</div>
                  <div className="font-black text-base text-[#E85D04]">₹{totalPoints}</div>
                </div>

                <div className="border-r border-[#FCD6C9] pr-2 border-t border-[#FCD6C9] pt-2">
                  <div className="text-[11px] font-semibold text-zinc-600">Wallet Before Deduction</div>
                  <div className="font-black text-sm text-zinc-800">₹{balance.toFixed(1)}</div>
                </div>
                <div className="pl-2 border-t border-[#FCD6C9] pt-2">
                  <div className="text-[11px] font-semibold text-zinc-600">Wallet After Deduction</div>
                  <div
                    className={`font-black text-sm ${
                      balance - totalPoints < 0 ? 'text-red-600' : 'text-zinc-800'
                    }`}
                  >
                    ₹{(balance - totalPoints).toFixed(1)}
                  </div>
                </div>
              </div>

              {/* Red Disclaimer */}
              <p className="text-[11px] font-bold text-center text-[#E85D04]">
                *Note: Bid once played will not be Cancelled
              </p>
            </div>

            {/* Modal Bottom Buttons: Cancel & Submit */}
            <div className="p-4 pt-2 border-t border-zinc-100 grid grid-cols-2 gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="py-2.5 rounded-xl border border-zinc-300 text-zinc-700 font-bold text-sm hover:bg-zinc-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#d85404] text-white font-bold text-sm shadow-md cursor-pointer active:scale-95"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 5. INSUFFICIENT BALANCE ERROR MODAL (Video 00:23, 02:18) */}
      {/* Big red circular X badge + Insufficient balance + Okay */}
      {/* ------------------------------------------------------------- */}
      {showErrorModal && (
        <div className="absolute inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-[310px] bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150 relative">
            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full border border-zinc-300 flex items-center justify-center text-zinc-500 hover:text-zinc-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Big red scalloped icon badge with white X */}
            <div className="w-16 h-16 rounded-full bg-red-600 border-4 border-red-100 flex items-center justify-center text-white my-2 shadow-md">
              <X className="w-9 h-9 stroke-[3]" />
            </div>

            <h4 className="font-black text-lg text-zinc-900 mt-2">Error</h4>
            <p className="text-xs text-zinc-600 font-medium mt-1 mb-5 px-2">
              Insufficient balance. Required: {totalPoints}, Available: {balance}
            </p>

            <button
              type="button"
              onClick={() => setShowErrorModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#d85404] text-white font-bold text-sm shadow-md cursor-pointer active:scale-95"
            >
              Okay
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 6. SUCCESS TOAST */}
      {/* ------------------------------------------------------------- */}
      {showSuccessToast && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-60 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-sm animate-in fade-in slide-in-from-top duration-200 whitespace-nowrap">
          <CheckCircle2 className="w-5 h-5" />
          <span>Bid Placed Successfully!</span>
        </div>
      )}
    </div>
  );
};
