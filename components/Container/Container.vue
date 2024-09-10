<script setup>
    defineProps({
        componentProps: {
            type: Object,
            default: () => {},
        },
        component: {
            type: Object,
            default: () => {},
        },
    })
</script>
<template>
    <component :is="component" v-bind="componentProps" />
</template>
