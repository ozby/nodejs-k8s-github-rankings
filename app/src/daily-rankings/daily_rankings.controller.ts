import { Controller, Get, Query } from '@nestjs/common';
import { DailyRankingsService } from './daily_rankings.service';
import { DailyRankings } from './schemas/daily_rankings.schema';

@Controller('daily_rankings')
export class DailyRankingsController {
  constructor(private readonly dailyRankingsService: DailyRankingsService) {}

  @Get()
  async findAll(@Query() query?: any): Promise<DailyRankings[]> {
    const { date, limit, language } = query || {};
    if (date) {
      this.dailyRankingsService.useCollection(date);
    }
    return this.dailyRankingsService.findAll(limit, language);
  }
}
