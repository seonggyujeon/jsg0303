import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'kr.co.oceanlog.app',
  appName: 'Ocean Log',
  webDir: 'www',
  server: {
    url: 'https://jsg0303.vercel.app/home',
    cleartext: false,
    allowNavigation: ['jsg0303.vercel.app'],
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
