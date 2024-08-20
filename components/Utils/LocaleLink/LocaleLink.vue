<template>
    <NuxtLink :to="localePath(to)"><slot /></NuxtLink>
</template>

<script lang="ts" setup>
    defineProps(['to'])

    const localePath = useLocalePath()
</script>
