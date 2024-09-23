import Vue3Toastify, { type ToastContainerOptions, toast } from 'vue3-toastify'

export default defineNuxtPlugin((app) => {
    app.vueApp.use(Vue3Toastify, {
        autoClose: 5000,
        newestOnTop: true,
        theme: 'colored',
    } as ToastContainerOptions)

    return {
        provide: { toast },
    }
})
