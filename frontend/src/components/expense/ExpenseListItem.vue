<script setup lang="ts">
import { ref } from 'vue';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/format';
import type { Expense } from '@/types';

const props = defineProps<{
  expense: Expense;
}>();

const emit = defineEmits<{
  edit: [expense: Expense];
  delete: [id: string];
}>();

const showActions = ref(false);
const confirmingDelete = ref(false);

function handleDelete() {
  if (confirmingDelete.value) {
    emit('delete', props.expense.id);
  } else {
    confirmingDelete.value = true;
    setTimeout(() => {
      confirmingDelete.value = false;
    }, 3000);
  }
}
</script>

<template>
  <div
    class="flex items-center gap-4 p-4 bg-base-100 rounded-xl border border-base-200 hover:border-primary/30 transition-colors"
    @mouseenter="showActions = true"
    @mouseleave="showActions = false; confirmingDelete = false"
  >
    <!-- Category icon -->
    <div
      class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      :style="{ backgroundColor: expense.category.color ? `${expense.category.color}20` : '#10b98120' }"
    >
      <span
        class="text-xl font-bold"
        :style="{ color: expense.category.color || '#10b981' }"
      >
        {{ expense.category.name[0] }}
      </span>
    </div>

    <!-- Details -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h4 class="font-semibold truncate">{{ expense.category.name }}</h4>
        <span
          v-if="expense.isRecurring"
          class="badge badge-sm badge-primary/20 text-primary gap-1"
        >
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Recurring
        </span>
      </div>
      <p class="text-sm text-base-content/60 truncate">
        {{ expense.note || formatDate(expense.date) }}
      </p>
      <p class="text-xs text-base-content/40">{{ formatRelativeTime(expense.date) }}</p>
    </div>

    <!-- Amount -->
    <div class="text-right shrink-0">
      <p class="font-bold text-lg text-error">-{{ formatCurrency(expense.amount) }}</p>
    </div>

    <!-- Actions -->
    <div
      v-show="showActions"
      class="flex gap-1 shrink-0"
    >
      <button
        @click="emit('edit', expense)"
        class="btn btn-ghost btn-sm btn-circle touch-target"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
      <button
        @click="handleDelete"
        :class="[
          'btn btn-sm btn-circle touch-target',
          confirmingDelete ? 'btn-error' : 'btn-ghost'
        ]"
      >
        <svg v-if="!confirmingDelete" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </div>
</template>
