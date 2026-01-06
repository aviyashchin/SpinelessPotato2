import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables from .env file or system environment
  const env = loadEnv(mode, '.', '');
  
  // Check for API_KEY or GEMINI_API_KEY
  const apiKey = env.API_KEY || env.GEMINI_API_KEY;

  return {
    plugins: [react()],
    define: {
      // Polyfill process.env.API_KEY so the Gemini Service works as written.
      // We explicitly check both variable names to accommodate the user's setup.
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});