<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore, useThemeStore } from '@/stores';

const authStore = useAuthStore();
const themeStore = useThemeStore();

onMounted(async () => {
  // Initialize theme
  themeStore.setTheme(themeStore.theme);

  // Fetch user profile if authenticated
  if (authStore.isAuthenticated) {
    try {
      await authStore.fetchProfile();
    } catch {
      // Silently fail - router will handle redirect
    }
  }
});
</script>

<template>
  <div class="min-h-screen bg-base-100 transition-colors duration-300">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
