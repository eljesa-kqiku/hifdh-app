import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@/common/interceptor.js'

let app = createApp(App)

app.mount('#app')
