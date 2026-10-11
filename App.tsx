import React from 'react';
import { PhoneFrame } from './components/AndroidEmulator/PhoneFrame';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-2">
      <div className="w-full max-w-sm">
        <PhoneFrame />
      </div>
    </div>
  );
}
