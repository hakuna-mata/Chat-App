import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';

export default defineConfig({
  base: "/", // Change if deploying to a subpath
  define: {
    global: {}, // Define `global` for Node.js globals
  },
  plugins: [
    react(), // React plugin for Vite
    replace({
      preventAssignment: true, // Safe replacement
      values: {
        'eval': '0', // Replace `eval` to avoid issues
      },
    }),
  ],
  build: {
    outDir: 'dist', // Output directory
  },
  mode: 'production' // Set mode to production
  // esbuild: {
  //   drop: ['console', 'debugger'], // Remove unnecessary logs
  // },
});
