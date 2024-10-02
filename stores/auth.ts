import { defineStore } from 'pinia'
import type { User, Unsubscribe } from 'firebase/auth'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from 'firebase/auth'
import { doc, setDoc, Timestamp, onSnapshot } from 'firebase/firestore'
import {
    ref as storageRef,
    uploadBytes,
    getDownloadURL,
} from 'firebase/storage'
import { getConvertedPictureFiles } from '~/utils/picture'
import EnumPictureSizes from '~/Enums/EnumPictureSizes'
import type { UserInfo } from 'firebase-admin/auth'
import { getFunctions, httpsCallable } from 'firebase/functions'

export const useAuthStore = defineStore('authStore', () => {
    const isLogged = ref(false)
    const isLoading = ref(false)
    const user = ref<User | UserInfo | null>(null)
    const userData = ref<UserData | null>(null)
    const pendingGames = ref<GamePayload[] | null>(null)
    const unsubUserData = ref<Unsubscribe>(() => void null)

    const auth = useFirebaseAuth()!
    const db = useFirestore()!
    const fn = getFunctions(useFirebaseApp(), 'europe-central2')!
    const storage = useFirebaseStorage()!
    const router = useRouter()
    const route = useRoute()
    const localePath = useLocalePath()

    const getUserDisplayName = computed(() => user.value?.displayName)
    const getUserAvatar = computed(() => user.value?.photoURL)
    const getUserRankedScore = computed(() => userData.value?.rankedPoints)

    function $reset() {
        isLogged.value = false
        isLoading.value = false
        user.value = null
        userData.value = null
        unsubscribeToUserData()
    }

    function subscribeToUserData(uid: string) {
        unsubUserData.value = onSnapshot(
            doc(db, 'users', uid),
            (snapshot) => {
                userData.value = snapshot.data() as UserData
            },
            (error) => {
                handleFirebaseError(error)
            },
        )
    }

    function unsubscribeToUserData() {
        unsubUserData.value()
        unsubUserData.value = () => void null
    }

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
                        rankedPoints: 1000,
                        informalPoints: 1000,
                        friends: [],
                        groups: [],
                        matchHistory: [],
                        pendingMatches: [],
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

    watch(
        userData,
        (actualUserData: UserData | null, prevUserData: UserData | null) => {
            console.log(
                'prevUserData?.pendingMatches: ',
                prevUserData?.pendingMatches,
            )
            console.log(
                'userData?.pendingMatches',
                actualUserData?.pendingMatches,
            )

            console.log(
                `prevUserData.pendingMatches.length === userData.pendingMatches.length: `,
                prevUserData?.pendingMatches?.length ===
                    actualUserData?.pendingMatches?.length,
            )

            if (
                prevUserData?.pendingMatches?.length !==
                actualUserData?.pendingMatches?.length
            ) {
                const getPendingGames = httpsCallable(fn, 'getPendingGames')
                getPendingGames().then((res) => {
                    if (!res.data) {
                        return
                    }
                    const data = res?.data as GamePayload[]

                    pendingGames.value = data
                })
            }
        },
        { deep: true },
    )

    return {
        isLogged,
        isLoading,
        user,
        userData,
        pendingGames,

        getUserDisplayName,
        getUserAvatar,
        getUserRankedScore,

        $reset,
        subscribeToUserData,
        unsubscribeToUserData,
        signInWithEmail,
        signUpWithEmail,
        logout,
    }
})
