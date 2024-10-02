<template>
    <v-dialog
        v-model="isOpened"
        :content-class="`modal-wrapper__${options.type}`"
        :fullscreen="$device.isMobile"
        :max-width="options.maxWidth"
        :min-height="options.minHeight"
        :persistent="options.persistent"
        :scrollable="options.scrollable"
        :transition="options.transition"
        :attach="options.attach"
        :target="options.target"
        @update:model-value="handleValueChange"
        @click:outside="!options.persistent && closeModal(modalId)"
    >
        <v-card class="flex" width="100%">
            <v-toolbar flat color="white" height="48">
                <slot :close="close" name="actions" />
                <v-spacer />
                <slot :close="close" name="title">
                    <v-toolbar-title>{{ options.modalTitle }}</v-toolbar-title>
                </slot>
                <v-spacer />
                <slot :close="close" name="navigation">
                    <v-btn
                        icon
                        flat
                        variant="plain"
                        @click="closeModal(modalId)"
                    >
                        <v-icon> mdi-close </v-icon>
                    </v-btn>
                </slot>
            </v-toolbar>
            <slot :close="close" />
        </v-card>
    </v-dialog>
</template>

<script lang="ts" setup>
    import ModalOptions from '~/models/modalOptions'
    import { useModalManagerStore } from '~/stores/modalManager'

    const props = defineProps({
        modalId: {
            type: String,
            default: '',
        },
        options: {
            type: Object,
            default: new ModalOptions(),
        },
    })

    const modalManagerStore = useModalManagerStore()
    const { closeModal } = modalManagerStore
    const { openedModals } = storeToRefs(modalManagerStore)
    const { modalId } = props

    const isOpened = computed(() => {
        return openedModals.value.includes(modalId)
    })

    function handleValueChange(value: boolean) {
        if (!value) {
            closeModal(modalId)
        }
    }

    function close() {
        closeModal(modalId)
    }
</script>

<style lang="scss">
    .v-toolbar__content {
        position: relative;

        .v-toolbar-title {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }
    .v-dialog {
        > div.v-overlay__content {
            flex-direction: row;
        }
    }
</style>
