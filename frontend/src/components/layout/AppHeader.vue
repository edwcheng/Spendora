<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore, useThemeStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <header class="sticky top-0 z-50 glass border-b border-base-200">
    <div class="container mx-auto px-4 h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-primary/30 transition-shadow">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
          Spendora
        </span>
      </router-link>

      <!-- Right side -->
      <div class="flex items-center gap-2">
        <!-- Theme toggle -->
        <button
          @click="themeStore.toggleTheme()"
          class="btn btn-ghost btn-circle touch-target"
          :aria-label="themeStore.theme === 'spendora' ? 'Switch to dark mode' : 'Switch to light mode'"
        >
          <svg v-if="themeStore.theme === 'spendora'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        <!-- User menu -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle avatar touch-target">
            <div class="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
              {{ authStore.user?.name?.[0] || authStore.user?.email?.[0] || 'U' }}
            </div>
          </label>
          <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-200">
            <li class="menu-title">
              <span class="text-xs">{{ authStore.user?.email }}</span>
            </li>
            <li>
              <router-link to="/expenses" class="touch-target">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                All Expenses
              </router-link>
            </li>
            <li>
              <button @click="handleLogout" class="text-error touch-target">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>
