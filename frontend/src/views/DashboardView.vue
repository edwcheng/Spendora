<script setup lang="ts">
import { ref } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import DateRangePicker from '@/components/ui/DateRangePicker.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import ExpenseForm from '@/components/expense/ExpenseForm.vue';
import CategoryPieChart from '@/components/charts/CategoryPieChart.vue';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart.vue';
import ExpenseListItem from '@/components/expense/ExpenseListItem.vue';
import { useSummary, useExpenses, useDeleteExpense, useCategories } from '@/composables/useQueries';
import { useExpenseStore } from '@/stores';
import { formatCurrency } from '@/utils/format';
import { api } from '@/utils/api';
import type { Expense } from '@/types';

const expenseStore = useExpenseStore();
const { data: summary, isLoading: summaryLoading } = useSummary();
const { data: expensesData, isLoading: expensesLoading } = useExpenses(1, 5);
const { data: categories } = useCategories();
const deleteMutation = useDeleteExpense();

const showExpenseForm = ref(false);
const editingExpense = ref<Expense | null>(null);

function handleAddExpense() {
  editingExpense.value = null;
  showExpenseForm.value = true;
}

function handleEditExpense(expense: Expense) {
  editingExpense.value = expense;
  showExpenseForm.value = true;
}

function handleDeleteExpense(id: string) {
  deleteMutation.mutate(id);
}

function handleExport() {
  const dateRange = expenseStore.getEffectiveDateRange();
  const url = api.getExportUrl(dateRange);
  window.open(url, '_blank');
}
</script>

<template>
  <MainLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">Dashboard</h1>
        <p class="text-base-content/60">Track your spending at a glance</p>
      </div>
      <div class="flex gap-2">
        <button @click="handleExport" class="btn btn-ghost touch-target">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
        <button @click="handleAddExpense" class="btn btn-primary touch-target">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>
    </div>

    <!-- Date Range Filter -->
    <div class="mb-6">
      <DateRangePicker />
    </div>

    <!-- Loading State -->
    <div v-if="summaryLoading || expensesLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Content -->
    <div v-else class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Spending -->
        <div class="card-spending">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-base-content/60">Total Spending</p>
              <p class="text-xl font-bold">{{ formatCurrency(summary?.totalSpending || 0) }}</p>
            </div>
          </div>
        </div>

        <!-- Transactions -->
        <div class="card-spending">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-base-content/60">Transactions</p>
              <p class="text-xl font-bold">{{ summary?.totalTransactions || 0 }}</p>
            </div>
          </div>
        </div>

        <!-- Daily Average -->
        <div class="card-spending">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-base-content/60">Daily Average</p>
              <p class="text-xl font-bold">{{ formatCurrency(summary?.averagePerDay || 0) }}</p>
            </div>
          </div>
        </div>

        <!-- Recurring -->
        <div class="card-spending">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
              <svg class="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-base-content/60">Monthly Recurring</p>
              <p class="text-xl font-bold">{{ formatCurrency(summary?.recurringTotal || 0) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Category Breakdown -->
        <div class="card-spending">
          <h2 class="text-lg font-semibold mb-4">By Category</h2>
          <CategoryPieChart
            v-if="summary?.byCategory?.length"
            :data="summary.byCategory"
          />
          <div v-else class="text-center py-8 text-base-content/60">
            No expenses in this period
          </div>
        </div>

        <!-- Monthly Trend -->
        <div class="card-spending">
          <h2 class="text-lg font-semibold mb-4">Monthly Trend</h2>
          <MonthlyTrendChart
            v-if="summary?.monthlyTrend?.length"
            :data="summary.monthlyTrend"
          />
        </div>
      </div>

      <!-- Recent Expenses -->
      <div class="card-spending">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Recent Expenses</h2>
          <router-link to="/expenses" class="btn btn-ghost btn-sm touch-target">
            View All
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
        <div class="space-y-3">
          <ExpenseListItem
            v-for="expense in expensesData?.data"
            :key="expense.id"
            :expense="expense"
            @edit="handleEditExpense"
            @delete="handleDeleteExpense"
          />
          <div v-if="!expensesData?.data?.length" class="text-center py-8 text-base-content/60">
            No expenses yet. Add your first expense!
          </div>
        </div>
      </div>
    </div>

    <!-- Expense Form Modal -->
    <ExpenseForm
      v-if="showExpenseForm"
      :expense="editingExpense"
      @close="showExpenseForm = false"
      @saved="showExpenseForm = false"
    />
  </MainLayout>
</template>
