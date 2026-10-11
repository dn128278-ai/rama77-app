import React from 'react';
import {
  Home,
  TrendingUp,
  KeyRound,
  ShieldCheck,
  Bell,
  HelpCircle,
  MessageSquare,
  Coins,
  FileText,
  Settings,
  Globe,
  Moon,
  Share2,
  LogOut,
  X,
} from 'lucide-react';
import { ScreenType } from '../../types';
import { USER_PROFILE } from '../../data/mockData';
import { backendApiStore } from '../../data/backendApiStore';
import { showNativeAlert } from './nativeAlertStore';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShareApp: () => void;
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  isOpen,
  onClose,
  onNavigate,
  darkMode,
  onToggleDarkMode,
  onShareApp,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content matching RAMA77 sidebar (00:23 / 01:15 in video) */}
      <div
        className={`relative w-[82%] max-w-[320px] h-full overflow-y-auto flex flex-col z-10 shadow-2xl transition-transform ${
          darkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-800'
        }`}
      >
        {/* Orange Profile Header */}
        <div className="bg-gradient-to-r from-[#F16521] to-[#E05410] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-zinc-700 shadow-sm border border-orange-200">
              <svg
                className="w-8 h-8 text-zinc-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">{USER_PROFILE.name}</h3>
              <p className="text-orange-100 text-sm font-medium mt-0.5">
                {USER_PROFILE.phone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items List */}
        <div className="flex-1 py-3 px-2 space-y-0.5 text-sm font-medium">
          <button
            onClick={() => {
              onNavigate('home');
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <Home className="w-5 h-5 text-zinc-600" />
            <span>Home</span>
          </button>

          <button
            onClick={() => {
              onNavigate('charts');
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-zinc-600" />
            <span>Charts</span>
          </button>

          <button
            onClick={() => {
              onNavigate('change_mpin');
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <KeyRound className="w-5 h-5 text-zinc-600" />
            <span>Change MPIN</span>
          </button>

          <button
            onClick={() => {
              onNavigate('security');
              onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Security &amp; Privacy</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
              Active
            </span>
          </button>

          <button
            onClick={() => {
              onNavigate('notifications');
              onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <Bell className="w-5 h-5 text-zinc-600" />
              <span>Notifications</span>
            </div>
            {backendApiStore.getUnreadNotificationCount() > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#F16521] text-white text-[10px] font-black shadow-xs">
                {backendApiStore.getUnreadNotificationCount()} new
              </span>
            )}
          </button>

          <button
            onClick={() => {
              showNativeAlert({
                title: 'How To Play?',
                message: 'Select market from home screen, choose your desired game type (Single Digit, Jodi, Pana, etc.), enter digits with points, and submit your bid!',
                type: 'info',
              });
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-zinc-600" />
            <span>How To Play?</span>
          </button>

          <button
            onClick={() => {
              showNativeAlert({
                title: 'Feedback',
                message: 'Thank you for your feedback! Rama77 team regularly reviews user ideas to improve the platform.',
                type: 'success',
              });
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-zinc-600" />
            <span>Submit User Ideas</span>
          </button>

          <button
            onClick={() => {
              onNavigate('game_rates');
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <Coins className="w-5 h-5 text-zinc-600" />
            <span>Game Rates</span>
          </button>

          <button
            onClick={() => {
              showNativeAlert({
                title: 'Terms & Conditions',
                message: 'Please play responsibly. All games adhere to standard industry win ratios and verified payout calculations.',
                type: 'info',
              });
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <FileText className="w-5 h-5 text-zinc-600" />
            <span>Terms &amp; Conditions</span>
          </button>

          <button
            onClick={() => {
              onNavigate('settings');
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <Settings className="w-5 h-5 text-zinc-600" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              showNativeAlert({
                title: 'Language',
                message: 'Language options available: English, हिन्दी. Default is set to English.',
                type: 'info',
              });
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <Globe className="w-5 h-5 text-zinc-600" />
            <span>Language</span>
          </button>

          {/* Dark Mode with Toggle Switch matching video */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl">
            <div className="flex items-center gap-4">
              <Moon className="w-5 h-5 text-zinc-600" />
              <span>Dark Mode</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                darkMode ? 'bg-[#F16521]' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => {
              onShareApp();
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-orange-50 text-left transition-colors"
          >
            <Share2 className="w-5 h-5 text-zinc-600" />
            <span>Share App</span>
          </button>

          <button
            onClick={() => {
              onNavigate('login');
              onClose();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-left transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit app</span>
          </button>
        </div>

        {/* App Version Footer */}
        <div className="p-4 border-t border-zinc-100 text-xs text-zinc-400">
          App Version: {USER_PROFILE.appVersion}
        </div>
      </div>
    </div>
  );
};
