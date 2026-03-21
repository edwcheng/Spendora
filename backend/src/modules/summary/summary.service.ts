import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SummaryQueryDto, SummaryResponseDto } from './dto/summary.dto';

@Injectable()
export class SummaryService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string, query: SummaryQueryDto): Promise<SummaryResponseDto> {
    // Default to current month if no dates provided
    const now = new Date();
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const startDate = query.startDate ? new Date(query.startDate) : defaultStartDate;
    const endDate = query.endDate ? new Date(query.endDate) : defaultEndDate;

    // Get all expenses in date range
    const expenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    // Calculate totals
    const totalSpending = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalTransactions = expenses.length;

    // Calculate average per day
    const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const averagePerDay = totalSpending / daysDiff;

    // Get recurring total
    const recurringExpenses = await this.prisma.expense.findMany({
      where: {
        userId,
        isRecurring: true,
      },
    });
    const recurringTotal = recurringExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Group by category
    const categoryMap = new Map<string, {
      categoryId: string;
      categoryName: string;
      categoryColor: string | null;
      categoryIcon: string | null;
      total: number;
      count: number;
    }>();

    for (const expense of expenses) {
      const existing = categoryMap.get(expense.categoryId);
      if (existing) {
        existing.total += expense.amount;
        existing.count += 1;
      } else {
        categoryMap.set(expense.categoryId, {
          categoryId: expense.categoryId,
          categoryName: expense.category.name,
          categoryColor: expense.category.color,
          categoryIcon: expense.category.icon,
          total: expense.amount,
          count: 1,
        });
      }
    }

    const byCategory = Array.from(categoryMap.values())
      .map(c => ({
        ...c,
        percentage: totalSpending > 0 ? (c.total / totalSpending) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    // Get monthly trend (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyExpenses = await this.prisma.expense.findMany({
      where: {
        userId,
        date: {
          gte: twelveMonthsAgo,
        },
      },
    });

    const monthlyMap = new Map<string, { total: number; count: number }>();

    // Initialize all months
    for (let i = 0; i < 12; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, { total: 0, count: 0 });
    }

    for (const expense of monthlyExpenses) {
      const d = new Date(expense.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const existing = monthlyMap.get(key);
      if (existing) {
        existing.total += expense.amount;
        existing.count += 1;
      }
    }

    const monthlyTrend = Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        total: data.total,
        count: data.count,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return {
      totalSpending,
      totalTransactions,
      averagePerDay,
      recurringTotal,
      byCategory,
      monthlyTrend,
    };
  }
}
