import type { User, AuthResponse, LoginCredentials, RegisterCredentials, Expense, Category, PaginatedResponse, Summary } from '@/types';

const API_BASE = '/api';

class ApiClient {
  private getAuthToken(): string | null {
    return localStorage.getItem('spendora_token');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('spendora_token', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('spendora_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken();

    const headers: HeadersInit = {
      ...options.headers,
    };

    // Only set Content-Type for requests with a body
    if (options.body) {
      (headers as Record<string, string>)['Content-Type'] = 'application/json';
    }

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    // Check content-type before attempting to parse
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      // Handle non-JSON error responses
      if (!contentType?.includes('application/json')) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    // Handle blob responses (e.g., CSV export)
    if (contentType?.includes('text/csv') || contentType?.includes('application/octet-stream')) {
      return response.blob() as unknown as T;
    }

    // Handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : (null as unknown as T);
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setAuthToken(response.accessToken);
    return response;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    this.setAuthToken(response.accessToken);
    return response;
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  logout(): void {
    this.removeAuthToken();
  }

  // Expense endpoints
  async getExpenses(params: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    categoryId?: string;
    isRecurring?: boolean;
  } = {}): Promise<PaginatedResponse<Expense>> {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set('page', params.page.toString());
    if (params.limit) searchParams.set('limit', params.limit.toString());
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);
    if (params.categoryId) searchParams.set('categoryId', params.categoryId);
    if (params.isRecurring !== undefined) searchParams.set('isRecurring', params.isRecurring.toString());

    return this.request<PaginatedResponse<Expense>>(`/expenses?${searchParams.toString()}`);
  }

  async createExpense(data: {
    amount: number;
    categoryId: string;
    date: string;
    note?: string;
    isRecurring?: boolean;
  }): Promise<Expense> {
    return this.request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateExpense(id: string, data: Partial<{
    amount: number;
    categoryId: string;
    date: string;
    note: string;
    isRecurring: boolean;
  }>): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteExpense(id: string): Promise<void> {
    await this.request(`/expenses/${id}`, { method: 'DELETE' });
  }

  async getExpense(id: string): Promise<Expense> {
    return this.request<Expense>(`/expenses/${id}`);
  }

  // Category endpoints
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async createCategory(data: { name: string; icon?: string; color?: string }): Promise<Category> {
    return this.request<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  // Summary endpoints
  async getSummary(params: { startDate?: string; endDate?: string } = {}): Promise<Summary> {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);

    return this.request<Summary>(`/summary?${searchParams.toString()}`);
  }

  // Export endpoints - use blob download instead of URL with token
  async exportCsv(params: { startDate?: string; endDate?: string } = {}): Promise<void> {
    const searchParams = new URLSearchParams();
    if (params.startDate) searchParams.set('startDate', params.startDate);
    if (params.endDate) searchParams.set('endDate', params.endDate);

    const response = await this.request<Blob>(`/export/csv?${searchParams.toString()}`, {
      headers: {
        'Accept': 'text/csv',
      },
    });

    // Handle non-blob responses (error responses are JSON)
    if (!(response instanceof Blob)) {
      throw new Error('Failed to generate CSV export');
    }

    const url = URL.createObjectURL(response);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spendora-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const api = new ApiClient();
