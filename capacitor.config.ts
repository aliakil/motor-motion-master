
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.187425b06cc8452f8fa80da228ac4780',
  appName: 'motor-motion-master',
  webDir: 'dist',
  server: {
    url: 'https://187425b0-6cc8-452f-8fa8-0da228ac4780.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  }
};

export default config;
