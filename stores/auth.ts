import { defineStore } from 'pinia'

type State = {
    isLogged: boolean
}

export const useAuthStore = defineStore({
    id: 'authStore',
    state: (): State => ({
        isLogged: true,
    }),
    actions: {
        logIn: () => {
            this.isLogged = !this.isLogged
        },
    },
})
