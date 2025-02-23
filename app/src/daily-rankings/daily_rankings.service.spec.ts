import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Connection } from 'mongoose';
import { DailyRankingsService } from './daily_rankings.service';
import { DailyRankings } from './schemas/daily_rankings.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

const mockDailyRankings = {
  rank: 0,
  item: '',
  repo_name: '',
  stars: 0,
  forks: 0,
  language: '',
  repo_url: '',
  username: 'mock daily rankings user',
  issues: 0,
  last_commit: '',
  description: '',
};

describe('DailyRankingsService', () => {
  let service: DailyRankingsService;
  let model: Model<DailyRankings>;
  let mongoServer: MongoMemoryServer;
  let connection: Connection;

  const dailyRankingsArray = [
    {
      rank: 0,
      item: '',
      repo_name: '',
      stars: 0,
      forks: 0,
      language: '',
      repo_url: '',
      username: 'User #1',
      issues: 0,
      last_commit: '',
      description: '',
    },
    {
      rank: 0,
      item: '',
      repo_name: '',
      stars: 0,
      forks: 0,
      language: '',
      repo_url: '',
      username: 'User #2',
      issues: 0,
      last_commit: '',
      description: '',
    },
  ];

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    connection = mongoose.connection;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DailyRankingsService,
        {
          provide: getModelToken('DailyRankings'),
          useValue: {
            constructor: jest.fn().mockResolvedValue(mockDailyRankings),
            find: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getConnectionToken(),
          useValue: connection,
        },
      ],
    }).compile();

    service = module.get<DailyRankingsService>(DailyRankingsService);
    model = module.get<Model<DailyRankings>>(getModelToken('DailyRankings'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all dailyRankings', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(dailyRankingsArray),
    } as any);
    const dailyRankings = await service.findAll();
    expect(dailyRankings).toEqual(dailyRankingsArray);
  });
});
