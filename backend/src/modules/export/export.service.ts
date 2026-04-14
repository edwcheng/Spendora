import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExportService {
  constructor(private prisma: PrismaService) {}

  async exportToCsv(
    userId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<string> {
    // Build where clause
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else if (startDate) {
      where.date = { gte: new Date(startDate) };
    } else if (endDate) {
      where.date = { lte: new Date(endDate) };
    }

    // Get expenses
    const expenses = await this.prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: { name: true },
        },
      },
    });

    // Generate CSV
    const headers = ['Date', 'Amount (HKD)', 'Category', 'Note', 'Recurring'];
    const rows = expenses.map((expense) => [
      expense.date.toISOString().split('T')[0],
      expense.amount.toFixed(2),
      expense.category.name,
      this.escapeCsvField(expense.note || ''),
      expense.isRecurring ? 'Yes' : 'No',
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    return csv;
  }

  private escapeCsvField(field: string): string {
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }
}
