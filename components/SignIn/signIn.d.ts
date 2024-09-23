interface SignInForm {
    email: string
    password: string
}

interface SignUpForm {
    username: string
    password: string
    repeatedPassword: string
    email: string
    name: string
    surname: string
    picture?: File
}
