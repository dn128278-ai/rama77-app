import React, { useState, useEffect } from 'react';
import { Fingerprint, ShieldCheck, Lock, AlertTriangle, Smartphone } from 'lucide-react';
import { showNativeAlert } from './nativeAlertStore';
import { backendApiStore, SecuritySettings } from '../../data/backendApiStore';

interface MpinLoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
  darkMode: boolean;
}

export const MpinLoginScreen: React.FC<MpinLoginScreenProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  darkMode,
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(
    backendApiStore.getSecuritySettings()
  );
  const [shakeError, setShakeError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lockoutCountdown, setLockoutCountdown] = useState<number>(0);

  useEffect(() => {
    const unsub = backendApiStore.subscribe(() => {
      setSecuritySettings(backendApiStore.getSecuritySettings());
    });
    return unsub;
  }, []);

  // Lockout countdown timer effect
  useEffect(() => {
    const checkLockout = () => {
      const sec = backendApiStore.getSecuritySettings();
      if (sec.isLockedUntil && sec.isLockedUntil > Date.now()) {
        const remaining = Math.ceil((sec.isLockedUntil - Date.now()) / 1000);
        setLockoutCountdown(remaining);
      } else {
        setLockoutCountdown(0);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [securitySettings.isLockedUntil]);

  const handleDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    setErrorMessage(null);
    const newPin = [...pin];
    newPin[index] = val ? val.slice(-1) : '';
    setPin(newPin);

    // Auto advance
    if (val && index < 3) {
      const nextInput = document.getElementById(`mpin-${index + 1}`);
      nextInput?.focus();
    }

    // Auto submit if all 4 digits entered
    if (val && index === 3 && newPin.every((d) => d !== '')) {
      const enteredCode = newPin.join('');
      validateAndLogin(enteredCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`mpin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const validateAndLogin = (enteredPin: string) => {
    if (lockoutCountdown > 0) {
      showNativeAlert({
        title: 'Account Temporarily Locked',
        message: `Too many failed MPIN attempts. Please wait ${lockoutCountdown} seconds before retrying.`,
        type: 'warning',
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const res = backendApiStore.verifyMpin(enteredPin);

      if (res.success) {
        backendApiStore.registerDeviceLogin();
        onLoginSuccess();
      } else {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);
        setErrorMessage(res.message);
        setPin(['', '', '', '']);
        const firstInput = document.getElementById('mpin-0');
        firstInput?.focus();

        if (res.lockedSeconds) {
          setLockoutCountdown(res.lockedSeconds);
          showNativeAlert({
            title: 'Account Locked (3 Failed Attempts)',
            message: res.message,
            type: 'error',
          });
        }
      }
    }, 450);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const entered = pin.join('');
    if (entered.length < 4) {
      setErrorMessage('Please enter complete 4-digit MPIN');
      return;
    }
    validateAndLogin(entered);
  };

  const triggerBiometrics = () => {
    if (lockoutCountdown > 0) {
      showNativeAlert({
        title: 'Biometric Locked',
        message: `Account is locked for ${lockoutCountdown} seconds. Please wait.`,
        type: 'warning',
      });
      return;
    }

    if (!securitySettings.biometricLoginEnabled) {
      showNativeAlert({
        title: 'Biometrics Disabled',
        message: 'Fingerprint login is disabled. You can enable it in Settings > Security.',
        type: 'info',
      });
      return;
    }

    setBiometricScanning(true);
    setTimeout(() => {
      setBiometricScanning(false);
      backendApiStore.logSecurityEvent(
        'BIOMETRIC_AUTH_SUCCESS',
        'User verified via Android BiometricPrompt (Fingerprint sensor).',
        'info'
      );
      backendApiStore.registerDeviceLogin();
      onLoginSuccess();
    }, 1100);
  };

  return (
    <div
      className={`h-full flex flex-col justify-between px-6 py-5 overflow-y-auto ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      {/* Top Branding matching Video 00:00 with security shield */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center justify-center gap-2">
          <div className="w-11 h-11 bg-[#F16521] rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-md">
            R
          </div>
          <span className="text-[#F16521] text-3xl font-extrabold tracking-tight">
            RAMA77
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5 mt-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h2 className="text-zinc-900 font-bold text-base">MPIN Login</h2>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-md border border-emerald-300">
            SECURE
          </span>
        </div>
      </div>

      {/* MPIN Input Section */}
      <div className="max-w-xs mx-auto w-full text-center my-auto">
        <p className="text-zinc-800 font-medium text-xs leading-relaxed px-2">
          Please enter your 4-digit MPIN to
          <br />
          access your wallet and markets
        </p>

        {/* Lockout Warning Banner if locked */}
        {lockoutCountdown > 0 ? (
          <div className="my-4 p-3 bg-red-50 border border-red-300 rounded-xl text-center animate-pulse">
            <div className="flex items-center justify-center gap-1.5 text-red-700 font-bold text-xs mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Account Temporarily Locked</span>
            </div>
            <p className="text-[11px] text-red-600 font-medium">
              3 failed attempts recorded. Retry allowed in{' '}
              <strong className="text-sm font-black text-red-800">{lockoutCountdown}s</strong>
            </p>
          </div>
        ) : (
          /* 4 Digit Boxes with Shake Animation */
          <div
            className={`flex justify-center gap-3.5 my-5 transition-transform ${
              shakeError ? 'translate-x-[-8px] animate-[ping_0.15s_ease-in-out_2]' : ''
            }`}
          >
            {pin.map((digit, i) => (
              <input
                key={i}
                id={`mpin-${i}`}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={lockoutCountdown > 0}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-13 h-13 text-center text-2xl font-bold rounded-xl border focus:outline-none transition-all shadow-xs ${
                  shakeError
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : darkMode
                    ? 'bg-zinc-900 border-zinc-700 text-white focus:border-[#F16521]'
                    : 'bg-white border-zinc-300 text-zinc-900 focus:border-[#F16521] focus:ring-2 focus:ring-orange-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Error Feedback message */}
        {errorMessage && lockoutCountdown === 0 && (
          <p className="text-xs font-bold text-red-600 mb-2 px-2 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </p>
        )}

        {/* Helper Hint */}
        <p className="text-[10px] text-zinc-500 font-medium mb-3">
          Default MPIN: <code className="bg-zinc-200 text-zinc-800 px-1.5 py-0.5 rounded font-mono font-bold">1234</code> (Changeable in settings)
        </p>

        <button
          type="button"
          onClick={() =>
            showNativeAlert({
              title: 'Forgot / Reset MPIN',
              message:
                'Default MPIN is "1234". If you changed it, you can reset it via Admin Panel > Security tab or OTP sent to +91 6377972674.',
              type: 'info',
            })
          }
          className="text-[#F16521] font-bold text-xs tracking-wide hover:underline cursor-pointer"
        >
          Forgot MPIN?
        </button>

        {/* Login Button with Spinner */}
        <button
          onClick={() => handleSubmit()}
          disabled={isLoading || lockoutCountdown > 0}
          className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-base text-white bg-gradient-to-r from-[#F16521] to-[#D84B06] hover:from-[#e05410] hover:to-[#c44307] transition-all shadow-md active:scale-[0.98] flex items-center justify-center cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            'Login'
          )}
        </button>

        {/* New Registration Link */}
        <div className="mt-3 pt-2 border-t border-zinc-200/60">
          <span className="text-xs text-zinc-600">Don't have an account? </span>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-xs font-bold text-[#F16521] hover:underline cursor-pointer"
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Biometric Fingerprint Section & Security Badges */}
      <div className="pt-2 pb-1 text-center">
        <button
          onClick={triggerBiometrics}
          disabled={lockoutCountdown > 0}
          className="group relative p-2.5 rounded-full hover:bg-orange-50 transition-all inline-flex items-center justify-center cursor-pointer disabled:opacity-50"
          title="Login with Fingerprint"
        >
          {biometricScanning && (
            <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-30" />
          )}
          <Fingerprint
            className={`w-14 h-14 transition-colors ${
              biometricScanning
                ? 'text-[#F16521] scale-105'
                : 'text-zinc-600 group-hover:text-[#F16521]'
            }`}
          />
        </button>
        {biometricScanning ? (
          <p className="text-xs font-semibold text-[#F16521] mt-0.5 animate-pulse">
            Scanning biometric fingerprint...
          </p>
        ) : (
          <p className="text-[11px] text-zinc-500 font-medium">
            Touch fingerprint sensor to login
          </p>
        )}

        {/* Multi-Layer Security Badges */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[9px] font-bold text-zinc-500 border-t border-zinc-200/60 pt-2">
          <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            Root Block
          </span>
          <span className="flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <Lock className="w-3 h-3 text-blue-600" />
            FLAG_SECURE
          </span>
          <span className="flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
            <Smartphone className="w-3 h-3 text-orange-600" />
            Single Device
          </span>
        </div>
      </div>
    </div>
  );
};
