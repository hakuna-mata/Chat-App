import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  define: {
    global: {}, // Define `global` to avoid issues with libraries expecting Node.js globals
  },
  plugins: [
    react(), // Vite plugin for React
    replace({
      preventAssignment: true, // Ensure that replacements won't be reassigned
      values: {
        'eval': '0', // Replace 'eval' with a safer alternative (use cautiously)
      },
    }),
  ],
});
