import React, { useState } from 'react';
import { MpinLoginScreen } from './components/AndroidEmulator/MpinLoginScreen';
import { HomeScreen } from './components/AndroidEmulator/HomeScreen';
import { RegisterScreen } from './components/AndroidEmulator/RegisterScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register' | 'home'>('login');

  const handleLoginSuccess = () => {
    setCurrentScreen('home');
  };

  const handleNavigateRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigateLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 text-zinc-100 flex flex-col font-sans">
      {currentScreen === 'login' && (
        <MpinLoginScreen
          onSuccess={handleLoginSuccess}
          onNavigateRegister={handleNavigateRegister}
        />
      )}

      {currentScreen === 'register' && (
        <RegisterScreen
          onSuccess={handleLoginSuccess}
          onNavigateLogin={handleNavigateLogin}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen
          onLogout={handleNavigateLogin}
        />
      )}
    </div>
  );
}
