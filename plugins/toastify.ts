import Vue3Toastify, { type ToastContainerOptions, toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

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
