import { HttpModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { AppConfigService } from '../config/config.service';
import { MarkdownParserService } from '../utils/markdown-parser/markdown-parser.service';
import { CodecentricService } from './codecentric.service';

describe('CodecentricService', () => {
    let service: CodecentricService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule, HttpModule, ConfigModule],
            providers: [CodecentricService, MarkdownParserService, AppConfigService],
        }).compile();

        service = module.get<CodecentricService>(CodecentricService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
