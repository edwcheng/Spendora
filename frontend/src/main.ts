import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { pinia } from '@/stores';
import router from '@/router';
import App from './App.vue';
import './assets/main.css';

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin);

app.mount('#app');
