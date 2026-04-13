<script setup lang="ts">
import AppHeader from './AppHeader.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 container mx-auto px-4 py-6">
      <slot />
    </main>
    <footer class="py-4 text-center text-sm text-base-content/60">
      <p>© 2024 Spendora — Track smarter, spend better</p>
    </footer>
  </div>
</template>
