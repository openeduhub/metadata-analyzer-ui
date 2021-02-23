import { Test, TestingModule } from '@nestjs/testing';
import { CodecentricService } from './codecentric.service';

describe('CodecentricService', () => {
    let service: CodecentricService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CodecentricService],
        }).compile();

        service = module.get<CodecentricService>(CodecentricService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
