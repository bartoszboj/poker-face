<template>
    <div>
        <nuxt-link
            v-for="locale in $i18n.locales"
            :key="locale.iso"
            class="px-1"
            :class="{ Locale__active: locale.code === $i18n.locale }"
            :to="switchLocalePath(locale.code)"
        >
            <flag v-if="locale.code === 'en'" iso="gb" :squared="false" />
            <flag v-else :iso="locale.code" :squared="false" />
        </nuxt-link>
    </div>
</template>

<script lang="ts" setup>
    const switchLocalePath = useSwitchLocalePath()
</script>

<style scoped lang="scss">
    .Locale {
        &__active {
            & > span {
                filter: drop-shadow(0px 0px 5px #000000);
            }
        }
    }
</style>
