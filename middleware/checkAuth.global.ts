import { useAuthStore } from '~/stores/auth'

import EnumRoutes from '~/Enums/EnumRoutes'

export default defineNuxtRouteMiddleware((to) => {
    const { isLogged } = useAuthStore()
    const localePath = useLocalePath()

    if (!isLogged && to.path !== localePath(EnumRoutes.LOGIN)) {
        return navigateTo(localePath(EnumRoutes.LOGIN))
    }
})
