export type ScreenType =
  | 'login'
  | 'register'
  | 'home'
  | 'game_center'
  | 'sub_game_bet'
  | 'history'
  | 'history_detail'
  | 'passbook'
  | 'funds'
  | 'add_funds'
  | 'add_funds_history'
  | 'withdraw_funds'
  | 'withdraw_funds_history'
  | 'add_bank'
  | 'bank_history'
  | 'support'
  | 'charts'
  | 'chart_detail'
  | 'game_rates'
  | 'change_mpin'
  | 'settings'
  | 'notifications'
  | 'security';

export type GameSession = 'Open' | 'Close';

export interface GameOption {
  id: string;
  title: string;
  iconType: string;
  category: 'digit' | 'pana' | 'motor' | 'sangam' | 'special';
  isBulk?: boolean;
}

export interface BetItem {
  id: string;
  number: string;
  points: number;
}

export type BottomTab = 'history' | 'passbook' | 'home' | 'funds' | 'support';

export interface MarketItem {
  id: string;
  name: string;
  openPana: string;
  jodi: string;
  closePana: string;
  openTime: string;
  closeTime: string;
  status: 'Closed for Today' | 'Running for Open' | 'Running for Close';
  isOpen: boolean;
  timeRemaining?: string;
  lastDeclaredDate?: string;
  manualOverrideStatus?: 'auto' | 'open' | 'close' | 'closed';
  isCustomDeclared?: boolean;
}

export interface TransactionRecord {
  id: string;
  type: 'Add Fund FAILED' | 'Add Fund PENDING' | 'Add Fund SUCCESS';
  amount: number;
  orderId: string;
  date: string;
  time: string;
  previousBalance: number;
  status: 'Failure' | 'Pending' | 'Success';
  mode: string;
}

export interface GameRateRow {
  title: string;
  rate: string;
}

export interface ChartRow {
  dateRange: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

export interface AndroidFile {
  path: string;
  category: 'manifest' | 'layout' | 'kotlin' | 'values' | 'drawable' | 'gradle';
  language: 'xml' | 'kotlin' | 'groovy' | 'properties';
  description: string;
  content: string;
}
