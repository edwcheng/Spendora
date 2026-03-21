import { createPinia } from 'pinia';

export const pinia = createPinia();

export { useAuthStore } from './auth';
export { useExpenseStore } from './expense';
export { useThemeStore } from './theme';
