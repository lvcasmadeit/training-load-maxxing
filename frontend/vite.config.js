import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Keep browser requests on /api so the same frontend code works locally and in production.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const apiProxyTarget = env.VITE_API_PROXY_TARGET || 'http://localhost:8000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
