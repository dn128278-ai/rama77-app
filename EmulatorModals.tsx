import React, { useState } from 'react';
import { X, Gift, AlertCircle, CheckCircle2, ChevronRight, Phone, MessageSquare } from 'lucide-react';

interface WelcomeBonusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayOneRupee: () => void;
}

export const WelcomeBonusModal: React.FC<WelcomeBonusModalProps> = ({
  isOpen,
  onClose,
  onPayOneRupee,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60 backdrop-blur-xs">
      <div className="w-full bg-white rounded-t-3xl p-6 text-center animate-in slide-in-from-bottom-5 duration-200">
        <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-4" />

        {/* Gift Box with Rupee */}
        <div className="relative w-28 h-28 mx-auto mb-2 flex items-center justify-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 text-white">
            <Gift className="w-14 h-14" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 font-black rounded-full px-2.5 py-1 text-sm shadow-md border-2 border-white">
            ₹
          </div>
        </div>

        <div className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
          Welcome Bonus
        </div>

        <h3 className="text-2xl font-black text-zinc-900">Pay ₹1, Get ₹100</h3>
        <p className="text-zinc-500 text-xs mt-1">
          *New Users Only, one-time bonus
        </p>

        <button
          onClick={onPayOneRupee}
          className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#F16521] to-[#E05410] hover:from-[#e05410] hover:to-[#c44307] text-white font-bold text-base rounded-xl shadow-md transition-transform active:scale-[0.98]"
        >
          Pay ₹1
        </button>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-zinc-400 hover:text-zinc-600 text-sm font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

interface WithdrawTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export const WithdrawTermsModal: React.FC<WithdrawTermsModalProps> = ({
  isOpen,
  onClose,
  onAgree,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header matching Video 00:46 */}
        <div className="bg-[#F16521] px-5 py-3.5 text-white flex items-center justify-between">
          <h3 className="font-bold text-lg">Terms &amp; Conditions</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[380px] overflow-y-auto text-zinc-700 text-xs sm:text-sm space-y-3 leading-relaxed">
          <p className="font-semibold text-zinc-900">Minimum Withdraw Is 1000/RS</p>
          <p className="font-semibold text-zinc-900">Maximum Withdraw Is 25 Lakhs Per Day</p>
          <p>
            Per day you can send a withdrawal request of maximum 1 Lakh Automatic
            Above 100000 You Should Request Us Manually
          </p>
          <p className="font-semibold text-orange-700">Only 1 Withdraw Request Accepted Per Day</p>
          <p>Withdraw Request Timing 10:00 AM to 10:00 PM</p>
          <p>
            Process Time Minimum 1 Hour Maximum Up to 48 Hours, Depending On Bank
            Server.
          </p>
          <p className="text-zinc-800 font-medium">Withdraw Is Available On All 7 Days Of Week</p>
        </div>

        {/* Action */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-100">
          <button
            onClick={onAgree}
            className="w-full py-3 bg-[#F16521] hover:bg-[#E05410] text-white font-bold text-sm rounded-xl shadow-md transition-colors"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

interface UpiSheetProps {
  isOpen: boolean;
  amount: number;
  onClose: () => void;
  onComplete: () => void;
}

export const UpiSheet: React.FC<UpiSheetProps> = ({
  isOpen,
  amount,
  onClose,
  onComplete,
}) => {
  const [processingApp, setProcessingApp] = useState<string | null>(null);

  if (!isOpen) return null;

  const upiApps = [
    { name: 'PhonePe', icon: '🟣', desc: 'UPI Instant' },
    { name: 'GPay', icon: '🔵', desc: 'Google Pay' },
    { name: 'InstaBIZ', icon: '🔴', desc: 'ICICI Bank' },
    { name: 'Navi', icon: '🟢', desc: 'Navi UPI' },
    { name: 'YONO SBI', icon: '🔷', desc: 'SBI Yono' },
  ];

  const handleSelect = (appName: string) => {
    setProcessingApp(appName);
    setTimeout(() => {
      setProcessingApp(null);
      onComplete();
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60">
      <div className="w-full bg-white rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-bold text-zinc-900 text-base">Complete payment using</h4>
            <p className="text-zinc-500 text-xs mt-0.5">Paying ₹{amount} to RAMA77 Wallet</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {processingApp ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#F16521] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-zinc-800">
              Connecting to {processingApp}...
            </p>
            <p className="text-xs text-zinc-400">Do not press back or close this window</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 py-2">
            {upiApps.map((app) => (
              <button
                key={app.name}
                onClick={() => handleSelect(app.name)}
                className="flex flex-col items-center justify-center p-3 rounded-2xl border border-zinc-200 hover:border-orange-500 hover:bg-orange-50/50 transition-all text-center group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform shadow-xs">
                  {app.icon}
                </div>
                <span className="text-xs font-semibold text-zinc-800 mt-2 truncate w-full">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = "Hey 👋 I am Using Rama 77 Application to play and track Matka markets. Download APK now!";

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end bg-black/60">
      <div className="w-full bg-white rounded-t-3xl p-5 animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1 bg-zinc-300 rounded-full mx-auto mb-3" />
        <h4 className="font-bold text-zinc-800 text-sm mb-3">Sharing text</h4>

        <div className="bg-zinc-100 p-3 rounded-xl flex items-center justify-between text-xs text-zinc-700 mb-4">
          <p className="truncate pr-2">{shareText}</p>
          <button
            onClick={handleCopy}
            className="text-[#F16521] font-bold text-xs whitespace-nowrap px-2 py-1 bg-white rounded-md shadow-xs"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center text-xs text-zinc-600">
          <div className="flex flex-col items-center p-2 rounded-xl hover:bg-zinc-100">
            <span className="text-2xl mb-1">💬</span>
            <span>WhatsApp</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl hover:bg-zinc-100">
            <span className="text-2xl mb-1">✈️</span>
            <span>Telegram</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl hover:bg-zinc-100">
            <span className="text-2xl mb-1">✉️</span>
            <span>SMS</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-xl hover:bg-zinc-100">
            <span className="text-2xl mb-1">🔗</span>
            <span>More</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 bg-zinc-100 text-zinc-700 font-bold text-xs rounded-xl"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
