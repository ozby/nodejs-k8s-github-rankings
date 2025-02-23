import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DailyRankingsModule } from './daily-rankings/daily_rankings.module';
import {MongooseModule} from "@nestjs/mongoose";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
  imports: [
      DailyRankingsModule,
      ConfigModule.forRoot(),
      MongooseModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
              uri:
                  'mongodb://' +
                  configService.get<string>('MONGODB_HOSTNAME') +
                  ':27017/',
              auth: {
                  username: configService.get<string>('MONGODB_USERNAME'),
                  password: configService.get<string>('MONGODB_PASSWORD'),
              },
              dbName: configService.get<string>('MONGODB_DBNAME'),
              authSource: configService.get<string>('MONGODB_DBNAME'),
          }),
          inject: [ConfigService],
      }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
