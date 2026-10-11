import React from 'react';
import {
  Smartphone,
  ShieldCheck,
  Palette,
  Layers,
  ArrowRight,
  Sparkles,
  Cpu,
  PackageCheck,
  HelpCircle,
} from 'lucide-react';

export const AnalysisReport: React.FC = () => {
  return (
    <div className="space-y-8 text-zinc-300 leading-relaxed max-w-4xl mx-auto py-2">
      {/* Overview Hero */}
      <div className="bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-3 text-orange-400 font-bold text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>RAMA77 Video Recording UI/UX Deep Analysis &amp; Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          RAMA77 Android Application Specification &amp; APK Blueprint
        </h2>
        <p className="mt-2 text-zinc-400 text-sm sm:text-base">
          Video recording mein dikhaye gaye tamam 13 screens, micro-interactions,
          color palette, backend models aur navigation flow ka mukammal tajziya
          aur Android Studio implementation guide.
        </p>
      </div>

      {/* Screen-by-Screen Deep Dive */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#F16521]" />
          <span>Screen-by-Screen UI, Design &amp; Flow Analysis</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* 1. MPIN Login */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">1. MPIN Login Screen (00:00 - 00:07)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-mono">Launcher</span>
            </div>
            <p className="text-zinc-400 mb-3">
              Brand logo [R] RAMA77, "MPIN Login" heading, 4 square inputs for OTP/PIN,
              "Forgot MPIN?" link, gradient action button with loading spinner, aur "Don't have an account? Register Now" option.
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono">
              <li>Layout: <code>activity_login.xml</code></li>
              <li>Auth: AndroidX <code>BiometricPrompt</code></li>
              <li>New user trigger: <code>tvRegisterNow</code> click</li>
            </ul>
          </div>

          {/* New Registration Flow */}
          <div className="bg-zinc-900/80 border border-orange-500/40 rounded-2xl p-5 hover:border-orange-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">New User Registration Flow</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">New Flow</span>
            </div>
            <p className="text-zinc-400 mb-3">
              Mobile Number (+91), secure Password, aur Promo Code (RAMA100). Iske baad 4-digit MPIN aur Fingerprint setup karke user seedha Main Home Dashboard par redirect hota hai.
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono">
              <li>Activity: <code>RegisterActivity.kt</code></li>
              <li>Layout: <code>activity_register.xml</code></li>
              <li>Auto-login: <code>Intent(FLAG_ACTIVITY_CLEAR_TASK)</code></li>
            </ul>
          </div>

          {/* 2. Home Dashboard */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">2. Home Dashboard (00:08 - 00:11)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-mono">Main</span>
            </div>
            <p className="text-zinc-400 mb-3">
              Running ticker "Current minimum deposit limit Rs. 300", Call Now &amp; WhatsApp quick buttons,
              Bombay Starline &amp; Jackpot category tabs, aur live Matka market cards with open/close pana and status.
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono">
              <li>Status Badges: "Closed for Today" (Red), "Running for Open/Close" (Green)</li>
              <li>Result String: Open Pana (3) - Jodi (2) - Close Pana (3)</li>
              <li>Adapter: <code>MarketAdapter.kt</code> + <code>RecyclerView</code></li>
            </ul>
          </div>

          {/* 3. Navigation Drawer */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">3. Navigation Drawer (00:22 / 01:15)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-mono">Sidebar</span>
            </div>
            <p className="text-zinc-400 mb-3">
              Orange curved header with avatar, user name "Girish Meena", mobile "6377972674".
              13 dynamic menu destinations: Charts, Change MPIN, Game Rates, Settings, Dark Mode switch, Share App, App Version: 2.
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono">
              <li>Widget: <code>DrawerLayout</code> + <code>NavigationView</code></li>
              <li>Header: <code>nav_header_main.xml</code></li>
            </ul>
          </div>

          {/* 4. Passbook */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">4. Passbook &amp; Transactions (00:26)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-mono">Finance</span>
            </div>
            <p className="text-zinc-400 mb-3">
              Solid orange table header (Description | Transaction Amount | Balance), detailed cards showing
              Add Fund FAILED / PENDING, order ID (bud-ee2ade9ebc2a), date timestamps, balance and pagination (Previous, 1, Next).
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono">
              <li>Layout: <code>fragment_passbook.xml</code></li>
              <li>Item: <code>item_passbook_row.xml</code></li>
            </ul>
          </div>

          {/* 5. Funds Sub-system */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">5. Funds &amp; Payment Gateway (00:33 - 00:55)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-mono">Deposit/Withdraw</span>
            </div>
            <p className="text-zinc-400 mb-3">
              Add Funds (quick chips 100, 300, 500, 1000, 1500, 2000), Welcome Bonus bottom sheet ("Pay ₹1, Get ₹100"),
              UPI app chooser (PhonePe, GPay, Navi, Yono), Withdraw Terms modal ("I Agree"), and Bank Details form.
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono">
              <li>Payment Gateway: Budypay UPI Intent</li>
              <li>Dialogs: <code>dialog_withdraw_terms.xml</code>, <code>bottom_sheet_welcome_bonus.xml</code></li>
            </ul>
          </div>

          {/* 6. Charts & Results */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">6. Matka Charts (01:57 - 02:16)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-mono">Records</span>
            </div>
            <p className="text-zinc-400 mb-3">
              Market list with dual "Jodi" and "Panel" orange buttons. Detailed chart viewer with sticky
              "Go To Top" and "Go To Bottom" controls and tabular weekly history (Date, Mon-Sun) with red cuts and asterisks.
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400 font-mono">
              <li>Activity: <code>ChartDetailActivity.kt</code></li>
              <li>Layout: <code>activity_chart_detail.xml</code></li>
            </ul>
          </div>

          {/* 7. Game Center & Sub-Game Betting Flow */}
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 hover:border-orange-500/30 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">7. Game Center &amp; Sub-Game Betting (Default Theme)</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-orange-950 text-orange-400 font-mono">Game Center</span>
            </div>
            <p className="text-zinc-400 mb-3">
              Home screen par kisi bhi market (jaise Kalyan) ke "Play" button par click karne par Game Center screen open hoti hai. Isme solid light scaffold surface (<code>#EDEDED</code>), Open / Close session switcher tabs, aur 22 game options (Single Digit, Jodi Digit, Single Pana, Double Pana, Triple Pana, SP/DP Motor, Sangam waghera) ka 2-column grid layout hai. Kisi option par click karne par sub-game digit selector, custom keypad, limit validator (₹5000 max), confirmed bet summary aur final submission page open hota hai.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-400 font-mono text-[11px]">
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                <strong>Activity:</strong> <code>GameCenterActivity.kt</code>
              </div>
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                <strong>Sub-Game:</strong> <code>SubGameBetActivity.kt</code>
              </div>
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                <strong>Background:</strong> <code>#EDEDED (Default)</code>
              </div>
            </div>
          </div>

          {/* 8. Remote Backend REST API & Matka777 Admin Control Panel Integration */}
          <div className="bg-zinc-900/80 border border-orange-500/40 rounded-2xl p-5 hover:border-orange-500 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white">
                8. Matka777 Admin Control Panel &amp; Retrofit 2 REST API (Live Sync)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono">
                Cross-Tab Live Synced
              </span>
            </div>
            <p className="text-zinc-400 mb-3 text-xs leading-relaxed">
              Android app ke Retrofit API client (<code>ApiService.kt</code>, <code>ApiModels.kt</code>, <code>RetrofitClient.kt</code>) ko &apos;Matka777 Admin Control Panel&apos; ke exact endpoints aur DTO data structures (<code>MarketDto</code>, <code>UserProfileDto</code>, <code>PlaceBidRequest</code>, <code>GameRateDto</code>) ke sath configure kiya gaya hai. Doosre AI Studio tab se aane wale saare controls (Market timings, result declarations, user wallet balance adjustments, game rates, live bids stream) <code>BroadcastChannel(&apos;matka777_admin_sync&apos;)</code> aur <code>localStorage</code> event listeners ke zariye live app par dynamically sync aur control hote hain.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-zinc-400 font-mono text-[11px]">
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                <strong>Client:</strong> <code>RetrofitClient.kt</code>
              </div>
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                <strong>Endpoints:</strong> <code>/api/v1/matka/*</code>
              </div>
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                <strong>Sync Engine:</strong> <code>Matka777SyncManager</code>
              </div>
              <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-800">
                <strong>Cross-Tab:</strong> <code>BroadcastChannel</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design System & Color Palette */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Palette className="w-5 h-5 text-[#F16521]" />
          <span>Design System &amp; Brand Palette</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#F16521] text-white">
            <div className="font-bold">Primary Orange</div>
            <div className="font-mono text-[11px] opacity-90">#F16521</div>
            <div className="text-[10px] mt-1">App branding, buttons, active tabs</div>
          </div>
          <div className="p-3 rounded-xl bg-[#D84B06] text-white">
            <div className="font-bold">Orange Dark</div>
            <div className="font-mono text-[11px] opacity-90">#D84B06</div>
            <div className="text-[10px] mt-1">Gradients, pressed states</div>
          </div>
          <div className="p-3 rounded-xl bg-[#EDEDED] text-zinc-900 border border-zinc-300">
            <div className="font-bold">Background Canvas</div>
            <div className="font-mono text-[11px]">#EDEDED</div>
            <div className="text-[10px] text-zinc-600 mt-1">Light grey scaffold surface</div>
          </div>
          <div className="p-3 rounded-xl bg-white text-zinc-900 border border-zinc-200">
            <div className="font-bold">Card Surface</div>
            <div className="font-mono text-[11px]">#FFFFFF</div>
            <div className="text-[10px] text-zinc-600 mt-1">16dp rounded card elevation</div>
          </div>
        </div>
      </div>

      {/* Android Studio Implementation & Build Instructions */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-green-400" />
          <span>Android Studio mein APK Build karne ka Tareeqa (Step-by-Step)</span>
        </h3>

        <div className="space-y-3 text-sm text-zinc-300">
          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-[#F16521] font-bold text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <p>
              <strong className="text-white">ZIP Download karein:</strong> Upar diye gaye{" "}
              <span className="text-[#F16521] font-semibold">"Download Android Studio Project (.ZIP)"</span>{" "}
              button par click karein aur <code>RAMA77_AndroidStudio_Project.zip</code> download karein.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-[#F16521] font-bold text-xs flex items-center justify-center shrink-0">
              2
            </span>
            <p>
              <strong className="text-white">Android Studio mein Open karein:</strong> ZIP ko extract karein.
              Android Studio open karke <strong>File -&gt; Open</strong> par click karein aur extracted folder select karein.
            </p>
          </div>

          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-[#F16521] font-bold text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <p>
              <strong className="text-white">Gradle Sync hone dein:</strong> Project Java 17 aur AGP 8.4+ standard par configure kiya gaya hai.
              Android Studio auto-sync karke dependencies download karega (Material 3, Navigation, Biometric, CardView).
            </p>
          </div>

          <div className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-orange-500/20 text-[#F16521] font-bold text-xs flex items-center justify-center shrink-0">
              4
            </span>
            <p>
              <strong className="text-white">APK Generate karein:</strong> Top menu se{" "}
              <strong>Build -&gt; Build Bundle(s) / APK(s) -&gt; Build APK(s)</strong> par click karein.
              Apka debug APK <code>app/build/outputs/apk/debug/app-debug.apk</code> location par tayyar ho jayega!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
