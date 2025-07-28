import { createApp } from 'vue'
import './style/tailwind.css'
import './style/main.css'
import App from './App.vue'
import '@/common/interceptor.js'
import { createI18n } from 'vue-i18n'
import languageKeys from '@/assets/language.json'
let app = createApp(App)

const supportedLanguages = ["ar", "en", "sq"]
const formattedLanguageKeys = supportedLanguages.map(lang => {
    const allKeys = Object.keys(languageKeys)?.map(key => ({key, value: languageKeys[key][lang]}))
    return allKeys?.reduce((acc, obj) => {
        return {lang: acc.lang, messages: {...acc.messages, [obj.key]: obj.value}}
    }, {lang, messages: {}})
})?.reduce((acc, obj) => {
    return {...acc, [obj.lang]: obj.messages}
}, {})
const i18n = createI18n({
    legacy: true,
    locale: 'en',
    fallbackLocale: 'en',
    messages: formattedLanguageKeys
})

app.use(i18n)
app.mount('#app')
