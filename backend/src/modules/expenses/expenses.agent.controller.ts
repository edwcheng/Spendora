import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { PrismaService } from '../../prisma/prisma.service';

class AgentExpenseDto {
  userId: string;
  amount: number;
  categoryId: string;
  date: string;
  note?: string;
  isRecurring?: boolean;
}

@ApiTags('AI Agent')
@Controller('expenses/agent')
export class ExpensesAgentController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiOperation({ summary: 'Create expense via AI agent (protected)' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for AI agent access',
  })
  @ApiResponse({ status: 201, description: 'Expense created by agent' })
  @ApiResponse({ status: 401, description: 'Invalid API key' })
  async createByAgent(@Body() dto: AgentExpenseDto) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      return { error: 'User not found', code: 404 };
    }

    // Verify category
    const category = await this.prisma.category.findFirst({
      where: {
        id: dto.categoryId,
        OR: [{ userId: dto.userId }, { userId: null }],
      },
    });

    if (!category) {
      return { error: 'Category not found', code: 404 };
    }

    // Create expense
    const expense = await this.prisma.expense.create({
      data: {
        amount: dto.amount,
        note: dto.note,
        date: new Date(dto.date),
        isRecurring: dto.isRecurring ?? false,
        userId: dto.userId,
        categoryId: dto.categoryId,
      },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    return { success: true, expense };
  }
}
