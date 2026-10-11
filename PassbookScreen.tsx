import React, { useState, useEffect } from 'react';
import { backendApiStore } from '../../data/backendApiStore';
import { TransactionRecord } from '../../types';

interface PassbookScreenProps {
  darkMode: boolean;
}

export const PassbookScreen: React.FC<PassbookScreenProps> = ({ darkMode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(backendApiStore.getPassbook());

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setTransactions(backendApiStore.getPassbook());
    });
    return unsub;
  }, []);

  return (
    <div
      className={`h-full flex flex-col ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      {/* Table Header Row (Orange Bar matching video 00:26) */}
      <div className="bg-[#F16521] text-white text-xs font-bold px-4 py-3 flex items-center justify-between shadow-xs">
        <span className="w-1/2">Description</span>
        <span className="w-1/3 text-center">Transaction Amount</span>
        <span className="w-1/6 text-right">Balance</span>
      </div>

      {/* Transaction Records List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 pb-20">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className={`p-3.5 rounded-xl border shadow-xs transition-colors ${
              darkMode
                ? 'bg-zinc-900 border-zinc-800'
                : 'bg-white border-zinc-200/80'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              {/* Description */}
              <div className="flex-1">
                <h5 className={`font-bold text-xs leading-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                  {tx.type} | ₹{tx.amount} | {tx.orderId}
                </h5>
                <p className="text-[11px] text-zinc-500 mt-1">
                  {tx.mode || 'Wallet Transaction'}
                </p>
              </div>

              {/* Transaction Amount Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-md text-xs font-bold ${
                    tx.status === 'Success'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}
                >
                  {tx.status === 'Success' ? '+' : '-'}₹{tx.amount}
                </span>

                {/* Balance */}
                <span className={`font-extrabold text-xs w-8 text-right ${darkMode ? 'text-zinc-200' : 'text-zinc-800'}`}>
                  ₹{tx.previousBalance}
                </span>
              </div>
            </div>

            {/* Date and Prev Balance Footer */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-zinc-400 font-medium">
              <span>{tx.date} {tx.time}</span>
              <span>Prev: ₹{tx.previousBalance}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer matching video 00:26 */}
      <div
        className={`border-t px-4 py-3 flex items-center justify-center gap-3 ${
          darkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          Previous
        </button>

        <span className="w-8 h-8 rounded-lg bg-[#F16521] text-white font-bold text-xs flex items-center justify-center shadow-xs">
          {currentPage}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};
