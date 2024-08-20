<template>
    <v-avatar v-if="src" :image="src" alt="Avatar" :size="size" />
    <v-icon v-else :size="size">{{ noPictureIcon || 'mdi-account' }}</v-icon>
</template>

<script lang="ts" setup>
    defineProps<{
        size?: number
        src?: string
        noPictureIcon?: string
    }>()
</script>
