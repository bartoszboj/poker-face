<!-- eslint-disable @typescript-eslint/unified-signatures -->
<template>
    <v-form
        :disabled="gameSettings.status === EnumGameStatus.PENDING || isLoading"
    >
        <v-container>
            <v-row>
                <v-col cols="5">
                    <div class="flex justify-between">
                        <v-switch v-model="isRanked" color="primary">
                            <template #label>
                                {{ $t('Ranked match') }}
                                <v-tooltip activator="parent" :max-width="300">
                                    {{
                                        $t(
                                            'This is a ranked game! A pool of ranking points will be taken from each player, depending on the result the player may drop in the ranking.',
                                        )
                                    }}
                                </v-tooltip>
                            </template>
                        </v-switch>
                        <v-switch
                            v-model="isMoney"
                            :label="$t('Money match')"
                            color="primary"
                        />
                    </div>
                    <v-text-field
                        v-model.number="chipPool"
                        :label="$t('Chip pool')"
                        name="chipPool"
                        type="number"
                        @update:model-value="$emit('handleChipPoolChange')"
                    >
                        <template #prepend-inner>
                            <v-icon size="small"> mdi-poker-chip </v-icon>
                        </template>
                    </v-text-field>
                    <v-row>
                        <v-col cols="7">
                            <v-text-field
                                v-if="gameSettings.isMoney"
                                v-model="chipValue"
                                v-enforce-min-max
                                :required="gameSettings.isMoney"
                                :label="$t('Chip value')"
                                name="chipValue"
                                type="number"
                                suffix="gr"
                                min="1"
                                max="10000"
                            />
                        </v-col>
                        <v-col col="5">
                            <v-text-field
                                v-if="gameSettings.isMoney"
                                v-model="moneyPool"
                                style="pointer-events: none; opacity: 0.6"
                                readonly
                                :required="gameSettings.isMoney"
                                :label="$t('Money pool')"
                                name="moneyPool"
                                type="number"
                                suffix="zł"
                            />
                        </v-col>
                    </v-row>
                </v-col>
                <v-col cols="7">
                    <v-autocomplete
                        v-model="players"
                        :loading="isLoading"
                        :disabled="
                            gameSettings.status === EnumGameStatus.PENDING
                        "
                        :items="people"
                        item-title="username"
                        item-value="uid"
                        :label="$t('Add players')"
                        chips
                        closable-chips
                        multiple
                        :no-data-text="$t('Choose or search for players')"
                        @update:model-value="
                            $emit('handlePlayerSelect', people, players)
                        "
                        @update:search="searchPlayers"
                    >
                        <template #chip="{ props, item }">
                            <v-chip
                                v-bind="props"
                                :prepend-avatar="item?.raw?.avatar?.icon"
                                :text="item.raw.username"
                                close-icon="mdi-trash-can-outline"
                            />
                        </template>

                        <template #item="{ props, item }">
                            <v-list-item
                                v-bind="props"
                                :prepend-avatar="item?.raw?.avatar?.icon"
                                :subtitle="item.raw.rankedPoints"
                                :title="item.raw.username"
                            >
                                <template #subtitle>
                                    <v-icon size="small"
                                        >mdi-medal-outline</v-icon
                                    >
                                    {{ item.raw.rankedPoints }}
                                </template>
                            </v-list-item>
                        </template>
                    </v-autocomplete>
                    <PlayerList
                        :game-settings="gameSettings"
                        :is-loading="isLoading"
                        :selected-players="selectedPlayers"
                        @remove-player="
                            (player: UserGameData) =>
                                $emit('removePlayer', player)
                        "
                        @handle-player-chip-pool-change="
                            (player: UserGameData) =>
                                $emit('handlePlayerChipPoolChange', player)
                        "
                    />
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script lang="ts" setup>
    import EnumGameStatus from '~/Enums/EnumGameStatus'
    import type { DocumentData } from 'firebase-admin/firestore'
    import {
        collection,
        query,
        startAt,
        endAt,
        getDocs,
        limit,
        orderBy,
    } from 'firebase/firestore'
    import PlayerList from './PlayerList.vue'

    const { userData } = storeToRefs(useAuthStore())
    const { gameModalSettings } = storeToRefs(useModalManagerStore())
    const db = useFirestore()

    const isRanked = defineModel<boolean>('isRanked')
    const isMoney = defineModel<boolean>('isMoney')
    const chipPool = defineModel<number>('chipPool')
    const chipValue = defineModel<number>('chipValue')

    const { gameSettings } = defineProps<{
        gameSettings: GameSettings
        isLoading: boolean
        selectedPlayers: UserGameData[]
    }>()

    const emit = defineEmits<{
        (e: 'handleChipPoolChange' | 'handlePlayerSelect'): void
        (
            e: 'handlePlayerSelect',
            people: UserGameData[],
            players: string[],
        ): void
        (e: 'setGameSettings', settings: GameSettings): void
        (e: 'searchPlayers', playerName: string): void
        (e: 'toggleLoading', value: boolean): void
        (
            e: 'handlePlayerChipPoolChange' | 'removePlayer',
            player: UserGameData,
        ): void
    }>()

    const people = ref<UserGameData[]>([])
    const players = ref<string[]>([])

    const moneyPool = computed(() => {
        return (gameSettings.chipPool * gameSettings.chipValue) / 100
    })

    const searchPlayers = _debounce(async (playerName: string) => {
        if (!playerName || playerName.length < 3) {
            return
        }
        emit('toggleLoading', true)
        const q = query(
            collection(db, 'users'),
            orderBy('username'),
            startAt(playerName),
            endAt(playerName + '\uf8ff'),
            limit(5),
        )

        const docSnaps = await getDocs(q)
        docSnaps.docs.forEach((doc: DocumentData) => {
            if (
                people.value.some(
                    (user) => user.username === doc.data().username,
                )
            ) {
                return
            }

            populatePeople([doc.data()])
        })
        emit('toggleLoading', false)
    }, 750)

    function populatePeople(data: UserData[] | UserGameData[]) {
        data.forEach((user) => {
            const structuredData = (({
                avatar,
                informalPoints,
                rankedPoints,
                uid,
                username,
            }) => ({
                avatar,
                informalPoints,
                rankedPoints,
                uid,
                username,
                chipPoolValueChanged: false,
                chipPool: gameSettings.chipPool,
            }))(user)

            people.value.push(structuredData)
        })
    }

    onMounted(() => {
        if (gameModalSettings.value) {
            populatePeople(gameModalSettings.value.players)

            const pendingGamePlayersUid: string[] = []
            gameModalSettings.value.players.forEach((player) =>
                pendingGamePlayersUid.push(player.uid),
            )

            players.value = pendingGamePlayersUid

            emit('handlePlayerSelect', people.value, players.value)

            return
        }

        if (userData.value?.defaultSettings) {
            emit('setGameSettings', { ...userData.value?.defaultSettings })
        }
        if (userData.value) {
            populatePeople([userData.value])

            players.value = [userData.value.uid]

            emit('handlePlayerSelect', people.value, players.value)
        }
    })
</script>

<style></style>
