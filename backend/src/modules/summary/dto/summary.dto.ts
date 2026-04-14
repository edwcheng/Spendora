import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class SummaryQueryDto {
  @ApiPropertyOptional({ example: '2024-03-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2024-03-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}

export class CategorySummaryDto {
  @ApiProperty()
  categoryId: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  categoryColor: string | null;

  @ApiProperty()
  categoryIcon: string | null;

  @ApiProperty()
  total: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}

export class MonthlyTrendDto {
  @ApiProperty()
  month: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  count: number;
}

export class SummaryResponseDto {
  @ApiProperty()
  totalSpending: number;

  @ApiProperty()
  totalTransactions: number;

  @ApiProperty()
  averagePerDay: number;

  @ApiProperty()
  recurringTotal: number;

  @ApiProperty({ type: [CategorySummaryDto] })
  byCategory: CategorySummaryDto[];

  @ApiProperty({ type: [MonthlyTrendDto] })
  monthlyTrend: MonthlyTrendDto[];
}
