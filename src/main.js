import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import { flushViewLogs } from '@/utils/viewLogger'

import App from './App.vue'
import router from './router'
import VueGtag from 'vue-gtag-next'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueGtag, {
  property: {
    id: import.meta.env.VITE_GA_ID,
  },
})
app.mount('#app')
