import React, { useState } from 'react';
import {
  ArrowLeft,
  Smartphone,
  Lock,
  Tag,
  Eye,
  EyeOff,
  Fingerprint,
  CheckCircle2,
  Gift,
  ShieldCheck,
} from 'lucide-react';

interface RegisterScreenProps {
  onBackToLogin: () => void;
  onRegisterSuccess: (userPhone: string) => void;
  darkMode: boolean;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onBackToLogin,
  onRegisterSuccess,
  darkMode,
}) => {
  const [step, setStep] = useState<'details' | 'mpin'>('details');

  // Step 1: Form state
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [promoCode, setPromoCode] = useState('RAMA100');
  const [showPassword, setShowPassword] = useState(false);
  const [promoApplied, setPromoApplied] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Step 2: MPIN Setup state
  const [newPin, setNewPin] = useState(['', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '']);
  const [enableBiometrics, setEnableBiometrics] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationDone, setRegistrationDone] = useState(false);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    setErrorMsg('');
    setStep('mpin');
  };

  const handlePinChange = (
    index: number,
    value: string,
    isConfirm: boolean
  ) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const targetArr = isConfirm ? [...confirmPin] : [...newPin];
    targetArr[index] = digit;

    if (isConfirm) {
      setConfirmPin(targetArr);
      if (digit && index < 3) {
        document.getElementById(`reg-cpin-${index + 1}`)?.focus();
      }
    } else {
      setNewPin(targetArr);
      if (digit && index < 3) {
        document.getElementById(`reg-npin-${index + 1}`)?.focus();
      }
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const pin1 = newPin.join('');
    const pin2 = confirmPin.join('');

    if (pin1.length < 4) {
      setErrorMsg('Please enter a 4-digit MPIN.');
      return;
    }
    if (pin1 !== pin2) {
      setErrorMsg('New MPIN and Confirm MPIN do not match!');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setRegistrationDone(true);
      setTimeout(() => {
        onRegisterSuccess(mobileNumber || '6377972674');
      }, 1200);
    }, 1000);
  };

  return (
    <div
      className={`h-full flex flex-col justify-between overflow-y-auto ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 flex items-center justify-between border-b border-zinc-200/80 bg-white shadow-xs">
        <button
          onClick={step === 'mpin' ? () => setStep('details') : onBackToLogin}
          className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 bg-[#F16521] rounded-md flex items-center justify-center text-white font-black text-xs">
            R
          </div>
          <span className="text-[#F16521] font-black text-base tracking-tight">
            RAMA77
          </span>
        </div>
        <span className="text-xs font-bold text-zinc-400">
          Step {step === 'details' ? '1/2' : '2/2'}
        </span>
      </div>

      {registrationDone ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600 shadow-md">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900">Registration Successful!</h3>
          <p className="text-xs text-zinc-500 mt-2 max-w-xs">
            Your RAMA77 account and MPIN have been configured. Redirecting directly to Home Dashboard...
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-orange-600 font-bold bg-orange-50 px-3 py-1.5 rounded-full">
            <Gift className="w-3.5 h-3.5" />
            <span>₹100 Welcome Bonus Added to Wallet!</span>
          </div>
        </div>
      ) : step === 'details' ? (
        /* Step 1: Mobile, Password, Promo Code */
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-center pt-2 mb-2">
              <h2 className="text-2xl font-black text-zinc-900">New Registration</h2>
              <p className="text-xs text-zinc-500 mt-1">
                Create your RAMA77 gaming and matka account
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center">
                {errorMsg}
              </div>
            )}

            {/* Mobile Number Field */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 text-xs font-bold">
                  +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit mobile"
                  value={mobileNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setMobileNumber(val);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-300 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#F16521] focus:ring-1 focus:ring-orange-200 shadow-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-white border border-zinc-300 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:border-[#F16521] focus:ring-1 focus:ring-orange-200 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Promo Code Field */}
            <div>
              <label className="text-xs font-bold text-zinc-700 flex items-center justify-between mb-1.5">
                <span>Promo Code (Optional)</span>
                <span className="text-[11px] text-[#F16521] font-semibold">Special Offer</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                  <Tag className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="Enter promo / referral code"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoApplied(true);
                  }}
                  className="w-full pl-11 pr-24 py-3 bg-white border border-zinc-300 rounded-xl text-sm font-bold text-zinc-900 uppercase focus:outline-none focus:border-[#F16521] shadow-xs"
                />
                <div className="absolute inset-y-1.5 right-1.5">
                  <button
                    type="button"
                    onClick={() => setPromoApplied(true)}
                    className="h-full px-3 bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    {promoApplied ? 'Applied ✓' : 'Apply'}
                  </button>
                </div>
              </div>
              {promoApplied && (
                <p className="text-[11px] text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>Promo {promoCode} applied: ₹100 Welcome Bonus on 1st deposit!</span>
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button
              onClick={handleDetailsSubmit}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#F16521] to-[#D84B06] hover:from-[#e05410] hover:to-[#c44307] text-white font-bold text-base rounded-xl shadow-md transition-transform active:scale-[0.98] cursor-pointer"
            >
              Continue to Setup MPIN
            </button>

            <div className="text-center">
              <span className="text-xs text-zinc-500">
                Already have an account?{' '}
              </span>
              <button
                type="button"
                onClick={onBackToLogin}
                className="text-xs font-bold text-[#F16521] hover:underline"
              >
                Login with MPIN
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Step 2: Set New MPIN & Biometrics Setup */
        <div className="p-6 flex-1 flex flex-col justify-between animate-in slide-in-from-right duration-150">
          <div className="space-y-4">
            <div className="text-center pt-2 mb-2">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-[#F16521] mx-auto mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900">Set Up 4-Digit MPIN</h2>
              <p className="text-xs text-zinc-500 mt-1">
                You will use this 4-digit PIN for instant daily logins
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium text-center">
                {errorMsg}
              </div>
            )}

            {/* Enter New MPIN */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs text-center">
              <label className="text-xs font-bold text-zinc-700 block mb-2">
                Enter New 4-Digit MPIN
              </label>
              <div className="flex justify-center gap-3">
                {newPin.map((digit, i) => (
                  <input
                    key={i}
                    id={`reg-npin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value, false)}
                    className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-zinc-300 focus:border-[#F16521] focus:ring-1 focus:ring-orange-200 focus:outline-none"
                  />
                ))}
              </div>
            </div>

            {/* Confirm New MPIN */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs text-center">
              <label className="text-xs font-bold text-zinc-700 block mb-2">
                Confirm 4-Digit MPIN
              </label>
              <div className="flex justify-center gap-3">
                {confirmPin.map((digit, i) => (
                  <input
                    key={i}
                    id={`reg-cpin-${i}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value, true)}
                    className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-zinc-300 focus:border-[#F16521] focus:ring-1 focus:ring-orange-200 focus:outline-none"
                  />
                ))}
              </div>
            </div>

            {/* Biometric Toggle */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F16521] flex items-center justify-center">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">
                    Enable Fingerprint Login
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    Login instantly without typing MPIN
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEnableBiometrics(!enableBiometrics)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  enableBiometrics ? 'bg-[#F16521]' : 'bg-zinc-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    enableBiometrics ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <button
              onClick={handleCompleteRegistration}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#F16521] to-[#D84B06] hover:from-[#e05410] hover:to-[#c44307] text-white font-bold text-base rounded-xl shadow-md transition-transform active:scale-[0.98] cursor-pointer flex items-center justify-center disabled:opacity-75"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
