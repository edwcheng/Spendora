import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseQueryDto,
} from './dto/expense.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    // Verify category belongs to user or is default
    const category = await this.prisma.category.findFirst({
      where: {
        id: dto.categoryId,
        OR: [{ userId }, { userId: null }],
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.expense.create({
      data: {
        amount: dto.amount,
        note: dto.note,
        date: new Date(dto.date),
        isRecurring: dto.isRecurring ?? false,
        userId,
        categoryId: dto.categoryId,
      },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });
  }

  async findAll(
    userId: string,
    query: ExpenseQueryDto,
  ) {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    // Build where clause using typed Prisma input
    const where: Prisma.ExpenseWhereInput = { userId };

    if (query.startDate && query.endDate) {
      where.date = {
        gte: new Date(query.startDate),
        lte: new Date(query.endDate),
      };
    } else if (query.startDate) {
      where.date = { gte: new Date(query.startDate) };
    } else if (query.endDate) {
      where.date = { lte: new Date(query.endDate) };
    }

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.isRecurring !== undefined) {
      where.isRecurring = query.isRecurring;
    }

    // Get total count
    const total = await this.prisma.expense.count({ where });

    // Get expenses
    const expenses = await this.prisma.expense.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: expenses,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
    };
  }

  async findOne(userId: string, id: string) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return expense;
  }

  async update(userId: string, id: string, dto: UpdateExpenseDto) {
    // Verify ownership
    await this.findOne(userId, id);

    // Verify category if provided
    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: dto.categoryId,
          OR: [{ userId }, { userId: null }],
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.expense.update({
      where: { id },
      data: {
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.note !== undefined && { note: dto.note }),
        ...(dto.isRecurring !== undefined && { isRecurring: dto.isRecurring }),
      },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });
  }

  async remove(userId: string, id: string) {
    // Verify ownership
    await this.findOne(userId, id);

    await this.prisma.expense.delete({
      where: { id },
    });

    return { message: 'Expense deleted successfully' };
  }

  async getRecurringTotal(userId: string): Promise<number> {
    const result = await this.prisma.expense.aggregate({
      where: {
        userId,
        isRecurring: true,
      },
      _sum: {
        amount: true,
      },
    });

    return result._sum.amount || 0;
  }
}
