import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so the Gemini Service works as written
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});