<template>
    <ModalWrapper v-slot="slotProps" :modal-id="modalId" :options="options" />
</template>

<script lang="ts" setup>
    import ModalWrapper from '~/components/ModalWrapper/ModalWrapper.vue'
    import EnumModals from '~/Enums/EnumModals'

    const modalId = EnumModals.GAME_MODAL

    const options = {
        type: EnumModals.GAME_MODAL,
        maxWidth: 520,
    }
</script>

<style></style>
