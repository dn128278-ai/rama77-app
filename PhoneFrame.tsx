import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Clock,
  BookOpen,
  Home,
  Wallet,
  Headphones,
  RotateCcw,
  Wifi,
} from 'lucide-react';
import { ScreenType, BottomTab, MarketItem, GameOption, GameSession } from '../../types';
import { INITIAL_MARKETS, GAME_OPTIONS } from '../../data/mockData';
import { DrawerMenu } from './DrawerMenu';
import { MpinLoginScreen } from './MpinLoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { HomeScreen } from './HomeScreen';
import { GameCenterScreen } from './GameCenterScreen';
import { SubGameBetScreen } from './SubGameBetScreen';
import { HistoryScreen } from './HistoryScreen';
import { PassbookScreen } from './PassbookScreen';
import { FundsScreen } from './FundsScreen';
import { SupportScreen } from './SupportScreen';
import { ChartsScreen } from './ChartsScreen';
import { GameRatesScreen } from './GameRatesScreen';
import { ChangeMpinScreen } from './ChangeMpinScreen';
import { SettingsScreen } from './SettingsScreen';
import { NotificationScreen } from './NotificationScreen';
import { SecurityCenterScreen } from './SecurityCenterScreen';
import { RootDetectionModal } from './RootDetectionModal';
import { ShareSheet } from './EmulatorModals';
import { NativeAlertDialog } from './NativeAlertDialog';
import { useNativeAlert, showNativeAlert } from './nativeAlertStore';
import { ShieldCheck, Lock } from 'lucide-react';
import { backendApiStore, UserAccount, SecuritySettings } from '../../data/backendApiStore';

interface PhoneFrameProps {
  currentScreen?: ScreenType;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = () => {
  const [screen, setScreen] = useState<ScreenType>('login');
  const [bottomTab, setBottomTab] = useState<BottomTab>('home');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { alert: nativeAlert, closeAlert: closeNativeAlert } = useNativeAlert();

  // Live user state from backendApiStore
  const [currentUser, setCurrentUser] = useState<UserAccount>(backendApiStore.getUser());
  const [unreadNotifs, setUnreadNotifs] = useState<number>(backendApiStore.getUnreadNotificationCount());

  // Security Suite & Single Device State
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(
    backendApiStore.getSecuritySettings()
  );
  const [activeSessionToken, setActiveSessionToken] = useState<string>(
    backendApiStore.getSecuritySettings().activeSessionToken
  );
  const [rootModalOpen, setRootModalOpen] = useState(false);

  // Active game center states
  const [activeMarket, setActiveMarket] = useState<MarketItem>(INITIAL_MARKETS[0]);
  const [activeGameOption, setActiveGameOption] = useState<GameOption>(GAME_OPTIONS[0]);
  const [activeSession, setActiveSession] = useState<GameSession>('Open');

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setCurrentUser(backendApiStore.getUser());
      setUnreadNotifs(backendApiStore.getUnreadNotificationCount());

      const sec = backendApiStore.getSecuritySettings();
      setSecuritySettings(sec);

      // Root detection check
      if (sec.rootDetectionEnabled && sec.isDeviceRootedSimulated) {
        setRootModalOpen(true);
      } else {
        setRootModalOpen(false);
      }

      // Single device login check:
      // If another device logged in or admin revoked session
      if (
        sec.singleDeviceLoginCheckEnabled &&
        screen !== 'login' &&
        screen !== 'register' &&
        activeSessionToken &&
        sec.activeSessionToken &&
        sec.activeSessionToken !== activeSessionToken
      ) {
        showNativeAlert({
          title: 'Session Terminated (Single Device Policy)',
          message: `Your account was logged in from ${sec.activeDeviceModel || 'another device'} (${sec.activeDeviceId}). Single-device policy has safely logged you out.`,
          type: 'warning',
        });
        setScreen('login');
        setBottomTab('home');
      }

      const currentMarkets = backendApiStore.getMarkets();
      const updated = currentMarkets.find((m) => m.id === activeMarket.id);
      if (updated) {
        setActiveMarket(updated);
      }
    });
    return unsub;
  }, [activeMarket.id, activeSessionToken, screen]);

  // FLAG_SECURE Screenshot & Screen Recording Interceptor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!securitySettings.screenshotRestrictionEnabled) return;

      if (
        e.key === 'PrintScreen' ||
        ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P' || e.key === 's' || e.key === 'S'))
      ) {
        e.preventDefault();
        showNativeAlert({
          title: 'Screenshot Restricted (FLAG_SECURE)',
          message:
            "Can't take screenshot: Screenshots and screen recordings are restricted by RAMA77 security policy (FLAG_SECURE active).",
          type: 'warning',
        });
        backendApiStore.logSecurityEvent(
          'FLAG_SECURE_KEY_INTERCEPTED',
          `Screenshot shortcut (${e.key}) intercepted and blocked by FLAG_SECURE.`,
          'warn'
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [securitySettings.screenshotRestrictionEnabled]);

  // Switch tab
  const handleTabClick = (tab: BottomTab) => {
    setBottomTab(tab);
    setScreen(tab);
  };

  const handleNavigate = (newScreen: ScreenType) => {
    setScreen(newScreen);
    if (['history', 'passbook', 'home', 'funds', 'support'].includes(newScreen)) {
      setBottomTab(newScreen as BottomTab);
    }
  };

  const resetToLogin = () => {
    setScreen('login');
    setBottomTab('home');
  };

  const handleLoginSuccess = () => {
    const currentSec = backendApiStore.getSecuritySettings();
    setActiveSessionToken(currentSec.activeSessionToken);
    handleNavigate('home');
  };

  return (
    <div className="relative mx-auto w-full max-w-[390px] h-[780px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-4 border-zinc-800 flex flex-col select-none overflow-hidden">
      {/* Screen Container with Fullscreen View */}
      <div
        className={`relative w-full h-full rounded-[38px] overflow-hidden flex flex-col ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
        }`}
      >
        {/* Global Toolbar (Visible when logged in and not on sub-activity screens) */}
        {screen !== 'login' &&
          screen !== 'register' &&
          screen !== 'game_center' &&
          screen !== 'sub_game_bet' &&
          !['charts', 'chart_detail', 'settings', 'game_rates', 'change_mpin', 'notifications', 'security'].includes(
            screen
          ) && (
            <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-zinc-200/80 shadow-xs z-20">
              {/* Drawer Toggle */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Logo in toolbar matching Video 00:08 */}
              <div
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => handleNavigate('home')}
              >
                <div className="w-6 h-6 bg-[#F16521] rounded-md flex items-center justify-center text-white font-black text-xs">
                  R
                </div>
                <span className="text-[#F16521] font-black text-base tracking-tight">
                  RAMA77
                </span>
              </div>

              {/* Wallet Chip & Icons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavigate('funds')}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 hover:bg-orange-50 border border-zinc-200 text-xs font-bold text-zinc-800 cursor-pointer"
                >
                  <Wallet className="w-3.5 h-3.5 text-zinc-500" />
                  <span>₹{currentUser.balance}</span>
                </button>

                <button
                  onClick={() => handleNavigate('security')}
                  className="p-1 text-emerald-600 hover:text-emerald-700 cursor-pointer relative"
                  title="Security & Privacy Center (Root, FLAG_SECURE, Single Device, MPIN)"
                >
                  <ShieldCheck className="w-4 h-4 stroke-[2.3]" />
                </button>

                <button
                  onClick={() => handleNavigate('notifications')}
                  className="p-1 text-zinc-600 hover:text-zinc-900 cursor-pointer relative"
                  title="Notices & Announcements"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[15px] h-3.5 px-0.5 bg-[#F16521] text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse shadow-xs">
                      {unreadNotifs > 9 ? '9+' : unreadNotifs}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

        {/* Dynamic Screen View */}
        <div className="flex-1 overflow-hidden relative">
          {screen === 'login' && (
            <MpinLoginScreen
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => handleNavigate('register')}
              darkMode={darkMode}
            />
          )}

          {screen === 'register' && (
            <RegisterScreen
              onBackToLogin={() => handleNavigate('login')}
              onRegisterSuccess={(phone) => {
                backendApiStore.getUser().phone = phone;
                handleNavigate('home');
              }}
              darkMode={darkMode}
            />
          )}

          {screen === 'home' && (
            <HomeScreen
              onSelectMarket={(market) => {
                setActiveMarket(market);
                handleNavigate('game_center');
              }}
              darkMode={darkMode}
            />
          )}

          {screen === 'game_center' && (
            <GameCenterScreen
              market={activeMarket}
              onBack={() => handleNavigate('home')}
              onSelectGame={(gameOption, session) => {
                setActiveGameOption(gameOption);
                setActiveSession(session);
                handleNavigate('sub_game_bet');
              }}
              darkMode={darkMode}
            />
          )}

          {screen === 'sub_game_bet' && (
            <SubGameBetScreen
              market={activeMarket}
              gameOption={activeGameOption}
              session={activeSession}
              onBack={() => handleNavigate('game_center')}
              onBetPlaced={() => {
                // Handled internally through backendApiStore.placeBidFromApp
              }}
              darkMode={darkMode}
            />
          )}

          {screen === 'history' && <HistoryScreen darkMode={darkMode} />}

          {screen === 'passbook' && <PassbookScreen darkMode={darkMode} />}

          {screen === 'funds' && <FundsScreen darkMode={darkMode} />}

          {screen === 'support' && <SupportScreen darkMode={darkMode} />}

          {screen === 'charts' && (
            <ChartsScreen
              onBack={() => handleNavigate('home')}
              darkMode={darkMode}
            />
          )}

          {screen === 'game_rates' && (
            <GameRatesScreen
              onBack={() => handleNavigate('home')}
              darkMode={darkMode}
            />
          )}

          {screen === 'change_mpin' && (
            <ChangeMpinScreen
              onBack={() => handleNavigate('home')}
              darkMode={darkMode}
            />
          )}

          {screen === 'settings' && (
            <SettingsScreen
              onBack={() => handleNavigate('home')}
              onNavigateSecurity={() => handleNavigate('security')}
              onNavigateChangeMpin={() => handleNavigate('change_mpin')}
              darkMode={darkMode}
            />
          )}

          {screen === 'security' && (
            <SecurityCenterScreen
              onBack={() => handleNavigate('home')}
              onNavigateChangeMpin={() => handleNavigate('change_mpin')}
              onLockApp={() => {
                setScreen('login');
                setBottomTab('home');
              }}
              darkMode={darkMode}
            />
          )}

          {screen === 'notifications' && (
            <NotificationScreen
              onBack={() => handleNavigate('home')}
              darkMode={darkMode}
            />
          )}
        </div>

        {/* Bottom Navigation Bar (5 tabs matching Video: History, Passbook, Home, Funds, Support) */}
        {screen !== 'login' &&
          screen !== 'register' &&
          screen !== 'game_center' &&
          screen !== 'sub_game_bet' &&
          !['charts', 'chart_detail', 'settings', 'game_rates', 'change_mpin', 'notifications', 'security'].includes(
            screen
          ) && (
            <div className="h-16 bg-white border-t border-zinc-200/80 px-2 flex items-center justify-around z-30 shadow-lg">
              {/* History */}
              <button
                onClick={() => handleTabClick('history')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                  bottomTab === 'history' ? 'text-[#F16521]' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Clock className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-0.5">History</span>
              </button>

              {/* Passbook */}
              <button
                onClick={() => handleTabClick('passbook')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                  bottomTab === 'passbook' ? 'text-[#F16521]' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-0.5">Passbook</span>
              </button>

              {/* Home */}
              <button
                onClick={() => handleTabClick('home')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                  bottomTab === 'home' ? 'text-[#F16521]' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Home className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-0.5">Home</span>
              </button>

              {/* Funds */}
              <button
                onClick={() => handleTabClick('funds')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                  bottomTab === 'funds' ? 'text-[#F16521]' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Wallet className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-0.5">Funds</span>
              </button>

              {/* Support */}
              <button
                onClick={() => handleTabClick('support')}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-colors cursor-pointer ${
                  bottomTab === 'support' ? 'text-[#F16521]' : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <Headphones className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[10px] font-bold mt-0.5">Support</span>
              </button>
            </div>
          )}

        {/* Android Bottom Home Gesture Pill Indicator */}
        <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-zinc-400 rounded-full z-40 pointer-events-none" />

        {/* Side Drawer Component */}
        <DrawerMenu
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onNavigate={handleNavigate}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onShareApp={() => setShowShareModal(true)}
        />

        {/* Share Sheet */}
        <ShareSheet
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />

        {/* Root Detection & Device Integrity Tamper Modal */}
        <RootDetectionModal
          isOpen={rootModalOpen}
          onDismiss={() => setRootModalOpen(false)}
        />

        {/* In-App Native Android Dialog (replaces all web alerts) */}
        <NativeAlertDialog
          dialog={nativeAlert}
          onClose={closeNativeAlert}
        />
      </div>

      {/* External Emulator Controls Float Tooltip */}
      <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 whitespace-nowrap text-xs text-zinc-400">
        <button
          onClick={resetToLogin}
          className="flex items-center gap-1 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart App Session</span>
        </button>
      </div>
    </div>
  );
};
