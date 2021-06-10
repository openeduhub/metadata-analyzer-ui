import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AppConfigService } from '../config/config.service';
import { YovistoService } from './yovisto.service';

describe('YovistoService', () => {
    let service: YovistoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [YovistoService, AppConfigService],
            imports: [AppModule, HttpModule, ConfigModule],
        }).compile();

        service = module.get<YovistoService>(YovistoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
