<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import MainLayout from '@/components/layout/MainLayout.vue';
import DateRangePicker from '@/components/ui/DateRangePicker.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ExpenseForm from '@/components/expense/ExpenseForm.vue';
import ExpenseListItem from '@/components/expense/ExpenseListItem.vue';
import { useExpenses, useDeleteExpense, useCategories } from '@/composables/useQueries';
import { useExpenseStore } from '@/stores';
import { api } from '@/utils/api';
import type { Expense } from '@/types';

const expenseStore = useExpenseStore();
const page = ref(1);
const limit = ref(10);

const { data: expensesData, isLoading, refetch } = useExpenses(page, limit);
const { data: categories } = useCategories();
const deleteMutation = useDeleteExpense();

const showExpenseForm = ref(false);
const editingExpense = ref<Expense | null>(null);

const totalPages = computed(() => expensesData.value?.totalPages || 1);
const hasPrev = computed(() => page.value > 1);
const hasNext = computed(() => expensesData.value?.hasNext || false);

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

// Reset to page 1 when filters change
watch(
  () => [expenseStore.dateRangePreset, expenseStore.selectedCategoryId],
  () => {
    page.value = 1;
  }
);
</script>

<template>
  <MainLayout>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold">All Expenses</h1>
        <p class="text-base-content/60">View and manage your expenses</p>
      </div>
      <div class="flex gap-2">
        <button @click="handleExport" class="btn btn-ghost touch-target">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </button>
        <button @click="handleAddExpense" class="btn btn-primary touch-target">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Expense
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row gap-4 mb-6">
      <DateRangePicker />
      <select
        v-model="expenseStore.selectedCategoryId"
        class="select select-bordered touch-target"
      >
        <option :value="null">All Categories</option>
        <option
          v-for="cat in categories"
          :key="cat.id"
          :value="cat.id"
        >
          {{ cat.name }}
        </option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else-if="!expensesData?.data?.length"
      title="No expenses found"
      description="Add your first expense or adjust filters"
    >
      <template #action>
        <button @click="handleAddExpense" class="btn btn-primary mt-4 touch-target">
          Add Expense
        </button>
      </template>
    </EmptyState>

    <!-- Expense List -->
    <div v-else class="space-y-6">
      <div class="flex justify-between items-center text-sm text-base-content/60">
        <span>
          Showing {{ expensesData.data.length }} of {{ expensesData.total }} expenses
        </span>
      </div>

      <div class="space-y-3">
        <ExpenseListItem
          v-for="expense in expensesData.data"
          :key="expense.id"
          :expense="expense"
          @edit="handleEditExpense"
          @delete="handleDeleteExpense"
        />
      </div>

      <!-- Pagination -->
      <div class="flex justify-center gap-2">
        <button
          @click="page--"
          :disabled="!hasPrev"
          class="btn btn-ghost touch-target"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        <div class="flex items-center gap-1">
          <button
            v-for="p in totalPages"
            :key="p"
            @click="page = p"
            :class="[
              'btn touch-target',
              p === page ? 'btn-primary' : 'btn-ghost'
            ]"
          >
            {{ p }}
          </button>
        </div>
        <button
          @click="page++"
          :disabled="!hasNext"
          class="btn btn-ghost touch-target"
        >
          Next
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
