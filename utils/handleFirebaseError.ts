import type { FirebaseError } from 'firebase-admin'
import type { FirestoreError } from 'firebase/firestore'
import EnumFirebaseErrorMessages from '~/Enums/EnumFirebaseErrorMessages'

export default (error: FirebaseError | FirestoreError) => {
    const { $i18n, $toast } = useNuxtApp()

    const code = error.code.split('/')[1]
    const message = $i18n.t(EnumFirebaseErrorMessages[code]) || error.message

    $toast.error(message)
}
