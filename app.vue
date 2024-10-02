<template>
    <v-app>
        <!-- <NuxtLoadingIndicator /> -->
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <template v-for="openedModal in openedModals">
            <component
                :is="openedModal?.component"
                v-if="openedModal"
                :key="openedModal?.id"
                :modal-id="openedModal?.id"
            />
        </template>
    </v-app>
</template>

<script setup>
    import GameModal from './components/modals/GameModal/GameModal.vue'
    import EnumModals from './Enums/EnumModals'
    import EnumRoutes from './Enums/EnumRoutes'

    const { openedModals: storeOpenedModals } = storeToRefs(
        useModalManagerStore(),
    )
    const auth = useFirebaseAuth()
    const authStore = useAuthStore()
    const { user, isLogged } = storeToRefs(authStore)
    const { $reset, subscribeToUserData } = authStore
    const router = useRouter()
    const route = useRoute()
    const localePath = useLocalePath()

    const modals = ref([
        {
            component: GameModal,
            id: EnumModals.GAME_MODAL,
        },
    ])

    const openedModals = computed(() => {
        return modals.value.map((modal) => {
            if (!storeOpenedModals.value.includes(modal.id)) {
                return
            }

            return {
                component: modal.component,
                id: modal.id,
            }
        })
    })

    onBeforeMount(() => {
        auth.onAuthStateChanged((authenticatedUser) => {
            console.log({ authenticatedUser })
            if (authenticatedUser) {
                user.value = authenticatedUser
                isLogged.value = true
                subscribeToUserData(authenticatedUser.uid)
            } else {
                $reset()
                router.replace({
                    path: localePath(EnumRoutes.LOGIN),
                    query: {
                        redirectTo: route.path,
                    },
                })
            }
        })
    })
</script>
