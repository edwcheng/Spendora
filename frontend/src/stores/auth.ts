import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '@/utils/api';
import type { User, LoginCredentials, RegisterCredentials } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('spendora_token'));
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginCredentials) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.login(credentials);
      token.value = response.accessToken;
      user.value = response.user;
      return response;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function register(credentials: RegisterCredentials) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.register(credentials);
      token.value = response.accessToken;
      user.value = response.user;
      return response;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchProfile() {
    if (!token.value) return;
    loading.value = true;
    try {
      user.value = await api.getProfile();
    } catch (e) {
      logout();
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    api.logout();
    token.value = null;
    user.value = null;
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    fetchProfile,
    logout,
  };
});
