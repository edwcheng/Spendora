// User types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar?: string | null;
}

// Category types
export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isDefault: boolean;
}

// Expense types
export interface Expense {
  id: string;
  amount: number;
  note: string | null;
  date: Date | string;
  isRecurring: boolean;
  categoryId: string;
  category: {
    id: string;
    name: string;
    icon: string | null;
    color: string | null;
  };
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
}

// Summary types
export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  categoryIcon: string | null;
  total: number;
  count: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  total: number;
  count: number;
}

export interface Summary {
  totalSpending: number;
  totalTransactions: number;
  averagePerDay: number;
  recurringTotal: number;
  byCategory: CategorySummary[];
  monthlyTrend: MonthlyTrend[];
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// API Response types
export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

// Date range presets
export type DateRangePreset = 'this_month' | 'last_3_months' | 'last_6_months' | 'last_12_months' | 'custom';

export interface DateRange {
  startDate: string;
  endDate: string;
}
