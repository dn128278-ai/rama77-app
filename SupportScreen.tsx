import React, { useState } from 'react';
import { Headphones, ChevronRight, ArrowLeft, Send } from 'lucide-react';

interface SupportScreenProps {
  darkMode: boolean;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({ darkMode }) => {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string; time: string }[]>([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to Rama 77 Chat Support. How can we help you today?',
      time: '2:34 PM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSelectIssue = (issueTitle: string) => {
    setSelectedIssue(issueTitle);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: `I have a query regarding: ${issueTitle}`,
        time: '2:35 PM',
      },
      {
        sender: 'bot',
        text: `We have logged your ${issueTitle} ticket. Please share your Order ID or Transaction UTR number below. Our support executive is online!`,
        time: '2:35 PM',
      },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: '2:35 PM' },
    ]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Thank you. We are reviewing your details. Expected resolution time is within 15 minutes.',
          time: '2:36 PM',
        },
      ]);
    }, 1000);
  };

  if (selectedIssue) {
    return (
      <div
        className={`h-full flex flex-col ${
          darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
        }`}
      >
        {/* Support Chat Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIssue(null)}
              className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h4 className="font-bold text-sm text-zinc-800">Support: {selectedIssue}</h4>
              <span className="text-[10px] text-green-600 font-semibold">● Agent Online</span>
            </div>
          </div>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-[#F16521] text-white rounded-br-none'
                    : 'bg-white text-zinc-800 rounded-bl-none border border-zinc-200'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-zinc-400 mt-0.5 px-1">{m.time}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-4 py-2 bg-zinc-100 rounded-full text-xs text-zinc-800 focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="w-8 h-8 rounded-full bg-[#F16521] text-white flex items-center justify-center hover:bg-orange-600"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  // Issue Categories List matching Video 01:06
  return (
    <div
      className={`h-full overflow-y-auto p-6 flex flex-col items-center text-center pb-20 ${
        darkMode ? 'bg-zinc-950 text-white' : 'bg-[#EDEDED] text-zinc-900'
      }`}
    >
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-[#F16521] mt-4 mb-3 shadow-xs">
        <Headphones className="w-10 h-10" />
      </div>

      <h3 className="text-xl font-black text-zinc-900 leading-tight">
        Rama 77
        <br />
        Chat Support
      </h3>

      <span className="text-zinc-500 text-[11px] font-extrabold tracking-widest mt-3 block uppercase">
        SELECT AN ISSUE
      </span>

      <div className="w-full space-y-3 mt-6 text-left">
        {/* Deposit Issue */}
        <button
          onClick={() => handleSelectIssue('Deposit Issue')}
          className="w-full p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md flex items-center justify-between active:scale-[0.99] transition-all"
        >
          <span className="font-bold text-sm text-zinc-800">Deposit Issue 🏛️</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F16521] to-[#E05410] text-white flex items-center justify-center shadow-xs">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Withdraw Issue */}
        <button
          onClick={() => handleSelectIssue('Withdraw Issue')}
          className="w-full p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md flex items-center justify-between active:scale-[0.99] transition-all"
        >
          <span className="font-bold text-sm text-zinc-800">Withdraw Issue 💸</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F16521] to-[#E05410] text-white flex items-center justify-center shadow-xs">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Other Issue */}
        <button
          onClick={() => handleSelectIssue('Other Issue')}
          className="w-full p-4 bg-white rounded-2xl border border-zinc-200/80 shadow-xs hover:shadow-md flex items-center justify-between active:scale-[0.99] transition-all"
        >
          <span className="font-bold text-sm text-zinc-800">Other Issue 🌐</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F16521] to-[#E05410] text-white flex items-center justify-center shadow-xs">
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
