<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useCategories, useCreateExpense, useUpdateExpense } from '@/composables/useQueries';
import { formatCurrency, formatDateForInput } from '@/utils/format';
import type { Expense, Category } from '@/types';

const props = defineProps<{
  expense?: Expense | null;
}>();

const emit = defineEmits<{
  close: [];
  saved: [];
}>();

const { data: categories } = useCategories();
const createMutation = useCreateExpense();
const updateMutation = useUpdateExpense();

const isEditing = computed(() => !!props.expense);

const form = ref({
  amount: props.expense?.amount || 0,
  categoryId: props.expense?.categoryId || '',
  date: props.expense ? formatDateForInput(props.expense.date) : formatDateForInput(new Date()),
  note: props.expense?.note || '',
  isRecurring: props.expense?.isRecurring || false,
});

// Watch for prop changes (e.g., when switching between expenses to edit)
watch(
  () => props.expense,
  (newExpense) => {
    if (newExpense) {
      form.value = {
        amount: newExpense.amount,
        categoryId: newExpense.categoryId,
        date: formatDateForInput(newExpense.date),
        note: newExpense.note || '',
        isRecurring: newExpense.isRecurring || false,
      };
    } else {
      form.value = {
        amount: 0,
        categoryId: '',
        date: formatDateForInput(new Date()),
        note: '',
        isRecurring: false,
      };
    }
  },
);

const loading = computed(() => createMutation.isPending.value || updateMutation.isPending.value);

const errorMessage = ref<string | null>(null);

const selectedCategory = computed(() =>
  categories.value?.find((c: Category) => c.id === form.value.categoryId)
);

async function handleSubmit() {
  const data = {
    amount: Number(form.value.amount),
    categoryId: form.value.categoryId,
    date: new Date(form.value.date).toISOString(),
    note: form.value.note || undefined,
    isRecurring: form.value.isRecurring,
  };

  errorMessage.value = null;

  try {
    if (isEditing.value && props.expense) {
      await updateMutation.mutateAsync({ id: props.expense.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }

    emit('saved');
    emit('close');
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Failed to save expense. Please try again.';
    errorMessage.value = msg;
  }
}

function formatAmount() {
  // Round to 2 decimal places
  form.value.amount = Math.round(form.value.amount * 100) / 100;
}
</script>

<template>
  <dialog class="modal modal-open">
    <div class="modal-box max-w-md">
      <h3 class="font-bold text-lg mb-4">
        {{ isEditing ? 'Edit Expense' : 'Add Expense' }}
      </h3>

      <!-- Error alert -->
      <div v-if="errorMessage" class="alert alert-error mb-4 text-sm">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Amount -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Amount (HKD)</span>
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60">$</span>
            <input
              type="number"
              v-model.number="form.amount"
              @blur="formatAmount"
              step="0.01"
              min="0.01"
              required
              class="input input-bordered w-full pl-8 touch-target"
              placeholder="0.00"
            />
          </div>
          <label class="label" v-if="form.amount > 0">
            <span class="label-text-alt text-primary">{{ formatCurrency(form.amount) }}</span>
          </label>
        </div>

        <!-- Category -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Category</span>
          </label>
          <select
            v-model="form.categoryId"
            required
            class="select select-bordered w-full touch-target"
          >
            <option value="" disabled>Select a category</option>
            <optgroup label="Default">
              <option
                v-for="cat in categories?.filter((c: Category) => c.isDefault)"
                :key="cat.id"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </optgroup>
            <optgroup label="Custom" v-if="categories?.some((c: Category) => !c.isDefault)">
              <option
                v-for="cat in categories?.filter((c: Category) => !c.isDefault)"
                :key="cat.id"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </optgroup>
          </select>
          <div v-if="selectedCategory" class="flex items-center gap-2 mt-2">
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: selectedCategory.color || '#10b981' }"
            />
            <span class="text-sm text-base-content/60">{{ selectedCategory.name }}</span>
          </div>
        </div>

        <!-- Date -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Date</span>
          </label>
          <input
            type="date"
            v-model="form.date"
            required
            class="input input-bordered w-full touch-target"
          />
        </div>

        <!-- Note -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-medium">Note (optional)</span>
          </label>
          <textarea
            v-model="form.note"
            class="textarea textarea-bordered touch-target"
            placeholder="Add a note..."
            rows="2"
          />
        </div>

        <!-- Recurring -->
        <div class="form-control">
          <label class="label cursor-pointer justify-start gap-3">
            <input
              type="checkbox"
              v-model="form.isRecurring"
              class="checkbox checkbox-primary"
            />
            <div>
              <span class="label-text font-medium">Monthly recurring</span>
              <p class="text-xs text-base-content/60">This expense repeats every month</p>
            </div>
          </label>
        </div>

        <!-- Actions -->
        <div class="modal-action">
          <button
            type="button"
            @click="emit('close')"
            class="btn btn-ghost touch-target"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn btn-primary touch-target"
            :disabled="loading || !form.amount || !form.categoryId"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm" />
            {{ isEditing ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="emit('close')">close</button>
    </form>
  </dialog>
</template>
