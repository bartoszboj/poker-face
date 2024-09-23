export default defineNuxtRouteMiddleware((to) => {
    const localePath = useLocalePath()

    const path =
        to.path[to.path.length - 1] == '/' ? to.path.slice(0, -1) : to.path

    if (path === localePath('/') || path == '/') {
        return navigateTo(localePath('scoreboard'))
    }
})
