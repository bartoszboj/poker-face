import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
    id: 'authStore',
    state: () => ({
        isLogged: true,
    }),
    actions: {
        logIn: () => {
            this.isLogged = !this.isLogged
        },
    },
})
