
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({

    future: {
        compatibilityVersion: 4,
    },
    // Подключаем модули (Tailwind для стилей)
    modules: ['@nuxtjs/tailwindcss'],

    // Включаем инструменты разработчика (помогает при отладке)
    devtools: { enabled: true },

    // Настройки TypeScript
    typescript: {
        shim: false, // Мы используем Volar, поэтому шимы не нужны
        strict: true
    },

    // Настройка проксирования или базовых URL (опционально)
    // Чтобы не писать каждый раз полный адрес бэкенда
    runtimeConfig: {
        public: {
            apiBase: 'http://localhost:3000/api'
        }
    }
})