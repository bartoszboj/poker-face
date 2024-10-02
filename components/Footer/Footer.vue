<template>
    <v-footer app>
        <!-- <v-switch :label="themeIcon" /> -->
        <LanguageSwitcher />
        <v-spacer />
    </v-footer>
</template>

<script lang="ts" setup>
    import LanguageSwitcher from '~/components/LanguageSwitcher/LanguageSwitcher.vue'

    // import { useTheme } from 'vuetify'

    // const theme = useTheme()

    // const themeIcon = computed()
</script>
