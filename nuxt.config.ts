// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    ssr: false,
    plugins: [
        '~/plugins/flags.ts',
        '~/plugins/directives.ts',
        '~/plugins/toastify.ts',
    ],
    modules: [
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxt/eslint',
        'vuetify-nuxt-module',
        '@nuxtjs/device',
        'nuxt-lodash',
        'nuxt-vuefire',
    ],
    vuetify: {
        vuetifyOptions: './vuetify.config.ts',
    },
    i18n: {
        vueI18n: './i18n.config.ts',
        lazy: true,
        strategy: 'prefix',
        defaultLocale: 'en',
        langDir: 'i18n',
        locales: [
            { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
            { code: 'pl', name: 'Polish', iso: 'pl-PL', file: 'pl.json' },
        ],
        detectBrowserLanguage: {
            useCookie: false,
        },
    },
    lodash: {
        prefix: '_',
        prefixSkip: ['string'],
        upperAfterPrefix: false,
        exclude: ['map'],
        alias: [
            ['camelCase', 'stringToCamelCase'], // => stringToCamelCase
            ['kebabCase', 'stringToKebab'], // => stringToKebab
            ['isDate', 'isLodashDate'], // => _isLodashDate
        ],
    },
    vuefire: {
        auth: {
            enabled: true,
        },
        config: {
            apiKey: process.env.NUXT_FIREBASE_API_KEY,
            authDomain: process.env.NUXT_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NUXT_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NUXT_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NUXT_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NUXT_FIREBASE_APP_ID,
            measurementId: process.env.NUXT_FIREBASE_MEASUREMENT_ID,
        },
    },
    css: ['@/assets/scss/main.scss'],
})
