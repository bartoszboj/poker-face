<template>
    <v-file-input
        v-model="model"
        :label="$t('Add picture')"
        :accept="accept"
        chips
        show-size
        prepend-inner-icon="mdi-camera"
        prepend-icon=""
        :rules="rules"
        :loading="isLoading"
    >
        <template #selection="{ fileNames }">
            <v-chip class="me-2" color="primary" size="small" label>
                <Avatar
                    :size="16"
                    :src="uploadedPicturePreview"
                    :rounded="0"
                    class="mr-2"
                />
                {{ fileNames[0] }}
            </v-chip>
        </template>
    </v-file-input>
</template>

<script lang="ts" setup>
    interface Props {
        accept?: string
        isLoading?: boolean
    }

    withDefaults(defineProps<Props>(), {
        accept: '.jpg, .jpeg, .webp, .png',
        isLoading: false,
    })

    const model = defineModel<File | File[] | null | undefined>()

    const { t } = useI18n()

    const rules = [
        (v: File[] | null | undefined) => {
            return (
                !v ||
                !v.length ||
                v[0].size < 2000000 ||
                t('Picture size should be less than 2MB!')
            )
        },
    ]

    const uploadedPicturePreview = computed<string>(() => {
        const pictureUrl = model.value
            ? URL.createObjectURL(model.value as Blob)
            : ''

        return pictureUrl
    })

    onBeforeUnmount(() => {
        if (uploadedPicturePreview.value) {
            URL.revokeObjectURL(uploadedPicturePreview.value)
        }
    })
</script>

<style></style>
