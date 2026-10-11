import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { NativeAlertData } from './nativeAlertStore';

interface NativeAlertDialogProps {
  dialog: NativeAlertData | null;
  onClose: () => void;
}

export const NativeAlertDialog: React.FC<NativeAlertDialogProps> = ({
  dialog,
  onClose,
}) => {
  if (!dialog) return null;

  const handleAction = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    onClose();
  };

  const getIcon = () => {
    switch (dialog.type) {
      case 'success':
        return (
          <div className="w-14 h-14 rounded-full bg-emerald-100 border-4 border-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs mb-3">
            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
          </div>
        );
      case 'error':
        return (
          <div className="w-14 h-14 rounded-full bg-red-100 border-4 border-red-50 text-red-600 flex items-center justify-center shadow-xs mb-3">
            <AlertCircle className="w-7 h-7 stroke-[2.5]" />
          </div>
        );
      case 'warning':
        return (
          <div className="w-14 h-14 rounded-full bg-amber-100 border-4 border-amber-50 text-amber-600 flex items-center justify-center shadow-xs mb-3">
            <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="w-14 h-14 rounded-full bg-orange-100 border-4 border-orange-50 text-[#E85D04] flex items-center justify-center shadow-xs mb-3">
            <Info className="w-7 h-7 stroke-[2.5]" />
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-5 animate-in fade-in duration-150">
      <div className="w-full max-w-[310px] bg-white rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150 relative border border-zinc-100">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {getIcon()}

        <h4 className="font-black text-base text-zinc-900 mb-1.5 px-2 leading-snug">
          {dialog.title}
        </h4>

        <div className="text-xs text-zinc-600 font-medium mb-5 px-1 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
          {dialog.message}
        </div>

        <button
          type="button"
          onClick={handleAction}
          className="w-full py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#d85404] active:scale-95 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
        >
          {dialog.buttonText || 'OK'}
        </button>
      </div>
    </div>
  );
};
