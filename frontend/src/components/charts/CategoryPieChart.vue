<script setup lang="ts">
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { CategorySummary } from '@/types';
import { formatCurrency, formatCurrencyShort } from '@/utils/format';
import { useThemeStore } from '@/stores';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  data: CategorySummary[];
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === 'spendoraDark');

const chartData = computed(() => {
  const colors = props.data.map((c) => c.categoryColor || '#10b981');
  return {
    labels: props.data.map((c) => c.categoryName),
    datasets: [
      {
        data: props.data.map((c) => c.total),
        backgroundColor: colors,
        borderColor: isDark.value ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.raw;
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${formatCurrency(value)} (${percentage}%)`;
        },
      },
    },
  },
}));
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 items-center">
    <div class="w-48 h-48 shrink-0">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <div class="flex-1 space-y-2 w-full">
      <div
        v-for="item in data"
        :key="item.categoryId"
        class="flex items-center justify-between p-2 rounded-lg hover:bg-base-200 transition-colors"
      >
        <div class="flex items-center gap-2">
          <span
            class="w-3 h-3 rounded-full shrink-0"
            :style="{ backgroundColor: item.categoryColor || '#10b981' }"
          />
          <span class="text-sm font-medium">{{ item.categoryName }}</span>
        </div>
        <div class="text-right">
          <span class="text-sm font-semibold">{{ formatCurrencyShort(item.total) }}</span>
          <span class="text-xs text-base-content/60 ml-2">{{ item.percentage.toFixed(1) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
