import { defineStore } from 'pinia'
import type { User } from 'firebase/auth'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from 'firebase/auth'
import { doc, setDoc, Timestamp } from 'firebase/firestore'
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage'
import { getConvertedPictureFiles } from '~/utils/picture'
import EnumPictureSizes from '~/Enums/EnumPictureSizes'
import type { UserInfo } from 'firebase-admin/auth'

export const useAuthStore = defineStore('authStore', () => {
    const isLogged = ref(false)
    const isLoading = ref(false)
    const user = ref<User | UserInfo | null>(null)

    const auth = useFirebaseAuth()!
    const db = useFirestore()!
    const storage = useFirebaseStorage()!
    const router = useRouter()
    const route = useRoute()
    const localePath = useLocalePath()

    const userDisplayName = computed(() => user.value?.displayName)
    const userAvatar = computed(() => user.value?.photoURL)

    async function signInWithEmail(payload: SignInForm) {
        const { email, password } = payload

        isLoading.value = true
        await signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                handleFirebaseError(error)
            })
            .finally(() => {
                const { query: { redirectTo = '' } = {} } = route
                const redirectPath = String(redirectTo)
                    ? String(redirectTo)
                    : localePath('/')

                isLoading.value = false
                router.replace(redirectPath)
            })
    }

    function logout() {
        isLoading.value = true

        signOut(auth)
            .catch((error) => {
                handleFirebaseError(error)
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    function signUpWithEmail(payload: SignUpForm) {
        const { email, password } = payload

        isLoading.value = true

        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const { email, name, surname, username, picture } = payload
                const authenticatedUser = userCredential.user
                const basePath = `avatars/${authenticatedUser.uid}`

                if (picture) {
                    const files = await getConvertedPictureFiles(picture)
                    await Promise.all(
                        files.map((picture: IPicture) => {
                            const avatarRef = storageRef(
                                storage,
                                `${basePath}/${picture.name}`,
                            )

                            uploadBytes(avatarRef, picture.file, {
                                contentType: picture.type,
                            }).then(async (res) => {
                                const link = await getDownloadURL(res.ref)

                                if (picture.size === EnumPictureSizes.ICON) {
                                    await updateProfile(authenticatedUser, {
                                        photoURL: link,
                                    })
                                }

                                await setDoc(
                                    doc(
                                        db,
                                        'users',
                                        String(authenticatedUser?.uid),
                                    ),
                                    {
                                        avatar: {
                                            [picture.sizeName]: link,
                                        },
                                    },
                                    { merge: true },
                                )
                            })
                        }),
                    )
                }

                await setDoc(
                    doc(db, 'users', String(authenticatedUser?.uid)),
                    {
                        email: email,
                        name: name,
                        surname: surname,
                        username: username,
                        uid: authenticatedUser?.uid,
                        created_at: Timestamp.fromDate(new Date()),
                    },
                    { merge: true },
                )

                await updateProfile(authenticatedUser, {
                    displayName: username,
                })

                await authenticatedUser.reload()

                user.value = auth.currentUser
            })
            .catch((error) => {
                handleFirebaseError(error)
            })
            .finally(() => {
                const { query: { redirectTo = '' } = {} } = route
                const redirectPath = String(redirectTo)
                    ? String(redirectTo)
                    : localePath('/')

                isLoading.value = false
                router.replace(redirectPath)
            })
    }

    return {
        isLogged,
        isLoading,
        user,

        userDisplayName,
        userAvatar,

        signInWithEmail,
        signUpWithEmail,
        logout,
    }
})
