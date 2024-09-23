<template>
    <v-layout>
        <div class="mx-auto signInLayout">
            <slot />
        </div>
        <Footer />
    </v-layout>
</template>

<script lang="ts" setup>
    import Footer from '~/components/Footer/Footer.vue'
</script>

<style></style>
