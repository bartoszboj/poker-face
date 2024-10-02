export default class ModalOptions {
    type: string = ''
    modalTitle: string = ''
    scrollable: boolean = false
    maxWidth: number | null | undefined = null
    peristent: boolean = false
    transition: string = 'dialog-transition'
    attach: boolean | string | null = false
    target: undefined | string | object = undefined
}
