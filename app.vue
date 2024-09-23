<template>
    <v-app>
        <!-- <NuxtLoadingIndicator /> -->
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <GameModal />
    </v-app>
</template>

<script setup>
    import GameModal from './components/modals/GameModal/GameModal.vue'
    import EnumRoutes from './Enums/EnumRoutes'
    const auth = useFirebaseAuth()
    const { user, isLogged } = storeToRefs(useAuthStore())
    const router = useRouter()
    const route = useRoute()
    const localePath = useLocalePath()

    onBeforeMount(() => {
        auth.onAuthStateChanged((authenticatedUser) => {
            console.log({ authenticatedUser })
            if (authenticatedUser) {
                user.value = authenticatedUser
                isLogged.value = true
            } else {
                user.value = null
                isLogged.value = false
                router.push({
                    path: localePath(EnumRoutes.LOGIN),
                    query: {
                        redirectTo: route.path,
                    },
                })
            }
        })
    })
</script>
