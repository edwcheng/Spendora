import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DateRangePreset, DateRange } from '@/types';
import { getDateRange } from '@/utils/format';

export const useExpenseStore = defineStore('expense', () => {
  const dateRangePreset = ref<DateRangePreset>('this_month');
  const customDateRange = ref<DateRange | null>(null);
  const selectedCategoryId = ref<string | null>(null);

  function setDateRangePreset(preset: DateRangePreset) {
    dateRangePreset.value = preset;
    if (preset !== 'custom') {
      customDateRange.value = null;
    }
  }

  function setCustomDateRange(range: DateRange) {
    customDateRange.value = range;
    dateRangePreset.value = 'custom';
  }

  function getEffectiveDateRange(): { startDate: string; endDate: string } {
    if (dateRangePreset.value === 'custom' && customDateRange.value) {
      return customDateRange.value;
    }
    return getDateRange(dateRangePreset.value);
  }

  function clearFilters() {
    dateRangePreset.value = 'this_month';
    customDateRange.value = null;
    selectedCategoryId.value = null;
  }

  return {
    dateRangePreset,
    customDateRange,
    selectedCategoryId,
    setDateRangePreset,
    setCustomDateRange,
    getEffectiveDateRange,
    clearFilters,
  };
});
