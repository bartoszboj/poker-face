export default defineI18nConfig(() => ({
    legacy: false,
    useCookie: true,
    fallbackLocale: 'en',
    switchLocalePath: '/:lang/:route',
    cookieKey: 'i18n_redirected',
    alwaysRedirect: true,
}))
