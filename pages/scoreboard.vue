<template></template>

<script lang="ts" setup>
    import ScorboardSide from '~/components/Scoreboard/ScorboardSide.vue'
    // const localePath = useLocalePath()

    definePageMeta({
        sideNavigationComponent: ScorboardSide,
        redirect: 'scoreboard/global',
    })
</script>

<style></style>
