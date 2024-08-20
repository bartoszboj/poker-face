<template>
    <div class="h-screen w-screen flex items-center justify-center">
        <sign-in />
    </div>
</template>

<script lang="ts" setup>
    import SignIn from '~/components/SignIn/SignIn.vue'

    definePageMeta({
        layout: 'login-layout',
    })
</script>

<style></style>
