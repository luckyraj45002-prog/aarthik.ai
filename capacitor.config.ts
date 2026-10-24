import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.aarthik.app',
  appName: 'Aarthik.ai',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
