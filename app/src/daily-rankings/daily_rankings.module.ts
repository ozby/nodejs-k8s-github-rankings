import { Module } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { DailyRankingsController } from './daily_rankings.controller';
import { DailyRankingsService } from './daily_rankings.service';
import {
  DailyRankings,
  DailyRankingsSchemaGetter,
} from './schemas/daily_rankings.schema';
@Module({
  controllers: [DailyRankingsController],
  providers: [
    DailyRankingsService,
    {
      provide: getModelToken(DailyRankings.name),
      useFactory: DailyRankingsSchemaGetter,
    },
  ],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: DailyRankings.name,
        useFactory: async () => {
          const today = new Date();
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return DailyRankingsSchemaGetter(yesterday);
        },
      },
    ]),
  ],
})
export class DailyRankingsModule {}
