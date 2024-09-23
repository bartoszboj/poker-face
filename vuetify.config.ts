import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'

export default defineVuetifyConfiguration({
    defaults: {
        global: {
            ripple: false,
        },
        VTextField: {
            variant: 'outlined',
        },
        VAutocomplete: {
            variant: 'outlined',
        },
        VFileInput: {
            variant: 'outlined',
        },
    },
    icons: {
        defaultSet: 'mdi',
        sets: ['mdi', 'fa'],
    },
})
