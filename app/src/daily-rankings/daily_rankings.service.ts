import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  createCollectionModel,
  DailyRankings,
} from './schemas/daily_rankings.schema';

@Injectable()
export class DailyRankingsService {
  private model: Model<DailyRankings>;
  private lastDate: Date;

  constructor(
    @InjectModel(DailyRankings.name)
    private dailyRankingsModel: Model<DailyRankings>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}
  // constructor(@InjectConnection() private readonly connection: Connection) {}

  useCollection(date: Date) {
    if (this.lastDate === date) {
      return this.model;
    }
    this.lastDate = date;
    this.model = createCollectionModel(this.connection, date);
  }
  /**
   * Find all daily rankings.
   *
   * @param {number} limit - The maximum number of rankings to return. Default is 0, which returns all rankings.
   * @param {string} language - The language used for the rankings. If specified, only rankings for that language will be returned.
   * @return {Promise<DailyRankings[]>} - A promise that resolves to an array of DailyRankings objects representing the found rankings.
   */
  async findAll(limit = 0, language?: string): Promise<DailyRankings[]> {
    const model = (this.model ?? this.dailyRankingsModel).find(
      language ? { language } : {},
    );
    return (limit > 0 ? model.limit(limit) : model).exec();
  }
}
