import React, { useState, useEffect } from 'react';
import {
  Wallet,
  History,
  ArrowDownCircle,
  Building2,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  FolderX,
} from 'lucide-react';
import { PASSBOOK_DATA } from '../../data/mockData';
import { backendApiStore } from '../../data/backendApiStore';
import { WelcomeBonusModal, WithdrawTermsModal, UpiSheet } from './EmulatorModals';
import { showNativeAlert } from './nativeAlertStore';

interface FundsScreenProps {
  darkMode: boolean;
}

export const FundsScreen: React.FC<FundsScreenProps> = ({ darkMode }) => {
  const [subView, setSubView] = useState<
    | null
    | 'add_funds'
    | 'add_history'
    | 'withdraw_funds'
    | 'withdraw_history'
    | 'add_bank'
    | 'bank_history'
  >(null);

  // States for sub-flows
  const [amount, setAmount] = useState('300');
  const [withdrawAmount, setWithdrawAmount] = useState('1000');
  const [userBalance, setUserBalance] = useState(backendApiStore.getUser().balance);
  const [user, setUser] = useState(backendApiStore.getUser());

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setUserBalance(backendApiStore.getUser().balance);
      setUser(backendApiStore.getUser());
    });
    return unsub;
  }, []);

  // Modals
  const [showBonusSheet, setShowBonusSheet] = useState(false);
  const [showUpiSheet, setShowUpiSheet] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Bank form
  const [bankHolder, setBankHolder] = useState('Girish Meena');
  const [accountNo, setAccountNo] = useState('');
  const [confirmAccountNo, setConfirmAccountNo] = useState('');
  const [ifsc, setIfsc] = useState('');

  // 1. Add Funds Sub-screen (Video 00:36)
  if (subView === 'add_funds') {
    return (
      <div
        className={`h-full flex flex-col relative overflow-hidden ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
        }`}
      >
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView(null)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-sm text-zinc-800">Add Funds</h3>
          </div>
          <span className="text-xs font-bold text-zinc-500">
            Bal: ₹{userBalance}
          </span>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-zinc-800">{user.name}</h4>
              <p className="text-xs text-zinc-500">{user.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-zinc-400 block">Available Balance</span>
              <span className="font-extrabold text-base text-zinc-900">₹{userBalance}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs text-center">
            <label className="text-xs font-semibold text-zinc-500 block mb-1">
              Select Amount
            </label>
            <div className="relative max-w-[200px] mx-auto mb-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full text-center text-2xl font-black py-2 text-zinc-900 border-b-2 border-orange-500 focus:outline-none"
              />
              <span className="absolute left-2 top-2 text-2xl font-black text-zinc-400">
                ₹
              </span>
            </div>

            {/* Quick Amount Chips matching Video 00:36 */}
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              {[100, 300, 500, 1000, 1500, 2000].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`py-2 px-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    amount === val.toString()
                      ? 'border-[#F16521] bg-orange-50 text-[#F16521]'
                      : 'border-zinc-300 bg-white text-zinc-700 hover:border-orange-300'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            {/* Pay Now Button */}
            <button
              onClick={() => setShowBonusSheet(true)}
              className="w-full py-3.5 bg-gradient-to-r from-[#F16521] to-[#D84B06] hover:from-[#e05410] hover:to-[#c44307] text-white font-bold rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98]"
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* Welcome Bonus Sheet */}
        <WelcomeBonusModal
          isOpen={showBonusSheet}
          onClose={() => setShowBonusSheet(false)}
          onPayOneRupee={() => {
            setShowBonusSheet(false);
            setShowUpiSheet(true);
          }}
        />

        {/* UPI Payment Sheet */}
        <UpiSheet
          isOpen={showUpiSheet}
          amount={Number(amount) || 1}
          onClose={() => setShowUpiSheet(false)}
          onComplete={() => {
            setShowUpiSheet(false);
            const dep = Number(amount) || 100;
            backendApiStore.adjustUserWallet(dep, 'UPI App Deposit');
            showNativeAlert({
              title: 'Payment Successful',
              message: `₹${dep} has been added to your wallet successfully!`,
              type: 'success',
            });
            setSubView(null);
          }}
        />
      </div>
    );
  }

  // 2. Add Funds History (Video 00:43)
  if (subView === 'add_history') {
    return (
      <div
        className={`h-full flex flex-col ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
        }`}
      >
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView(null)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-sm text-zinc-800">Add Funds History</h3>
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1 overflow-y-auto">
          {PASSBOOK_DATA.map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">📅 {item.date} {item.time}</span>
                <span className="font-black text-sm text-zinc-900">₹{item.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-zinc-600">Order Id</p>
                  <p className="text-xs font-mono text-zinc-800">{item.orderId}</p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    item.status === 'Failure'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
                <span>Request Type: Credit</span>
                <span>Deposit Mode: {item.mode}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. Withdraw Funds Sub-screen (Video 00:45)
  if (subView === 'withdraw_funds') {
    return (
      <div
        className={`h-full flex flex-col relative overflow-hidden ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
        }`}
      >
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView(null)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-sm text-zinc-800">Withdraw Funds</h3>
          </div>
          <span className="text-xs font-bold text-zinc-500">Bal: ₹{userBalance}</span>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-zinc-800">{user.name}</h4>
              <p className="text-xs text-zinc-500">{user.phone}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-zinc-400 block">Available Balance</span>
              <span className="font-extrabold text-base text-zinc-900">₹{userBalance}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs text-center space-y-4">
            <label className="text-xs font-semibold text-zinc-500 block">
              Select Withdraw Amount
            </label>
            <div className="relative max-w-[200px] mx-auto">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full text-center text-2xl font-black py-2 text-zinc-900 border-b-2 border-orange-500 focus:outline-none"
              />
              <span className="absolute left-2 top-2 text-2xl font-black text-zinc-400">
                ₹
              </span>
            </div>

            <button
              onClick={() => setShowTermsModal(true)}
              className="w-full py-3.5 bg-[#F16521] hover:bg-[#E05410] text-white font-bold rounded-xl shadow-md cursor-pointer transition-transform active:scale-[0.98]"
            >
              Send Withdraw Request
            </button>
          </div>
        </div>

        <WithdrawTermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          onAgree={() => {
            setShowTermsModal(false);
            const wAmount = Number(withdrawAmount) || 500;
            if (wAmount > userBalance) {
              showNativeAlert({
                title: 'Withdrawal Failed',
                message: `Insufficient balance! Available balance is ₹${userBalance}, but withdrawal request is ₹${wAmount}.`,
                type: 'error',
              });
              return;
            }
            backendApiStore.adjustUserWallet(-wAmount, 'Withdrawal Request');
            showNativeAlert({
              title: 'Request Submitted',
              message: `Withdrawal request for ₹${wAmount} has been placed successfully! Funds will be processed to your account.`,
              type: 'success',
            });
            setSubView(null);
          }}
        />
      </div>
    );
  }

  // 4. Add Bank Details Sub-screen (Video 00:51)
  if (subView === 'add_bank') {
    return (
      <div
        className={`h-full flex flex-col ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
        }`}
      >
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView(null)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-sm text-zinc-800">Add Bank Details</h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200/80 shadow-xs space-y-3 text-left">
            <div>
              <label className="text-xs font-semibold text-zinc-600 block mb-1">
                Account Holder Name
              </label>
              <input
                type="text"
                value={bankHolder}
                onChange={(e) => setBankHolder(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 block mb-1">
                Account Number
              </label>
              <input
                type="text"
                placeholder="Enter Account Number"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 block mb-1">
                Confirm Account Number
              </label>
              <input
                type="text"
                placeholder="Confirm Account Number"
                value={confirmAccountNo}
                onChange={(e) => setConfirmAccountNo(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-zinc-600 block mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="Enter Bank IFSC"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 rounded-xl text-sm focus:border-orange-500 focus:outline-none uppercase"
              />
            </div>

            <button
              onClick={() => {
                showNativeAlert({
                  title: 'Bank Details Saved',
                  message: 'Your bank account details have been successfully updated and verified for future withdrawals.',
                  type: 'success',
                });
                setSubView(null);
              }}
              className="w-full mt-4 py-3 bg-[#F16521] hover:bg-[#E05410] text-white font-bold rounded-xl shadow-md cursor-pointer active:scale-95"
            >
              Submit Bank Details
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Bank Details History (Video 01:03)
  if (subView === 'bank_history' || subView === 'withdraw_history') {
    return (
      <div
        className={`h-full flex flex-col ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
        }`}
      >
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubView(null)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-sm text-zinc-800">
              {subView === 'bank_history' ? 'My Bank Details' : 'Withdraw History'}
            </h3>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-orange-100/60 rounded-full flex items-center justify-center mb-4">
            <FolderX className="w-12 h-12 text-[#F16521]" />
          </div>
          <h4 className="font-black text-lg text-zinc-900">No Data Found</h4>
          <p className="text-zinc-500 text-xs mt-1 max-w-xs">
            There is no data to show you right now.
          </p>
        </div>
      </div>
    );
  }

  // Main Funds Menu List matching Video 00:33
  return (
    <div
      className={`h-full overflow-y-auto p-4 space-y-3 pb-20 ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      {/* Starline Ticker Banner matching Video 00:33 */}
      <div className="bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center gap-2 font-bold text-xs text-zinc-800">
        <span className="text-base text-orange-500">⭐</span>
        <span>Starline 02:30 PM &nbsp; 158-4</span>
      </div>

      <div className="space-y-3 pt-1">
        <button
          onClick={() => setSubView('add_funds')}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F16521] to-[#E05410] flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-zinc-800">Add Funds</span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>

        <button
          onClick={() => setSubView('add_history')}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F16521] to-[#E05410] flex items-center justify-center text-white">
              <History className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-zinc-800">Add Funds History</span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>

        <button
          onClick={() => setSubView('withdraw_funds')}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F16521] to-[#E05410] flex items-center justify-center text-white">
              <ArrowDownCircle className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-zinc-800">Withdraw Funds</span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>

        <button
          onClick={() => setSubView('withdraw_history')}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F16521] to-[#E05410] flex items-center justify-center text-white">
              <History className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-zinc-800">Withdraw Funds History</span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>

        <button
          onClick={() => setSubView('add_bank')}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F16521] to-[#E05410] flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-zinc-800">Add Bank Details</span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>

        <button
          onClick={() => setSubView('bank_history')}
          className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-md transition-all active:scale-[0.99] text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#F16521] to-[#E05410] flex items-center justify-center text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-sm text-zinc-800">Bank Details History</span>
          </div>
          <ChevronRight className="w-5 h-5 text-zinc-400" />
        </button>
      </div>
    </div>
  );
};
