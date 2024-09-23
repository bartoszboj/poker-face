<template>
    <NuxtLink :to="localePath(to)"><slot /></NuxtLink>
</template>

<script lang="ts" setup>
    defineProps<{
        to: string
    }>()

    const localePath = useLocalePath()
</script>
