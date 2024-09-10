<template>
    <v-dialog
        v-model="isOpened"
        :content-class="`modal-wrapper__${options.type}`"
        :fullscreen="$device.isMobile"
        :max-width="options.maxWidth"
        :persistent="options.persistent"
        :scrollable="options.scrollable"
        :transition="options.transition"
        :attach="options.attach"
        :target="options.target"
        @update:model-value="handleValueChange"
        @click:outside="closeModal(modalId)"
    >
        <v-card>
            <v-toolbar flat>
                <v-toolbar-title>{{ options.modalTitle }}</v-toolbar-title>
                <v-spacer />
                <v-btn icon @click="closeModal(modalId)">
                    <v-icon> mdi-close </v-icon>
                </v-btn>
            </v-toolbar>
            <div class="modal-content">
                <slot :close="closeModal" />
            </div>
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

    // const isOpened = ref(false)

    const modalManagerStore = useModalManagerStore()
    const { closeModal } = modalManagerStore
    const { modals } = storeToRefs(modalManagerStore)
    const { modalId } = props

    const isOpened = computed(() => {
        return modals.value.includes(modalId)
    })

    function handleValueChange(value: boolean) {
        if (!value) {
            closeModal(modalId)
        }
    }
</script>

<style></style>
