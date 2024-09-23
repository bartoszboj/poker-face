<template>
    <v-sheet
        elevation="8"
        max-width="500"
        width="100%"
        :height="$device.isMobile ? '100%' : 'auto'"
    >
        <v-img
            src="/img/logo.png"
            width="200"
            height="100"
            class="mx-auto my-4"
        />
        <v-tabs v-model="tab" align-tabs="center">
            <v-tab :key="EnumLogin.SIGN_IN_KEY" :value="EnumLogin.SIGN_IN_KEY">
                {{ $t('Sign in') }}
            </v-tab>
            <v-tab :key="EnumLogin.SIGN_UP_KEY" :value="EnumLogin.SIGN_UP_KEY">
                {{ $t('Create account') }}
            </v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item
                :key="EnumLogin.SIGN_IN_KEY"
                :value="EnumLogin.SIGN_IN_KEY"
                class="p-8"
            >
                <v-form
                    v-model="signInFormValid"
                    :readonly="isLoading"
                    @submit.prevent="handleSignIn"
                >
                    <div class="mb-2 space-y-3">
                        <v-text-field
                            v-model="signInForm.email"
                            required
                            :label="$t('E-mail')"
                            prepend-inner-icon="mdi-account"
                            name="username"
                            type="text"
                            :rules="[...rules.isRequired]"
                        />

                        <v-text-field
                            v-model="signInForm.password"
                            required
                            label="Password"
                            name="password"
                            prepend-inner-icon="mdi-lock"
                            type="password"
                            :rules="[...rules.isRequired]"
                        />
                    </div>
                    <v-btn
                        prepend-icon="mdi-login"
                        type="submit"
                        block
                        color="success"
                        size="large"
                        :disabled="!signInFormValid"
                        :loading="isLoading"
                    >
                        {{ $t('Sign in') }}
                    </v-btn>
                </v-form>
            </v-tabs-window-item>
            <v-tabs-window-item
                :key="EnumLogin.SIGN_UP_KEY"
                :value="EnumLogin.SIGN_UP_KEY"
                class="p-8"
            >
                <v-form
                    v-model="signUpFormValid"
                    :readonly="isLoading"
                    @submit.prevent="handleSignUp"
                >
                    <div class="mb-2 space-y-3">
                        <v-text-field
                            v-model="signUpForm.username"
                            :maxlength="EnumLogin.USERNAME_MAX_CHARS"
                            required
                            :label="$t('Username')"
                            name="username"
                            type="text"
                            validate-on="blur"
                            :rules="[...rules.isRequired, ...rules.username]"
                        />
                        <v-text-field
                            v-model="signUpForm.email"
                            :maxlength="EnumLogin.NAME_MAX_CHARS"
                            required
                            :label="$t('E-mail')"
                            name="e-mail"
                            type="mail"
                            :rules="[...rules.isRequired, ...rules.email]"
                        />
                        <v-text-field
                            v-model="signUpForm.name"
                            :maxlength="EnumLogin.NAME_MAX_CHARS"
                            required
                            :label="$t('Name')"
                            name="name"
                            type="text"
                            :rules="[...rules.isRequired, ...rules.name]"
                        />
                        <v-text-field
                            v-model="signUpForm.surname"
                            :maxlength="EnumLogin.NAME_MAX_CHARS"
                            required
                            :label="$t('Surname')"
                            name="surname"
                            type="text"
                            :rules="[...rules.isRequired, ...rules.surname]"
                        />
                        <v-text-field
                            v-model="signUpForm.password"
                            :maxlength="EnumLogin.PASSWORD_MAX_CHARS"
                            required
                            :label="$t('Password')"
                            name="password"
                            type="password"
                            :rules="[...rules.isRequired, ...rules.password]"
                        />
                        <v-text-field
                            v-model="signUpForm.repeatedPassword"
                            :maxlength="EnumLogin.PASSWORD_MAX_CHARS"
                            required
                            :label="$t('Repeat password')"
                            name="repeat-password"
                            type="password"
                            :rules="[
                                ...rules.isRequired,
                                ...rules.password,
                                ...rules.repeatedPassword,
                            ]"
                        />
                        <AvatarInput
                            v-model="signUpForm.picture"
                            accept=".jpg, .jpeg, .webp, .png"
                            :is-loading="isLoading"
                        />
                    </div>
                    <v-btn
                        type="submit"
                        size="large"
                        color="success"
                        block
                        prepend-icon="mdi-check"
                        :disabled="!signUpFormValid"
                        :loading="isLoading"
                    >
                        {{ $t('Create account') }}
                    </v-btn>
                </v-form>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>

<script lang="ts" setup>
    import EnumLogin from '~/Enums/EnumLogin'
    import AvatarInput from '~/components/AvatarInput/AvatarInput.vue'
    import { collection, query, where, getDocs } from 'firebase/firestore'

    const { t } = useI18n()
    const db = useFirestore()
    const tab = ref(EnumLogin.SIGN_IN_KEY)

    const { signUpWithEmail, signInWithEmail } = useAuthStore()
    const { isLoading } = storeToRefs(useAuthStore())

    const signInFormValid = ref<boolean>(false)
    const signUpFormValid = ref<boolean>(false)

    const signInForm = reactive<SignInForm>({
        email: '',
        password: '',
    })

    const signUpForm = reactive<SignUpForm>({
        username: '',
        password: '',
        repeatedPassword: '',
        email: '',
        name: '',
        surname: '',
        picture: undefined,
    })

    const rules = {
        isRequired: [(v: string) => !!v || t('This field is required.')],
        username: [
            (v: string) =>
                (v && v.length <= EnumLogin.USERNAME_MAX_CHARS) ||
                t(
                    `Username must be less than UsernameMaxCharacters characters.`,
                    { UsernameMaxCharacters: EnumLogin.USERNAME_MAX_CHARS },
                ),
            async (v: string) => {
                const q = query(
                    collection(db, 'users'),
                    where('username', '==', v),
                )

                const snapshot = await getDocs(q)
                return snapshot.empty || t('Username is already taken.')
            },
        ],
        name: [
            (v: string) =>
                (v && v.length <= EnumLogin.NAME_MAX_CHARS) ||
                t(`Name must be less than NameMaxCharacters characters.`, {
                    NameMaxCharacters: EnumLogin.NAME_MAX_CHARS,
                }),
        ],
        surname: [
            (v: string) =>
                (v && v.length <= EnumLogin.NAME_MAX_CHARS) ||
                t(`Surname must be less than NameMaxCharacters characters.`, {
                    NameMaxCharacters: EnumLogin.NAME_MAX_CHARS,
                }),
        ],
        email: [
            (v: string) =>
                /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    v,
                ) || t('E-mail must be valid.'),
        ],
        password: [
            (v: string) =>
                (v && v.length <= EnumLogin.PASSWORD_MAX_CHARS) ||
                t(
                    'Password must be less than PasswordMaxCharacters characters.',
                    { PasswordMaxCharacters: EnumLogin.PASSWORD_MAX_CHARS },
                ),
        ],
        repeatedPassword: [
            () =>
                signUpForm.password === signUpForm.repeatedPassword ||
                t('Passwords must match.'),
        ],
    }

    function handleSignIn() {
        signInWithEmail(signInForm)
    }

    function handleSignUp() {
        signUpWithEmail(signUpForm)
    }
</script>

<style></style>
