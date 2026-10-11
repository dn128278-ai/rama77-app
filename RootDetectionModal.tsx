import React, { useState } from 'react';
import { ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2, XCircle, Terminal, HelpCircle } from 'lucide-react';
import { backendApiStore } from '../../data/backendApiStore';

interface RootDetectionModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const RootDetectionModal: React.FC<RootDetectionModalProps> = ({
  isOpen,
  onDismiss,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  if (!isOpen) return null;

  const handleRescan = () => {
    setScanning(true);
    setScanComplete(false);
    setTimeout(() => {
      setScanning(false);
      setScanComplete(true);
      // Auto-turn off simulated root if user rescanned and wants to pass
      backendApiStore.toggleSimulatedRoot(false);
      backendApiStore.logSecurityEvent(
        'DEVICE_INTEGRITY_RECHECK',
        'Device re-scan completed. Root status cleared. Access restored.',
        'info'
      );
      setTimeout(() => {
        onDismiss();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[325px] bg-zinc-900 border-2 border-red-500/80 rounded-3xl p-5 shadow-[0_0_50px_rgba(239,68,68,0.4)] text-white text-center flex flex-col items-center animate-in zoom-in-95 duration-200">
        {/* Pulsing Red Warning Shield */}
        <div className="relative mb-3">
          <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-500 flex items-center justify-center text-red-400 shadow-lg">
            <ShieldAlert className="w-9 h-9 stroke-[2.2] animate-pulse" />
          </div>
          <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border border-red-400 uppercase tracking-wider">
            Blocked
          </span>
        </div>

        <h3 className="text-base font-black text-white tracking-tight leading-snug">
          Root Access Detected!
        </h3>
        <p className="text-[11px] font-bold text-red-400 uppercase tracking-wider mt-0.5 mb-2.5">
          Play Integrity &amp; RootBeer Violation
        </p>

        <p className="text-xs text-zinc-300 leading-relaxed px-1 mb-3">
          For wallet protection and anti-tampering compliance, <strong className="text-white">RAMA77</strong> does not run on rooted, modified, or jailbroken devices.
        </p>

        {/* Diagnostic Binary Checks */}
        <div className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-2.5 mb-4 text-left font-mono text-[10px] space-y-1.5">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-red-400" />
              /system/bin/su
            </span>
            <span className="text-red-400 font-bold flex items-center gap-0.5">
              <XCircle className="w-3 h-3" /> FOUND
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-red-400" />
              Magisk / KernelSU
            </span>
            <span className="text-red-400 font-bold flex items-center gap-0.5">
              <XCircle className="w-3 h-3" /> ACTIVE
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-red-400" />
              Build Tags
            </span>
            <span className="text-amber-400 font-bold flex items-center gap-0.5">
              test-keys
            </span>
          </div>
          <div className="flex items-center justify-between text-zinc-400">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-red-400" />
              Play Integrity
            </span>
            <span className="text-red-400 font-bold">FAIL (MEETS_DEVICE)</span>
          </div>
        </div>

        {scanComplete ? (
          <div className="w-full p-2.5 bg-emerald-950/80 border border-emerald-500 rounded-xl text-emerald-300 text-xs font-bold mb-3 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Root cleaned! Access Unlocked.</span>
          </div>
        ) : null}

        {/* Buttons */}
        <div className="w-full space-y-2">
          <button
            onClick={handleRescan}
            disabled={scanning}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
            <span>{scanning ? 'Scanning Device Binaries...' : 'Re-scan Device Integrity'}</span>
          </button>

          <button
            onClick={() => {
              backendApiStore.toggleSimulatedRoot(false);
              onDismiss();
            }}
            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs cursor-pointer transition-colors"
          >
            Bypass / Dev Sandbox Mode
          </button>
        </div>

        <p className="text-[10px] text-zinc-500 mt-3">
          Error Ref: SEC-ROOT-FAIL-04 · Rama77 Production Guard
        </p>
      </div>
    </div>
  );
};
