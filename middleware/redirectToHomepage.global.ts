export default defineNuxtRouteMiddleware((to) => {
    const localePath = useLocalePath()

    if (to.path === localePath('/')) {
        console.log({ to })
        return navigateTo(localePath('scoreboard'))
    }
})
