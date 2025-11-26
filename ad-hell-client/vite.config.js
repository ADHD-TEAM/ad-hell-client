import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 5173,
        proxy: {
            // 프론트에서 /api 로 시작하는 요청을
            // http://localhost:8000 으로 프록시
            '/api': {
                target: 'http://localhost:8000', // 게이트웨이 포트
                changeOrigin: true,
            },
        },
    },
})
