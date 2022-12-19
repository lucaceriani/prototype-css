import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 4096,
    rollupOptions: {
      input: {
        popup: 'popup.html',
        options: 'options.html',
        background: 'background.ts',
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
  plugins: [react()],
})
