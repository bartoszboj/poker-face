import { defineStore } from 'pinia'

type State = {
    modals: string[]
}

export const useModalManagerStore = defineStore({
    id: 'modalManagerStore',
    state: (): State => ({
        modals: [],
    }),
    actions: {
        openModal(modalId: string) {
            if (this.modals.includes(modalId)) {
                return
            }

            this.modals.unshift(modalId)
        },
        closeModal(modalId: string) {
            this.modals = this.modals.filter((element) => element !== modalId)
        },
    },
})

// import { defineStore } from 'pinia'

// type State = {
//     modals: boolean
// }

// export const useModalManagerStore = defineStore({
//     id: 'modalManagerStore',
//     state: (): State => ({
//         modals: false,
//     }),
//     actions: {
//         openModal() {
//             this.modals = true
//         },
//         closeModal() {
//             this.modals = false
//         },
//     },
// })
