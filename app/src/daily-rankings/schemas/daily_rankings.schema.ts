import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as moment from 'moment';

import { Connection, Model } from 'mongoose';
export const createCollectionModel = (
  connection: Connection,
  date: Date,
): Model<any> => {
  return connection.model(
    'github-ranking-' + moment(date).format('YYYY-MM-DD'),
    DailyRankingsSchemaGetter(date),
    'github-ranking-' + moment(date).format('YYYY-MM-DD'),
  );
};

export const DailyRankingsSchemaGetter = (day: Date) =>
  SchemaFactory.createForClass(DailyRankings).set(
    'collection',
    'github-ranking-' + moment(day).format('YYYY-MM-DD'),
  );

@Schema()
export class DailyRankings {
  @Prop()
  rank: number;

  @Prop()
  item: string;

  @Prop()
  repo_name: string;

  @Prop()
  stars: number;

  @Prop()
  forks: number;

  @Prop()
  language: string;

  @Prop()
  repo_url: string;

  @Prop()
  username: string;

  @Prop()
  issues: number;

  @Prop()
  last_commit: string;

  @Prop()
  description: string;
}
