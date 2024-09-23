// import { useAuthStore } from '~/stores/auth'

import EnumRoutes from '~/Enums/EnumRoutes'

export default defineNuxtRouteMiddleware(async (to) => {
    const user = await getCurrentUser()
    const localePath = useLocalePath()

    if (user && to.path === localePath(EnumRoutes.LOGIN)) {
        return navigateTo(localePath('/'))
    }

    if (!user && to.path !== localePath(EnumRoutes.LOGIN)) {
        abortNavigation()
        return navigateTo({
            path: localePath(EnumRoutes.LOGIN),
            query: { redirectTo: to.path },
        })
    }
})
