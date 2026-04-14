<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg';
}>();
</script>

<template>
  <div class="flex items-center justify-center">
    <span
      :class="[
        'loading loading-spinner loading-primary',
        size === 'sm' ? 'loading-sm' : size === 'lg' ? 'loading-lg' : ''
      ]"
    />
  </div>
</template>
