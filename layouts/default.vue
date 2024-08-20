<template>
    <v-layout>
        <v-system-bar app height="42">
            <span class="flex items-center">
                <v-icon class="px-3">mdi-medal-outline</v-icon>
                1234 points
            </span>
            <v-spacer />
            <span>poker-face</span>
            <v-spacer />
            <locale-link v-if="!isLogged" to="/login">
                <v-btn size="small" variant="text">
                    <template #append>
                        <v-icon> mdi-login </v-icon>
                    </template>
                    {{ $t('Log in') }}
                </v-btn>
            </locale-link>
            <v-btn
                v-else
                size="x-small"
                variant="text"
                flat
                class="NoButtonHoverEffect"
            >
                <template #append>
                    <span class="pr-2">{{
                        $t('Hi, userName', { userName: userName })
                    }}</span>
                    <Avatar :src="avatarSrc" :size="24" />
                </template>
            </v-btn>
        </v-system-bar>
        <v-navigation-drawer order="1">
            <v-list>
                <v-list-item link title="item 1" />
                <v-list-item link title="item 2" />
                <v-list-item link title="item 3" />
            </v-list>
        </v-navigation-drawer>
        <v-app-bar order="2">
            <v-toolbar-items class="flex">
                <v-btn
                    v-for="item in toolbarItems"
                    :key="item.to"
                    :active="isRouteActive(localePath(item.to))"
                    class="flex items-center px-10"
                    @click="$router.push(localePath(item.to))"
                >
                    {{ $t(item.name) }}
                </v-btn>
            </v-toolbar-items>
            <v-spacer />
            <v-btn>
                <template #append>
                    <v-icon size="large">mdi-cards-playing-outline</v-icon>
                </template>
                {{ $t('Create game') }}
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-container />
            <slot />
        </v-main>
        <Footer />
    </v-layout>
</template>

<script lang="ts" setup>
    import Footer from '~/components/Footer/Footer.vue'
    import Avatar from '~/components/Avatar/Avatar.vue'
    import LocaleLink from '~/components/Utils/LocaleLink/LocaleLink.vue'

    const route = useRoute()
    const localePath = useLocalePath()
    const { t } = useI18n()

    const toolbarItems = [
        {
            name: 'Scoreboard',
            to: '/scoreboard',
        },
        {
            name: 'Game history',
            to: '/history',
        },
        {
            name: 'Groups',
            to: '/groups',
        },
        {
            name: 'Friends',
            to: '/friends',
        },
    ]

    function isRouteActive(link: string) {
        return link === route.path
    }

    const isLogged = false
    const userName = 'Bartek'
    const avatarSrc =
        'https://scontent-waw2-2.xx.fbcdn.net/v/t31.18172-1/15724546_1369417316416570_1515949336552278728_o.jpg?stp=dst-jpg_p200x200&_nc_cat=103&ccb=1-7&_nc_sid=e4545e&_nc_ohc=IGA9E3oDTw0Q7kNvgE2WoI7&_nc_ht=scontent-waw2-2.xx&oh=00_AYC-jFX06OQs3WanxQDmbfBaCjiLk-vUBP54ni5aC2fUaw&oe=66DCA349'
</script>

<style lang="scss"></style>
