import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MarkdownParserService } from '../utils/markdown-parser/markdown-parser.service';
import { CodecentricService } from './codecentric.service';

describe('CodecentricService', () => {
    let service: CodecentricService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [HttpModule],
            providers: [CodecentricService, MarkdownParserService],
        }).compile();

        service = module.get<CodecentricService>(CodecentricService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
