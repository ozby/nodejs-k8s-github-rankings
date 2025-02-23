import {Test, TestingModule} from '@nestjs/testing';
import {DailyRankingsController} from './daily_rankings.controller';
import {DailyRankingsService} from './daily_rankings.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('DailyRankingsService', () => {
    let service: DailyRankingsService;
    let controller: DailyRankingsController;
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
        jest.clearAllMocks();
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DailyRankingsController],
            providers: [
                {
                    provide: DailyRankingsService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([
                            {
                                rank: 0,
                                item: '',
                                repo_name: '',
                                stars: 0,
                                forks: 0,
                                language: '',
                                repo_url: '',
                                username: 'user #1 mock list',
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
                                username: 'user #2 mock list',
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
                                username: 'user #3 mock list',
                                issues: 0,
                                last_commit: '',
                                description: '',
                            },
                        ]),
                    },
                },
            ],
        }).compile();

        controller = module.get<DailyRankingsController>(DailyRankingsController);
        service = module.get<DailyRankingsService>(DailyRankingsService);
    });

    describe('findAll()', () => {
        it('should return an array of daily_rankings', async () => {
            expect(controller.findAll()).resolves.toEqual([
                {
                    rank: 0,
                    item: '',
                    repo_name: '',
                    stars: 0,
                    forks: 0,
                    language: '',
                    repo_url: '',
                    username: 'user #1 mock list',
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
                    username: 'user #2 mock list',
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
                    username: 'user #3 mock list',
                    issues: 0,
                    last_commit: '',
                    description: '',
                },
            ]);
            expect(service.findAll).toHaveBeenCalled();
        });
    });
})