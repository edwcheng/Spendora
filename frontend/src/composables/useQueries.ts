import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';
import { api } from '@/utils/api';
import { useExpenseStore } from '@/stores';
import type { Expense, Category, Summary, PaginatedResponse } from '@/types';
import { computed } from 'vue';

// Expense queries
import { unref } from 'vue';

export function useExpenses(page = 1, limit = 10) {
  const expenseStore = useExpenseStore();
  const dateRange = computed(() => expenseStore.getEffectiveDateRange());
  const selectedCategoryId = computed(() => expenseStore.selectedCategoryId);

  return useQuery<PaginatedResponse<Expense>>({
    queryKey: ['expenses', page, limit, dateRange, selectedCategoryId],
    queryFn: () =>
      api.getExpenses({
        page: unref(page),
        limit: unref(limit),
        startDate: dateRange.value.startDate,
        endDate: dateRange.value.endDate,
        categoryId: unref(expenseStore.selectedCategoryId) || undefined,
      }),
  });
}

export function useExpense(id: string) {
  return useQuery<Expense>({
    queryKey: ['expense', id],
    queryFn: () => api.getExpenses({}).then((res) => res.data.find((e) => e.id === id) as Expense),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createExpense.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof api.updateExpense>[1] }) =>
      api.updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteExpense.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });
}

// Category queries
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories.bind(api),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createCategory.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteCategory.bind(api),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// Summary queries
export function useSummary() {
  const expenseStore = useExpenseStore();
  const dateRange = computed(() => expenseStore.getEffectiveDateRange());

  return useQuery<Summary>({
    queryKey: ['summary', dateRange],
    queryFn: () =>
      api.getSummary({
        startDate: dateRange.value.startDate,
        endDate: dateRange.value.endDate,
      }),
  });
}
