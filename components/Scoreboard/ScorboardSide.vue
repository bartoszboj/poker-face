<template>
    <v-list v-model:opened="scoreboardList">
        <v-list-item :title="$t('Scoreboard')" />
        <v-divider opacity="1" />
        <v-list-item
            link
            :title="$t('Global ranking')"
            prepend-icon="mdi-web"
            :to="localePath(`/${EnumRoutes.SCOREBOARD_GLOBAL}`)"
        />
        <v-list-item
            link
            :title="$t('Friends')"
            prepend-icon="mdi-account-heart"
            :to="localePath(`/${EnumRoutes.SCOREBOARD_FRIENDS}`)"
        />
        <v-divider opacity="1" />
        <v-list-group value="Groups">
            <template #activator="{ props }">
                <v-list-item
                    :title="$t('Your groups')"
                    v-bind="props"
                    prepend-icon="mdi-account-group-outline"
                />
            </template>
            <v-list-item
                v-for="i in 5"
                :key="i"
                link
                :title="`Grupa ${i}`"
                :value="i"
                :to="localePath({ name: 'groups-id', params: { id: i } })"
            />
        </v-list-group>
    </v-list>
</template>

<script lang="ts" setup>
    import EnumRoutes from '~/Enums/EnumRoutes'

    const scoreboardList = ref(['Groups'])
    const localePath = useLocalePath()
    const router = useRouter()

    function handleRedirection() {
        console.log('REDIRECTION!: ', localePath('scoreboard/groups/125125'))
        router.push('scoreboard/groups/125125')
    }
</script>

<style></style>
