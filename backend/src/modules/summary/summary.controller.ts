import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SummaryService } from './summary.service';
import { SummaryQueryDto, SummaryResponseDto } from './dto/summary.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Summary')
@ApiBearerAuth()
@Controller('summary')
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get()
  @ApiOperation({ summary: 'Get spending summary' })
  @ApiResponse({ status: 200, description: 'Spending summary', type: SummaryResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getSummary(
    @CurrentUser('sub') userId: string,
    @Query() query: SummaryQueryDto,
  ): Promise<SummaryResponseDto> {
    return this.summaryService.getSummary(userId, query);
  }
}
