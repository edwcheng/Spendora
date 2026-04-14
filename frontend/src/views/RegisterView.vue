<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const name = ref('');
const showPassword = ref(false);
const loading = ref(false);
const error = ref('');

async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await authStore.register({
      email: email.value,
      password: password.value,
      name: name.value || undefined,
    });
    router.push('/');
  } catch (e: any) {
    error.value = e.message || 'Registration failed';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-primary/20">
          <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold mt-4">Create account</h1>
        <p class="text-base-content/60 mt-2">Start tracking your expenses with Spendora</p>
      </div>

      <!-- Form -->
      <div class="card-spending">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <!-- Error alert -->
          <div v-if="error" class="alert alert-error">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ error }}</span>
          </div>

          <!-- Name -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Name (optional)</span>
            </label>
            <input
              type="text"
              v-model="name"
              class="input input-bordered w-full touch-target"
              placeholder="Your name"
            />
          </div>

          <!-- Email -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              v-model="email"
              required
              class="input input-bordered w-full touch-target"
              placeholder="you@example.com"
            />
          </div>

          <!-- Password -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Password</span>
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                required
                minlength="6"
                class="input input-bordered w-full pr-12 touch-target"
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Confirm Password</span>
            </label>
            <input
              type="password"
              v-model="confirmPassword"
              required
              class="input input-bordered w-full touch-target"
              placeholder="Confirm your password"
            />
          </div>

          <!-- Submit -->
          <button
            type="submit"
            class="btn btn-primary w-full touch-target"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner" />
            <span v-else>Create Account</span>
          </button>
        </form>

        <!-- Login link -->
        <p class="text-center text-sm text-base-content/60 mt-6">
          Already have an account?
          <router-link to="/login" class="text-primary font-medium hover:underline">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>
