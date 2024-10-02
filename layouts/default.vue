<template>
    <v-layout>
        <v-system-bar app height="42">
            <span class="flex items-center">
                <v-icon class="px-3">mdi-medal-outline</v-icon>
                {{
                    $t('rankedPoints points', {
                        rankedPoints: getUserRankedScore,
                    })
                }}
            </span>
            <v-spacer />
            <span>poker-face</span>
            <v-spacer />
            <locale-link v-if="!isLogged" :to="`/${EnumRoutes.LOGIN}`">
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
                        $t('Hi, userName', { userName: getUserDisplayName })
                    }}</span>
                    <Avatar :src="getUserAvatar" :size="24" />
                </template>
                <v-menu activator="parent">
                    <v-list>
                        <v-list-item link prepend-icon="mdi-account">
                            <v-list-item-title>{{
                                $t('Profile')
                            }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link prepend-icon="mdi-cog">
                            <v-list-item-title>{{
                                $t('Settings')
                            }}</v-list-item-title>
                        </v-list-item>
                        <v-list-item link>
                            <v-btn
                                color="error"
                                block
                                prepend-icon="mdi-logout"
                                @click="logout"
                            >
                                {{ $t('Sign out') }}
                            </v-btn>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-btn>
        </v-system-bar>
        <v-navigation-drawer
            v-model="isDrawerOpened"
            order="1"
            persisent
            :scrim="false"
        >
            <component :is="sideNavigationComponent" />
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
                    {{ item.name }}
                </v-btn>
            </v-toolbar-items>
            <v-spacer />
            <v-btn @click="openModal(EnumModals.GAME_MODAL)">
                <template #append>
                    <v-icon size="large">mdi-cards-playing-outline</v-icon>
                </template>
                {{ $t('Create game') }}
            </v-btn>
        </v-app-bar>
        <v-main>
            <slot />
            <PendingMatches />
        </v-main>
        <Footer app order="2" />
    </v-layout>
</template>

<script lang="ts" setup>
    import Footer from '~/components/Footer/Footer.vue'
    import Avatar from '~/components/Avatar/Avatar.vue'
    import LocaleLink from '~/components/Utils/LocaleLink/LocaleLink.vue'
    import EnumRoutes from '~/Enums/EnumRoutes'
    import EnumModals from '~/Enums/EnumModals'
    import PendingMatches from '~/components/PendingMatches/PendingMatches.vue'

    const route = useRoute()
    const localePath = useLocalePath()
    const { openModal } = useModalManagerStore()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const { getUserDisplayName, getUserAvatar, getUserRankedScore, isLogged } =
        storeToRefs(authStore)
    const { logout } = authStore

    const toolbarItems = reactive([
        {
            name: t('Scoreboard'),
            to: '/scoreboard/global',
        },
        {
            name: t('Game history'),
            to: '/history',
        },
        {
            name: t('Groups'),
            to: '/groups',
        },
        {
            name: t('Friends'),
            to: '/friends',
        },
    ])

    const isDrawerOpened = computed(() => {
        return !!route.meta.sideNavigationComponent
    })

    const sideNavigationComponent = computed(
        () => route?.meta?.sideNavigationComponent,
    )

    function isRouteActive(link: string) {
        return link === localePath(`/${EnumRoutes.SCOREBOARD_GLOBAL}`) &&
            route.path.includes(EnumRoutes.SCOREBOARD)
            ? true
            : link === route.path
    }
</script>

<style lang="scss"></style>
