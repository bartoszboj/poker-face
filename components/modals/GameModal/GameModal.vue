<template>
    <ModalWrapper :modal-id="modalId" :options="modalOptions">
        <template #actions>
            <v-btn
                v-if="step === 1"
                flat
                variant="plain"
                size="small"
                @click="saveSettings"
            >
                <template #prepend>
                    <v-icon> mdi-content-save-outline </v-icon>
                </template>
                {{ $t('Save settings') }}
            </v-btn>
        </template>
        <template #title>
            <v-toolbar-title
                class="flex align-center justify-center GameModal-Title"
            >
                {{
                    gameSettings.status === EnumGameStatus.PENDING
                        ? $t('Game gameId', { gameId: gameSettings.id })
                        : $t('New game')
                }}
            </v-toolbar-title>
        </template>
        <template #navigation="{ close }">
            <v-btn icon flat variant="plain" @click="close()">
                <v-icon> mdi-close </v-icon>
                <v-tooltip
                    v-if="
                        step === 2 ||
                        (step === 1 &&
                            gameSettings.status === EnumGameStatus.PENDING)
                    "
                    activator="parent"
                    :max-width="300"
                >
                    {{
                        $t(
                            'Game is already created. Closing this window will not result in loss of data. Feel free to return to this match after you finish it.',
                        )
                    }}
                </v-tooltip>
            </v-btn>
        </template>
        <template #default="{ close }">
            <v-stepper
                v-model="step"
                flat
                hide-actions
                linear
                elevation="0"
                class="GameModal-Content"
            >
                <v-stepper-header flat elevation="0">
                    <template v-for="(n, i) in steps" :key="`${n}-step`">
                        <v-stepper-item
                            :complete="step > i + 1"
                            :step="i + 1"
                            :value="i + 1"
                            :title="n"
                            :editable="step > i + 1"
                        />
                    </template>
                </v-stepper-header>
                <v-stepper-window>
                    <v-stepper-window-item key="0-step-content" :value="1">
                        <InitialSettings
                            v-model:is-ranked="gameSettings.isRanked"
                            v-model:is-money="gameSettings.isMoney"
                            v-model:chip-pool="gameSettings.chipPool"
                            v-model:chip-value="gameSettings.chipValue"
                            :game-settings="gameSettings"
                            :is-loading="isLoading"
                            :selected-players="selectedPlayers"
                            @handle-chip-pool-change="handleChipPoolChange"
                            @handle-player-select="handlePlayerSelect"
                            @toggle-loading="
                                (value: boolean) => (isLoading = value)
                            "
                            @handle-player-chip-pool-change="
                                handlePlayerChipPoolChange
                            "
                            @set-game-settings="setGameSettings"
                        />
                    </v-stepper-window-item>
                    <v-stepper-window-item key="1-step-content" :value="2">
                        <EnterResults />
                    </v-stepper-window-item>
                    <v-stepper-window-item key="2-step-content" :value="3">
                        STEP 3
                    </v-stepper-window-item>
                </v-stepper-window>
                <v-container class="mt-auto flex justify-between">
                    <v-btn v-if="step > 1" @click="step--">
                        {{ $t('Previous') }}
                    </v-btn>
                    <v-spacer />
                    <span>
                        <v-btn
                            :disabled="nextButton[step - 1].disabled"
                            @click="
                                step === 3
                                    ? close()
                                    : nextButton[step - 1].action()
                            "
                        >
                            {{ nextButton[step - 1].label }}
                        </v-btn>
                        <v-tooltip
                            v-if="nextButton[step - 1].disabled"
                            activator="parent"
                            :max-width="300"
                        >
                            {{ nextButton[step - 1]?.disabledMessage }}
                        </v-tooltip>
                    </span>
                </v-container>
            </v-stepper>
        </template>
    </ModalWrapper>
</template>

<script lang="ts" setup>
    import { doc, setDoc, Timestamp } from 'firebase/firestore'
    import { getFunctions, httpsCallable } from 'firebase/functions'
    import EnterResults from '~/components/GameCreator/EnterResults.vue'
    import InitialSettings from '~/components/GameCreator/InitialSettings.vue'
    import ModalWrapper from '~/components/ModalWrapper/ModalWrapper.vue'
    import EnumGameStatus from '~/Enums/EnumGameStatus'
    import EnumModals from '~/Enums/EnumModals'
    import defaultGameSettings from '~/models/defaultGameSettings'

    defineProps<{
        modalId: string
    }>()

    const { t } = useI18n()
    const db = useFirestore()
    const firebaseApp = useFirebaseApp()
    const fn = getFunctions(firebaseApp, 'europe-central2')
    const { user } = storeToRefs(useAuthStore())
    const { gameModalSettings } = storeToRefs(useModalManagerStore())

    const modalOptions = {
        type: EnumModals.GAME_MODAL,
        maxWidth: '60vw',
        minHeight: 650,
        persistent: true,
    }

    const step = ref(1)
    const gameSettings = ref({ ...new defaultGameSettings() })
    const selectedPlayers = ref<UserGameData[]>([])
    const isLoading = ref<boolean>(false)
    const steps = [t('Initial settings'), t('Enter results'), t('Summary')]

    const nextButton = computed(() => {
        return [
            {
                label:
                    gameSettings.value.status === EnumGameStatus.PENDING
                        ? t('Enter results')
                        : t('Start game'),
                disabled:
                    gameSettings.value.status === EnumGameStatus.PENDING
                        ? false
                        : selectedPlayers.value?.length < 2,
                disabledMessage: t('Add at least 2 players to create a match'),
                action:
                    gameSettings.value.status === EnumGameStatus.PENDING
                        ? () => step.value++
                        : startGame,
            },
            {
                label: t('Finish game'),
                disabled: false,
                action: () => step.value++,
            },
            { label: t('Close'), disabled: false, action: () => void null },
        ]
    })

    onMounted(() => {
        if (gameModalSettings.value) {
            gameSettings.value = {
                ...gameModalSettings.value.gameSettings,
                status: gameModalSettings.value.status,
                id: gameModalSettings.value.id,
            }

            if (gameModalSettings.value.status === EnumGameStatus.PENDING) {
                step.value = 2
            }

            return
        }
    })

    function setGameSettings(settings: GameSettings) {
        gameSettings.value = settings
    }

    function handleChipPoolChange() {
        selectedPlayers.value.forEach((player) => {
            if (!player.chipPoolValueChanged) {
                player.chipPool = gameSettings.value.chipPool
            }
        })
    }

    function handlePlayerChipPoolChange(player: UserGameData) {
        selectedPlayers.value.forEach((el: UserGameData, index) => {
            if (player.uid === el.uid) {
                selectedPlayers.value[index].chipPoolValueChanged = true
            }
        })
    }

    function handlePlayerSelect(people: UserGameData[], players: string[]) {
        const filteredPlayers = people
            .filter((el: UserGameData) => players.includes(el.uid))
            .map((player) => {
                return {
                    ...player,
                    chipPool: gameSettings.value.chipPool,
                }
            })

        selectedPlayers.value = filteredPlayers.map((player) => {
            const prevPlayer = selectedPlayers.value.find(
                (el) => el.uid === player.uid,
            )
            return {
                ...player,
                ...prevPlayer,
            }
        })
    }

    async function saveSettings() {
        if (!user?.value?.uid) {
            return
        }

        const userRef = doc(db, 'users', user.value.uid)
        isLoading.value = true

        await setDoc(
            userRef,
            {
                defaultSettings: gameSettings.value,
            },
            { merge: true },
        )

        isLoading.value = false
    }

    async function startGame() {
        isLoading.value = true
        const startGame = httpsCallable(fn, 'startGame')
        startGame({
            created_at: Timestamp.fromDate(new Date()),
            gameSettings: gameSettings.value,
            players: selectedPlayers.value,
            status: EnumGameStatus.PENDING,
        } as GamePayload).then((res) => {
            const {
                id,
                gameSettings: receivedGameSettings,
                status,
            } = res.data as GamePayload
            gameSettings.value = { ...receivedGameSettings, id, status }
            isLoading.value = false
            step.value++
        })
    }
</script>

<style lang="scss" scoped>
    .GameModal {
        &-Content {
            height: 100%;
            display: flex;
            flex-direction: column;

            .v-stepper-header {
                max-width: 60%;
                margin: 0 auto;
                box-shadow: none;
            }
        }
    }

    .PlayersTable {
        &-Score {
            font-size: 14px;
            opacity: var(--v-medium-emphasis-opacity);
            .v-icon {
                margin-right: 4px;
            }
        }
    }
</style>
