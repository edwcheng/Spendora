<script setup lang="ts">
import { computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';
import type { MonthlyTrend } from '@/types';
import { formatCurrencyShort } from '@/utils/format';
import { useThemeStore } from '@/stores';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

const props = defineProps<{
  data: MonthlyTrend[];
}>();

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === 'spendoraDark');

const chartData = computed(() => ({
  labels: props.data.map((d) => {
    const [year, month] = d.month.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-HK', {
      month: 'short',
    });
  }),
  datasets: [
    {
      label: 'Spending',
      data: props.data.map((d) => d.total),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: isDark.value ? '#1f2937' : '#ffffff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => formatCurrencyShort(context.raw),
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => formatCurrencyShort(value),
        color: isDark.value ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
      },
      grid: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
      },
    },
  },
}));
</script>

<template>
  <div class="h-48">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
