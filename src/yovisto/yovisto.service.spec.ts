import { Test, TestingModule } from '@nestjs/testing';
import { YovistoService } from './yovisto.service';

describe('YovistoService', () => {
    let service: YovistoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [YovistoService],
        }).compile();

        service = module.get<YovistoService>(YovistoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
