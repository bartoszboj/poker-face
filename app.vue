<template>
    <v-app>
        <!-- <NuxtLoadingIndicator /> -->
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <GameModal />
    </v-app>
</template>

<script setup>
    import GameModal from './components/modals/GameModal/GameModal.vue'
</script>
