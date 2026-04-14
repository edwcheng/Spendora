<script setup lang="ts">
import { computed } from 'vue';
import { useExpenseStore } from '@/stores';
import type { DateRangePreset, DateRange } from '@/types';

const expenseStore = useExpenseStore();

const presets: { value: DateRangePreset; label: string }[] = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_12_months', label: 'Last 12 Months' },
  { value: 'custom', label: 'Custom' },
];

const isCustom = computed(() => expenseStore.dateRangePreset === 'custom');

const customStartDate = computed({
  get: () => expenseStore.customDateRange?.startDate || '',
  set: (val) => {
    const endDate = expenseStore.customDateRange?.endDate || val;
    expenseStore.setCustomDateRange({ startDate: val, endDate } as DateRange);
  },
});

const customEndDate = computed({
  get: () => expenseStore.customDateRange?.endDate || '',
  set: (val) => {
    const startDate = expenseStore.customDateRange?.startDate || val;
    expenseStore.setCustomDateRange({ startDate, endDate: val } as DateRange);
  },
});
</script>

<template>
  <div class="flex flex-col sm:flex-row gap-3">
    <!-- Preset selector -->
    <div class="join">
      <button
        v-for="preset in presets.slice(0, 4)"
        :key="preset.value"
        @click="expenseStore.setDateRangePreset(preset.value)"
        :class="[
          'btn join-item btn-sm touch-target',
          expenseStore.dateRangePreset === preset.value ? 'btn-primary' : 'btn-ghost'
        ]"
      >
        {{ preset.label }}
      </button>
    </div>

    <!-- Custom date inputs -->
    <div v-if="isCustom" class="flex gap-2 items-center">
      <input
        type="date"
        v-model="customStartDate"
        class="input input-sm input-bordered touch-target"
      />
      <span class="text-base-content/60">to</span>
      <input
        type="date"
        v-model="customEndDate"
        class="input input-sm input-bordered touch-target"
      />
    </div>
    <button
      v-else
      @click="expenseStore.setDateRangePreset('custom')"
      class="btn btn-sm btn-ghost touch-target"
    >
      Custom
    </button>
  </div>
</template>
