import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, ChevronRight, Lock, KeyRound, Smartphone, Camera } from 'lucide-react';
import { backendApiStore, SecuritySettings } from '../../data/backendApiStore';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigateSecurity?: () => void;
  onNavigateChangeMpin?: () => void;
  darkMode: boolean;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onNavigateSecurity,
  onNavigateChangeMpin,
  darkMode,
}) => {
  const [security, setSecurity] = useState<SecuritySettings>(
    backendApiStore.getSecuritySettings()
  );
  const [settings, setSettings] = useState({
    rama77Results: true,
    starlineResults: true,
    jackpotResults: true,
    winningNotifications: true,
    generalNotifications: true,
  });

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setSecurity(backendApiStore.getSecuritySettings());
    });
    return unsub;
  }, []);

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const items: { key: keyof typeof settings; label: string }[] = [
    { key: 'rama77Results', label: 'RAMA77 Result Notifications' },
    { key: 'starlineResults', label: 'Starline Result Notifications' },
    { key: 'jackpotResults', label: 'Jackpot Result Notifications' },
    { key: 'winningNotifications', label: 'Winning Notifications' },
    { key: 'generalNotifications', label: 'General Notifications' },
  ];

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
          <h3 className="font-bold text-base">Settings</h3>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Security & Protection Banner Card */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-gradient-to-r from-orange-500/10 to-orange-500/5 border-b border-orange-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#F16521] text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900">Security &amp; Privacy Shield</h4>
                <p className="text-[10px] text-zinc-500">Device Integrity &amp; Wallet Lock</p>
              </div>
            </div>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              ACTIVE
            </span>
          </div>

          <div className="p-3 space-y-2 text-xs">
            {/* Quick status list */}
            <div className="space-y-1.5 text-[11px] text-zinc-600">
              <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Root Detection
                </span>
                <span className="font-bold text-emerald-700">Protected (SU Blocked)</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-blue-600" />
                  FLAG_SECURE
                </span>
                <span className="font-bold text-blue-700">Screenshots Restricted</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                  Single Device Binding
                </span>
                <span className="font-bold text-purple-700">1 Device Only</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-orange-600" />
                  4-Digit MPIN
                </span>
                <span className="font-bold text-zinc-800 font-mono">**** Active</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-2">
              {onNavigateSecurity && (
                <button
                  onClick={onNavigateSecurity}
                  className="flex-1 py-2 px-3 bg-[#F16521] hover:bg-[#e05410] text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Security Center</span>
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              )}

              {onNavigateChangeMpin && (
                <button
                  onClick={onNavigateChangeMpin}
                  className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Change MPIN</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications Group */}
        <div>
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-1">
            Notification Preferences
          </h4>
          <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-xs divide-y divide-zinc-100 overflow-hidden">
            {items.map((item) => {
              const isChecked = settings[item.key];
              return (
                <div
                  key={item.key}
                  className="p-3.5 flex items-center justify-between hover:bg-orange-50/30 transition-colors"
                >
                  <span className="font-bold text-xs text-zinc-800">
                    {item.label}
                  </span>

                  <button
                    onClick={() => toggle(item.key)}
                    className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                      isChecked ? 'bg-[#F16521]' : 'bg-zinc-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                        isChecked ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
