// import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to) => {
    const { isLogged } = useAuthStore()
    const localePath = useLocalePath()

    if (!isLogged && to.path !== localePath('login')) {
        return navigateTo(localePath('login'))
    }
})
