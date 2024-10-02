import { defineStore } from 'pinia'
import EnumModals from '~/Enums/EnumModals'

export const useModalManagerStore = defineStore('modalManagerStore', () => {
    const openedModals = ref<string[]>([])
    const gameModalSettings = ref<GamePayload | null>(null)

    function openModal(
        modalId: string,
        gameSettingsPayload: GamePayload | null = null,
    ) {
        if (openedModals.value.includes(modalId)) {
            return
        }

        openedModals.value.unshift(modalId)
        if (gameSettingsPayload) {
            gameModalSettings.value = gameSettingsPayload
        }
    }

    function closeModal(modalId: string) {
        openedModals.value = openedModals.value.filter(
            (element) => element !== modalId,
        )

        if (modalId === EnumModals.GAME_MODAL) {
            gameModalSettings.value = null
        }
    }

    return {
        openedModals,
        gameModalSettings,

        openModal,
        closeModal,
    }
})
