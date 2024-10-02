<template>
    <v-list>
        <v-list-subheader>
            {{ $t('Players') }}
        </v-list-subheader>
        <v-list-item
            v-for="(player, i) in selectedPlayers"
            :key="`${player.username}-${i}`"
        >
            <template #prepend>
                <Avatar :src="player?.avatar?.thumbnail" :size="48" />
            </template>
            <v-container>
                <v-row>
                    <v-col cols="4">
                        <v-list-item-title>
                            {{ player.username }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                            <span class="PlayersTable-Score flex items-center">
                                <v-icon size="small">mdi-medal-outline</v-icon>
                                {{ player.rankedPoints }}
                            </span>
                        </v-list-item-subtitle>
                    </v-col>
                    <v-col cols="4" class="flex align-center justify-center">
                        <v-text-field
                            v-model.number="player.chipPool"
                            type="number"
                            density="compact"
                            dirty
                            variant="solo"
                            flat
                            tile
                            hide-details
                            @update:model-value="
                                $emit('handlePlayerChipPoolChange', player)
                            "
                        >
                            <template #prepend-inner>
                                <v-icon size="small"> mdi-poker-chip </v-icon>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col
                        v-show="gameSettings.isMoney"
                        cols="4"
                        class="flex align-center justify-center"
                    >
                        <span>
                            <v-icon size="small"> mdi-currency-usd </v-icon>
                            {{ getPlayerMoneyPull(player) }}
                            zł
                        </span>
                    </v-col>
                </v-row>
            </v-container>
            <template #append>
                <v-btn
                    icon
                    flat
                    variant="plain"
                    :disabled="
                        gameSettings.status === EnumGameStatus.PENDING ||
                        isLoading
                    "
                    @click="$emit('removePlayer', player)"
                >
                    <v-icon> mdi-trash-can-outline </v-icon>
                    <v-tooltip activator="parent">
                        {{ $t('Remove player') }}
                    </v-tooltip>
                </v-btn>
            </template>
        </v-list-item>
    </v-list>
</template>

<script lang="ts" setup>
    import EnumGameStatus from '~/Enums/EnumGameStatus'

    const { gameSettings } = defineProps<{
        gameSettings: GameSettings
        isLoading: boolean
        selectedPlayers: UserGameData[]
    }>()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const emit = defineEmits<{
        (
            e: 'handlePlayerChipPoolChange' | 'removePlayer',
            player: UserGameData,
        ): void
    }>()

    function getPlayerMoneyPull(player: UserGameData) {
        return (player.chipPool * gameSettings.chipValue) / 100
    }
</script>

<style></style>
