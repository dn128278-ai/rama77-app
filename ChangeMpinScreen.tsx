import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { showNativeAlert } from './nativeAlertStore';
import { backendApiStore } from '../../data/backendApiStore';

interface ChangeMpinScreenProps {
  onBack: () => void;
  darkMode: boolean;
}

export const ChangeMpinScreen: React.FC<ChangeMpinScreenProps> = ({ onBack, darkMode }) => {
  const [oldMpin, setOldMpin] = useState(['', '', '', '']);
  const [newMpin, setNewMpin] = useState(['', '', '', '']);
  const [confirmMpin, setConfirmMpin] = useState(['', '', '', '']);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const renderBoxes = (
    values: string[],
    setValues: React.Dispatch<React.SetStateAction<string[]>>,
    prefix: string
  ) => {
    return (
      <div className="flex justify-center gap-3 my-1.5">
        {values.map((v, i) => (
          <input
            key={i}
            id={`${prefix}-${i}`}
            type="password"
            maxLength={1}
            inputMode="numeric"
            value={v}
            onChange={(e) => {
              setErrorMessage(null);
              const val = e.target.value.replace(/\D/g, '').slice(-1);
              const next = [...values];
              next[i] = val;
              setValues(next);
              if (val && i < 3) {
                document.getElementById(`${prefix}-${i + 1}`)?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !v && i > 0) {
                document.getElementById(`${prefix}-${i - 1}`)?.focus();
              }
            }}
            className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:border-[#F16521] focus:ring-2 focus:ring-orange-200 focus:outline-none shadow-xs"
          />
        ))}
      </div>
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const oldStr = oldMpin.join('');
    const newStr = newMpin.join('');
    const confStr = confirmMpin.join('');

    if (oldStr.length < 4) {
      setErrorMessage('Please enter complete 4-digit Old MPIN');
      return;
    }
    if (newStr.length < 4) {
      setErrorMessage('Please enter complete 4-digit New MPIN');
      return;
    }
    if (confStr.length < 4) {
      setErrorMessage('Please confirm your 4-digit New MPIN');
      return;
    }

    const currentSec = backendApiStore.getSecuritySettings();
    if (oldStr !== currentSec.currentMpin) {
      setErrorMessage('Incorrect Old MPIN! Current default is 1234.');
      showNativeAlert({
        title: 'Incorrect Old MPIN',
        message: 'The old MPIN you entered does not match your active MPIN. If you forgot your MPIN, reset it via Admin Panel.',
        type: 'error',
      });
      return;
    }

    if (newStr === oldStr) {
      setErrorMessage('New MPIN must be different from your old MPIN');
      return;
    }

    if (newStr !== confStr) {
      setErrorMessage('New MPIN and Confirm MPIN do not match!');
      return;
    }

    const updated = backendApiStore.updateUserMpin(newStr);
    if (updated) {
      showNativeAlert({
        title: 'MPIN Updated Successfully! 🎉',
        message: `Your new 4-digit MPIN has been saved and armed with 256-bit encryption. Use this new MPIN for future logins.`,
        type: 'success',
        onConfirm: () => onBack(),
      });
    }
  };

  return (
    <div
      className={`h-full flex flex-col ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      <div className="bg-[#F16521] px-4 py-3 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            <h3 className="font-bold text-base">Change MPIN</h3>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
          <ShieldCheck className="w-3 h-3" />
          <span>Active PIN: {backendApiStore.getSecuritySettings().currentMpin}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4 text-center">
          <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Enter Old MPIN
            </label>
            {renderBoxes(oldMpin, setOldMpin, 'old')}
            <span className="text-[10px] text-zinc-400">Current default is 1234</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Enter New 4-Digit MPIN
            </label>
            {renderBoxes(newMpin, setNewMpin, 'new')}
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-zinc-200/80 shadow-xs">
            <label className="text-xs font-bold text-zinc-700 block mb-1">
              Confirm New MPIN
            </label>
            {renderBoxes(confirmMpin, setConfirmMpin, 'confirm')}
          </div>

          {errorMessage && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center gap-1.5 text-red-600 text-xs font-bold">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#F16521] to-[#D84B06] hover:from-[#e05410] hover:to-[#c44307] text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer"
        >
          Update MPIN
        </button>
      </form>
    </div>
  );
};
