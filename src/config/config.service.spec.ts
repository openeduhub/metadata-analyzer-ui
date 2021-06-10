import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './config.service';

describe('ConfigService', () => {
    let service: AppConfigService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule],
            providers: [AppConfigService],
        }).compile();

        service = module.get<AppConfigService>(AppConfigService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
