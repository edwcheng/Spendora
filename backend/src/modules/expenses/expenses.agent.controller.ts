import {
  Controller,
  Post,
  Body,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { PrismaService } from '../../prisma/prisma.service';
import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, Min } from 'class-validator';

class AgentExpenseDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  categoryId: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsBoolean()
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
  @ApiResponse({ status: 404, description: 'User or category not found' })
  async createByAgent(@Body() dto: AgentExpenseDto) {
    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: dto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify category
    const category = await this.prisma.category.findFirst({
      where: {
        id: dto.categoryId,
        OR: [{ userId: dto.userId }, { userId: null }],
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
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
