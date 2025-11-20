import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 전역 스타일 있으면 (SCSS)
// import '@/styles/index.scss'

const app = createApp(App)

app.use(createPinia())   // Pinia 등록
app.use(router)          // Router 등록
app.use(ElementPlus)     // Element Plus 등록

app.mount('#app')
