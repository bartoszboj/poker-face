<template>
    <v-sheet
        elevation="8"
        max-width="400"
        width="100%"
        :height="$device.isMobile ? '100%' : 'auto'"
    >
        <v-img
            :src="imgUrl"
            width="200"
            :aspect-ratio="1"
            class="mx-auto my-4"
        />
        <v-tabs v-model="tab" align-tabs="center">
            <v-tab :key="LoginEnum.LoginKey" :value="LoginEnum.LoginKey">
                {{ $t('Sign in') }}
            </v-tab>
            <v-tab :key="LoginEnum.RegisterKey" :value="LoginEnum.RegisterKey">
                {{ $t('Create account') }}
            </v-tab>
        </v-tabs>
        <v-tabs-window v-model="tab">
            <v-tabs-window-item
                :key="LoginEnum.LoginKey"
                :value="LoginEnum.LoginKey"
                class="p-8"
            >
                <v-form
                    v-model="signInFormValid"
                    :readonly="loading"
                    @submit.prevent="handleSignIn"
                >
                    <div class="mb-2 space-y-3">
                        <v-text-field
                            v-model="signInForm.username"
                            required
                            :label="$t('Username or e-mail address')"
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
                        :loading="loading"
                    >
                        {{ $t('Sign in') }}
                    </v-btn>
                </v-form>
            </v-tabs-window-item>
            <v-tabs-window-item
                :key="LoginEnum.RegisterKey"
                :value="LoginEnum.RegisterKey"
                class="p-8"
            >
                <v-form
                    v-model="signUpFormValid"
                    :readonly="loading"
                    @submit.prevent="handleSignUp"
                >
                    <div class="mb-2 space-y-3">
                        <v-text-field
                            v-model="signUpForm.username"
                            :maxlength="LoginEnum.UsernameMaxCharacters"
                            required
                            :label="$t('Username')"
                            name="username"
                            type="text"
                            :rules="[...rules.isRequired, ...rules.username]"
                        />
                        <v-text-field
                            v-model="signUpForm.mail"
                            :maxlength="LoginEnum.NameMaxCharacters"
                            required
                            :label="$t('E-mail')"
                            name="e-mail"
                            type="mail"
                            :rules="[...rules.isRequired, ...rules.mail]"
                        />
                        <v-text-field
                            v-model="signUpForm.name"
                            :maxlength="LoginEnum.NameMaxCharacters"
                            required
                            :label="$t('Name')"
                            name="name"
                            type="text"
                            :rules="[...rules.isRequired, ...rules.name]"
                        />
                        <v-text-field
                            v-model="signUpForm.surname"
                            :maxlength="LoginEnum.NameMaxCharacters"
                            required
                            :label="$t('Surname')"
                            name="surname"
                            type="text"
                            :rules="[...rules.isRequired, ...rules.surname]"
                        />
                        <v-text-field
                            v-model="signUpForm.password"
                            :maxlength="LoginEnum.PasswordMaxCharacters"
                            required
                            :label="$t('Password')"
                            name="password"
                            type="password"
                            :rules="[...rules.isRequired, ...rules.password]"
                        />
                        <v-text-field
                            v-model="signUpForm.repeatedPassword"
                            :maxlength="LoginEnum.PasswordMaxCharacters"
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
                    </div>
                    <v-btn
                        type="submit"
                        size="large"
                        color="success"
                        block
                        prepend-icon="mdi-check"
                        :disabled="!signUpFormValid"
                        :loading="loading"
                    >
                        {{ $t('Create account') }}
                    </v-btn>
                </v-form>
            </v-tabs-window-item>
        </v-tabs-window>
    </v-sheet>
</template>

<script lang="ts" setup>
    import LoginEnum from '~/Enums/LoginEnum'
    const { t } = useI18n()

    const imgUrl =
        'https://purepng.com/public/uploads/large/purepng.com-poker-chipspokercard-gamescombines-gamblingstrategyskillsportgamepoker-chips-1701528180814g4ufq.png'
    const tab = ref(LoginEnum.LoginKey)
    const loading = ref(false)

    const signInFormValid = ref(false)
    const signUpFormValid = ref(false)

    const signInForm = reactive({
        username: '',
        password: '',
    })
    const signUpForm = reactive({
        username: '',
        password: '',
        repeatedPassword: '',
        mail: '',
        name: '',
        surname: '',
    })

    const rules = {
        isRequired: [(v) => !!v || t('This field is required.')],
        username: [
            (v) =>
                (v && v.length <= LoginEnum.UsernameMaxCharacters) ||
                t(
                    `Username must be less than UsernameMaxCharacters characters.`,
                    { UsernameMaxCharacters: LoginEnum.UsernameMaxCharacters },
                ),
        ],
        name: [
            (v) =>
                (v && v.length <= LoginEnum.NameMaxCharacters) ||
                t(`Name must be less than NameMaxCharacters characters.`, {
                    NameMaxCharacters: LoginEnum.NameMaxCharacters,
                }),
        ],
        surname: [
            (v) =>
                (v && v.length <= LoginEnum.NameMaxCharacters) ||
                t(`Surname must be less than NameMaxCharacters characters.`, {
                    NameMaxCharacters: LoginEnum.NameMaxCharacters,
                }),
        ],
        mail: [
            (v) =>
                /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()\\[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                    v,
                ) || t('E-mail must be valid.'),
        ],
        password: [
            (v) =>
                (v && v.length <= LoginEnum.PasswordMaxCharacters) ||
                t(
                    'Password must be less than PasswordMaxCharacters characters.',
                    { PasswordMaxCharacters: LoginEnum.PasswordMaxCharacters },
                ),
        ],
        repeatedPassword: [
            () =>
                signUpForm.password === signUpForm.repeatedPassword ||
                t('Passwords must match.'),
        ],
    }

    function handleSignIn(e) {
        console.log({ e })

        loading.value = true

        setTimeout(() => {
            loading.value = false
        }, 2000)
    }

    function handleSignUp(e) {
        console.log({ e })

        loading.value = true

        setTimeout(() => {
            loading.value = false
        }, 2000)
    }
</script>

<style></style>
