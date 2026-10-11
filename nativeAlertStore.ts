import React from 'react';

export interface NativeAlertData {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  buttonText?: string;
  onConfirm?: () => void;
}

type AlertListener = (alert: NativeAlertData | null) => void;

let currentAlert: NativeAlertData | null = null;
const listeners = new Set<AlertListener>();

export function showNativeAlert(data: NativeAlertData | string) {
  if (typeof data === 'string') {
    currentAlert = {
      title: 'Notification',
      message: data,
      type: 'info',
      buttonText: 'OK',
    };
  } else {
    currentAlert = {
      title: data.title || 'Notification',
      message: data.message,
      type: data.type || 'info',
      buttonText: data.buttonText || 'OK',
      onConfirm: data.onConfirm,
    };
  }
  listeners.forEach((listener) => listener(currentAlert));
}

export function closeNativeAlert() {
  currentAlert = null;
  listeners.forEach((listener) => listener(null));
}

export function subscribeNativeAlert(listener: AlertListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useNativeAlert() {
  const [alert, setAlert] = React.useState<NativeAlertData | null>(currentAlert);

  React.useEffect(() => {
    return subscribeNativeAlert(setAlert);
  }, []);

  return { alert, closeAlert: closeNativeAlert };
}
