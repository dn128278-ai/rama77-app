import { MarketItem } from '../types';
import { SINGLE_PANAS, DOUBLE_PANAS } from '../data/mockData';

// Flattened list of valid Panas for fallback generation
const ALL_SINGLE_PANAS: string[] = Object.values(SINGLE_PANAS).flat();
const ALL_DOUBLE_PANAS: string[] = Object.values(DOUBLE_PANAS).flat();

/**
 * Parses time strings like "11:40 AM", "01:05 PM", "12:00 PM" into total minutes from midnight (0..1439).
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const ampm = (match[3] || '').toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/**
 * Formats minutes from midnight into 12-hour AM/PM string.
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(norm / 60);
  const mins = norm % 60;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) hours12 = 12;
  const hStr = hours12 < 10 ? `0${hours12}` : `${hours12}`;
  const mStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hStr}:${mStr} ${ampm}`;
}

/**
 * Returns current local date as "YYYY-MM-DD".
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Computes Ank (unit digit of sum of Pana digits) as per standard Matka mathematics.
 * e.g. "147" -> 1+4+7=12 -> "2"
 * e.g. "***" -> "*"
 */
export function calculateAnkFromPana(pana: string): string {
  if (!pana || pana.includes('*') || pana.length !== 3) return '*';
  const sum = pana
    .split('')
    .map(Number)
    .filter((n) => !isNaN(n))
    .reduce((a, b) => a + b, 0);
  return String(sum % 10);
}

/**
 * Computes Jodi from Open and Close Panas.
 */
export function calculateJodiFromPanas(openPana: string, closePana: string): string {
  const openAnk = calculateAnkFromPana(openPana);
  const closeAnk = calculateAnkFromPana(closePana);
  return `${openAnk}${closeAnk}`;
}

/**
 * Generates a realistic, deterministic valid Matka Pana for a given market, date, and session.
 * Ensures the generated Pana digits are in strictly ascending order as required by Matka rules.
 */
export function generateDeterministicPana(
  marketId: string,
  dateStr: string,
  session: 'Open' | 'Close'
): string {
  // Simple deterministic hash
  const key = `${marketId}_${dateStr}_${session}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // 75% chance single pana, 25% chance double pana
  if (positiveHash % 4 === 0 && ALL_DOUBLE_PANAS.length > 0) {
    const idx = positiveHash % ALL_DOUBLE_PANAS.length;
    return ALL_DOUBLE_PANAS[idx];
  } else if (ALL_SINGLE_PANAS.length > 0) {
    const idx = positiveHash % ALL_SINGLE_PANAS.length;
    return ALL_SINGLE_PANAS[idx];
  }

  // Fallback valid Pana
  return session === 'Open' ? '128' : '680';
}

export interface MarketEvaluationResult {
  status: 'Closed for Today' | 'Running for Open' | 'Running for Close';
  isOpen: boolean;
  openPana: string;
  jodi: string;
  closePana: string;
  timeRemainingText: string;
}

/**
 * Evaluates market status and results based on current time & date.
 */
export function evaluateMarketForTime(
  market: MarketItem,
  currentDateStr: string,
  currentTimeMinutes: number,
  existingSavedResult?: {
    openPana?: string;
    closePana?: string;
    jodi?: string;
    isCustomDeclared?: boolean;
    declaredDate?: string;
  }
): MarketEvaluationResult {
  const openMins = parseTimeToMinutes(market.openTime);
  const closeMins = parseTimeToMinutes(market.closeTime);

  // Check if manual override status is enforced
  if (market.manualOverrideStatus && market.manualOverrideStatus !== 'auto') {
    if (market.manualOverrideStatus === 'open') {
      return {
        status: 'Running for Open',
        isOpen: true,
        openPana: '***',
        jodi: '**',
        closePana: '***',
        timeRemainingText: 'Manually Open',
      };
    } else if (market.manualOverrideStatus === 'close') {
      const op =
        existingSavedResult?.openPana && existingSavedResult.openPana !== '***'
          ? existingSavedResult.openPana
          : generateDeterministicPana(market.id, currentDateStr, 'Open');
      const opAnk = calculateAnkFromPana(op);
      return {
        status: 'Running for Close',
        isOpen: true,
        openPana: op,
        jodi: `${opAnk}*`,
        closePana: '***',
        timeRemainingText: 'Manually Close Session',
      };
    } else if (market.manualOverrideStatus === 'closed') {
      const op =
        existingSavedResult?.openPana && existingSavedResult.openPana !== '***'
          ? existingSavedResult.openPana
          : generateDeterministicPana(market.id, currentDateStr, 'Open');
      const cp =
        existingSavedResult?.closePana && existingSavedResult.closePana !== '***'
          ? existingSavedResult.closePana
          : generateDeterministicPana(market.id, currentDateStr, 'Close');
      const jd = calculateJodiFromPanas(op, cp);
      return {
        status: 'Closed for Today',
        isOpen: false,
        openPana: op,
        jodi: jd,
        closePana: cp,
        timeRemainingText: 'Manually Closed',
      };
    }
  }

  // Handle overnight markets (e.g. 09:40 PM to 12:05 AM)
  const isOvernight = closeMins < openMins;

  let isBeforeOpen = false;
  let isBetweenOpenAndClose = false;
  let isAfterClose = false;

  if (!isOvernight) {
    if (currentTimeMinutes < openMins) {
      isBeforeOpen = true;
    } else if (currentTimeMinutes >= openMins && currentTimeMinutes < closeMins) {
      isBetweenOpenAndClose = true;
    } else {
      isAfterClose = true;
    }
  } else {
    // Overnight market: open at night (e.g. 21:40), close after midnight (e.g. 00:05)
    if (currentTimeMinutes >= openMins) {
      // It is night, open time passed, waiting for midnight close
      isBetweenOpenAndClose = true;
    } else if (currentTimeMinutes < closeMins) {
      // It is early morning past midnight before close
      isBetweenOpenAndClose = true;
    } else {
      // Daytime between close and next night's open
      isAfterClose = true;
    }
  }

  // Format countdown / time remaining
  let timeRemainingText = '';
  if (isBeforeOpen) {
    const diffMins = openMins - currentTimeMinutes;
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    timeRemainingText = hrs > 0 ? `Opens in ${hrs}h ${mins}m` : `Opens in ${mins}m`;
  } else if (isBetweenOpenAndClose) {
    let diffMins = 0;
    if (!isOvernight) {
      diffMins = closeMins - currentTimeMinutes;
    } else {
      diffMins = currentTimeMinutes >= openMins
        ? 1440 - currentTimeMinutes + closeMins
        : closeMins - currentTimeMinutes;
    }
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    timeRemainingText = hrs > 0 ? `Closes in ${hrs}h ${mins}m` : `Closes in ${mins}m`;
  } else {
    timeRemainingText = 'Closed for Today';
  }

  // Check if Admin has specifically declared custom results for TODAY
  const hasCustomTodayResult =
    existingSavedResult?.isCustomDeclared &&
    existingSavedResult?.declaredDate === currentDateStr;

  if (isBeforeOpen) {
    // Phase 1: Before Open Bidding Ends
    return {
      status: 'Running for Open',
      isOpen: true,
      openPana: '***',
      jodi: '**',
      closePana: '***',
      timeRemainingText,
    };
  } else if (isBetweenOpenAndClose) {
    // Phase 2: Open has been declared, only Close betting is active
    let op = '***';
    if (hasCustomTodayResult && existingSavedResult?.openPana) {
      op = existingSavedResult.openPana;
    } else {
      op = generateDeterministicPana(market.id, currentDateStr, 'Open');
    }
    const opAnk = calculateAnkFromPana(op);
    return {
      status: 'Running for Close',
      isOpen: true,
      openPana: op,
      jodi: `${opAnk}*`,
      closePana: '***',
      timeRemainingText,
    };
  } else {
    // Phase 3: Market is closed for today, full result is declared
    let op = '***';
    let cp = '***';
    let jd = '**';

    if (hasCustomTodayResult) {
      op = existingSavedResult?.openPana || generateDeterministicPana(market.id, currentDateStr, 'Open');
      cp = existingSavedResult?.closePana || generateDeterministicPana(market.id, currentDateStr, 'Close');
      jd = existingSavedResult?.jodi || calculateJodiFromPanas(op, cp);
    } else {
      op = generateDeterministicPana(market.id, currentDateStr, 'Open');
      cp = generateDeterministicPana(market.id, currentDateStr, 'Close');
      jd = calculateJodiFromPanas(op, cp);
    }

    return {
      status: 'Closed for Today',
      isOpen: false,
      openPana: op,
      jodi: jd,
      closePana: cp,
      timeRemainingText,
    };
  }
}
