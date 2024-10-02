export default defineNuxtPlugin((app) => {
    app.vueApp.directive('enforce-min-max', (el: HTMLInputElement) => {
        el.onkeyup = (event: KeyboardEvent) => {
            const target = event?.target as HTMLInputElement

            if (!target?.value) {
                return
            }
            if (
                parseInt(target.value) < parseInt(target.min) ||
                target.value === ''
            ) {
                target.value = target.min
            }
            if (parseInt(target.value) > parseInt(target.max)) {
                target.value = target.max
            }
        }
    })
})
