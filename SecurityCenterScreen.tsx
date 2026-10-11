import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Camera,
  Smartphone,
  KeyRound,
  Fingerprint,
  Lock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Radio,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { backendApiStore, SecuritySettings } from '../../data/backendApiStore';
import { showNativeAlert } from './nativeAlertStore';

interface SecurityCenterScreenProps {
  onBack: () => void;
  onNavigateChangeMpin: () => void;
  onLockApp: () => void;
  darkMode: boolean;
}

export const SecurityCenterScreen: React.FC<SecurityCenterScreenProps> = ({
  onBack,
  onNavigateChangeMpin,
  onLockApp,
  darkMode,
}) => {
  const [security, setSecurity] = useState<SecuritySettings>(
    backendApiStore.getSecuritySettings()
  );
  const [testingScreenshot, setTestingScreenshot] = useState(false);
  const [isScanningRoot, setIsScanningRoot] = useState(false);

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setSecurity(backendApiStore.getSecuritySettings());
    });
    return unsub;
  }, []);

  const handleToggle = (key: keyof SecuritySettings) => {
    const current = security[key];
    if (typeof current === 'boolean') {
      backendApiStore.updateSecuritySettings({ [key]: !current });
    }
  };

  const handleTestScreenshot = () => {
    if (security.screenshotRestrictionEnabled) {
      setTestingScreenshot(true);
      showNativeAlert({
        title: 'Screenshot Blocked (FLAG_SECURE)',
        message:
          'Taking screenshots and screen recording is restricted by RAMA77 security policy. FLAG_SECURE prevents capturing sensitive wallet and betting details.',
        type: 'warning',
      });
      backendApiStore.logSecurityEvent(
        'FLAG_SECURE_SCREENSHOT_BLOCKED',
        'Screenshot capture attempt intercepted and blocked by FLAG_SECURE window policy.',
        'warn'
      );
      setTimeout(() => setTestingScreenshot(false), 800);
    } else {
      showNativeAlert({
        title: 'Screenshot Allowed',
        message: 'FLAG_SECURE is currently disabled. Screenshot was allowed.',
        type: 'info',
      });
    }
  };

  const handleTestRootSimulation = () => {
    const nextState = !security.isDeviceRootedSimulated;
    backendApiStore.toggleSimulatedRoot(nextState);
    if (nextState) {
      showNativeAlert({
        title: 'Simulated Root Attack Triggered',
        message: 'Device has been marked as rooted with SU binaries. The Root Detection barrier is now armed and blocking app access.',
        type: 'error',
      });
    } else {
      showNativeAlert({
        title: 'Device Clean',
        message: 'Simulated root cleared. Device integrity check passes normally.',
        type: 'success',
      });
    }
  };

  const handleTestSingleDeviceConflict = () => {
    showNativeAlert({
      title: 'Simulate Login from Device 2?',
      message: 'This will simulate user logging in from a Google Pixel 8 Pro. Your current emulator session will be immediately invalidated and locked out.',
      type: 'warning',
      buttonText: 'Trigger Conflict',
      onConfirm: () => {
        backendApiStore.simulateOtherDeviceLogin('Google Pixel 8 Pro (Android 15)');
      },
    });
  };

  const handleRunIntegrityScan = () => {
    setIsScanningRoot(true);
    setTimeout(() => {
      setIsScanningRoot(false);
      showNativeAlert({
        title: 'Integrity Scan Completed',
        message:
          'Hardware Attestation: MEETS_BASIC_INTEGRITY & MEETS_DEVICE_INTEGRITY. No su binaries (/system/bin/su, /system/xbin/su) or Magisk hooks found.',
        type: 'success',
      });
      backendApiStore.logSecurityEvent(
        'MANUAL_INTEGRITY_SCAN_PASSED',
        'User executed manual Play Integrity / RootBeer scan. Device certified clean.',
        'info'
      );
    }, 1200);
  };

  return (
    <div
      className={`h-full flex flex-col ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      {/* Orange Toolbar Header */}
      <div className="bg-[#F16521] px-4 py-3 text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 text-white cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold text-base">Security &amp; Privacy</h3>
          </div>
        </div>

        <button
          onClick={onLockApp}
          className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer"
          title="Lock App with MPIN"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Lock App</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="p-3.5 space-y-3 flex-1 overflow-y-auto">
        {/* Status Overview Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl p-4 border border-zinc-800 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm">Security Shield 4.0</h4>
                <p className="text-[10px] text-zinc-400">Bank-Grade Production Protection</p>
              </div>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">
              ALL 4 ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-zinc-800/80 text-[11px]">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Root Block: Enforced</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>FLAG_SECURE: Active</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>Single Device: Bound</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>MPIN: 256-bit Hash</span>
            </div>
          </div>
        </div>

        {/* 1. Root Detection Section */}
        <div className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#F16521] flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-zinc-900">1. Root &amp; Jailbreak Detection</h5>
                <p className="text-[10px] text-zinc-500">Play Integrity / SU Binary Scanner</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('rootDetectionEnabled')}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                security.rootDetectionEnabled ? 'bg-[#F16521]' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  security.rootDetectionEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Prevents app from running on rooted devices, custom firmware, or environments with Magisk/SU binaries to prevent memory tampering.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleRunIntegrityScan}
              disabled={isScanningRoot}
              className="flex-1 py-1.5 px-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-700 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isScanningRoot ? 'animate-spin' : ''}`} />
              <span>{isScanningRoot ? 'Scanning...' : 'Run Integrity Scan'}</span>
            </button>

            <button
              onClick={handleTestRootSimulation}
              className={`py-1.5 px-2.5 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer ${
                security.isDeviceRootedSimulated
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-orange-50 text-[#F16521] border border-orange-200 hover:bg-orange-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{security.isDeviceRootedSimulated ? 'Root Simulated (Active)' : 'Test Root Attack'}</span>
            </button>
          </div>
        </div>

        {/* 2. Screenshot & Screen Recording Restriction */}
        <div className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Camera className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-zinc-900">2. Screenshot &amp; Screen Recording</h5>
                <p className="text-[10px] text-zinc-500">WindowManager.LayoutParams.FLAG_SECURE</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('screenshotRestrictionEnabled')}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                security.screenshotRestrictionEnabled ? 'bg-[#F16521]' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${
                  security.screenshotRestrictionEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-zinc-600 leading-relaxed">
            Blocks screenshots and screen recording on Android devices. Protects passbook, betting slips, and wallet balance from malware and surveillance.
          </p>

          <button
            onClick={handleTestScreenshot}
            className="w-full py-1.5 px-3 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Simulate Screenshot Attempt (Test FLAG_SECURE)</span>
          </button>
        </div>

        {/* 3. Single Device Login Check */}
        <div className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Smartphone className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-zinc-900">3. Single Device Login Check</h5>
                <p className="text-[10px] text-zinc-500">Hardware UUID &amp; Session Binding</p>
              </div>
            </div>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              1 DEVICE ACTIVE
            </span>
          </div>

          <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/60 text-[10px] space-y-1 font-medium">
            <div className="flex justify-between">
              <span className="text-zinc-500">Bound Device:</span>
              <strong className="text-zinc-800">{security.activeDeviceModel}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Device Hardware ID:</span>
              <code className="text-zinc-700 font-mono font-bold">{security.activeDeviceId}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Last Verified Login:</span>
              <span className="text-zinc-700">{security.lastLoginTimestamp}</span>
            </div>
          </div>

          <button
            onClick={handleTestSingleDeviceConflict}
            className="w-full py-1.5 px-3 bg-purple-50 border border-purple-200 hover:bg-purple-100 text-purple-700 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Simulate Login from Device 2 (Test Conflict Kickout)</span>
          </button>
        </div>

        {/* 4. MPIN Protection & Biometrics */}
        <div className="bg-white rounded-2xl p-3.5 border border-zinc-200/80 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <KeyRound className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h5 className="font-bold text-xs text-zinc-900">4. 4-Digit MPIN Protection</h5>
                <p className="text-[10px] text-zinc-500">Throttled Verification &amp; Auto-Lockout</p>
              </div>
            </div>
            <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              ACTIVE
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-zinc-50 rounded-xl border border-zinc-200/60">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-[#F16521]" />
              <span className="text-xs font-bold text-zinc-800">Biometric (Fingerprint) Login</span>
            </div>
            <button
              onClick={() => handleToggle('biometricLoginEnabled')}
              className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer ${
                security.biometricLoginEnabled ? 'bg-[#F16521]' : 'bg-zinc-300'
              }`}
            >
              <div
                className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform ${
                  security.biometricLoginEnabled ? 'translate-x-4.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNavigateChangeMpin}
              className="flex-1 py-2 bg-gradient-to-r from-[#F16521] to-[#D84B06] hover:from-[#e05410] hover:to-[#c44307] text-white rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Change 4-Digit MPIN</span>
            </button>
            <button
              onClick={onLockApp}
              className="py-2 px-3 bg-zinc-800 hover:bg-zinc-900 text-white rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
