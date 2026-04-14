import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type Theme = 'spendora' | 'spendoraDark';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(
    (localStorage.getItem('spendora_theme') as Theme) || 'spendora'
  );

  function setTheme(newTheme: Theme) {
    theme.value = newTheme;
    localStorage.setItem('spendora_theme', newTheme);
    applyTheme(newTheme);
  }

  function toggleTheme() {
    setTheme(theme.value === 'spendora' ? 'spendoraDark' : 'spendora');
  }

  function applyTheme(t: Theme) {
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'spendoraDark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Apply theme on init
  applyTheme(theme.value);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
});
