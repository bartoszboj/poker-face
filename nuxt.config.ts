// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    plugins: ['~/plugins/flags.ts'],
    modules: [
        '@nuxtjs/i18n',
        '@pinia/nuxt',
        '@nuxtjs/tailwindcss',
        '@nuxt/eslint',
        'vuetify-nuxt-module',
        '@nuxtjs/device',
        'nuxt-lodash',
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
    css: ['@/assets/scss/main.scss'],
})
