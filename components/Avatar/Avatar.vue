<template>
    <v-avatar
        v-if="src"
        :image="src"
        alt="Avatar"
        :size="size"
        :rounded="rounded"
    />
    <v-icon v-else :size="size">{{ noPictureIcon || 'mdi-account' }}</v-icon>
</template>

<script lang="ts" setup>
    defineProps<{
        size?: number
        src?: string | null | undefined
        noPictureIcon?: string
        rounded?: number
    }>()
</script>
