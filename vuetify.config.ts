import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
    defaults: {
        global: {
            ripple: false,
        },
        VTextField: {
            variant: 'outlined',
        },
    },
    icons: {
        defaultSet: 'mdi',
        sets: ['mdi', 'fa'],
    },
})
