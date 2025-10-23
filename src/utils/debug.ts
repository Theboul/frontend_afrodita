// utils/debug.ts
const isDebugEnabled = import.meta.env.VITE_ENABLE_DEBUG === 'true';
const isAnalyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

export const debug = {
  log: (...args: any[]) => {
    if (isDebugEnabled) {
      console.log('[DEBUG]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDebugEnabled) {
      console.warn('[DEBUG]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    if (isDebugEnabled) {
      console.error('[DEBUG]', ...args);
    }
  },

  info: (...args: any[]) => {
    if (isDebugEnabled) {
      console.info('[DEBUG]', ...args);
    }
  }
};

export const analytics = {
  track: (event: string, data?: any) => {
    if (isAnalyticsEnabled) {
      console.log('[ANALYTICS]', event, data);
      // Aquí podrías integrar con servicios como Google Analytics, Mixpanel, etc.
    }
  }
};

export const config = {
  appName: import.meta.env.VITE_APP_NAME || 'Mi Aplicación',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  tokenRefreshInterval: parseInt(import.meta.env.VITE_TOKEN_REFRESH_INTERVAL || '840000'),
  isDebugEnabled,
  isAnalyticsEnabled
};