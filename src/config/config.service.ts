import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
    constructor(private readonly nestConfigService: NestConfigService) {}

    get<T>(key: string): T {
        const value = this.nestConfigService.get<T>(key);
        if (value === undefined) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        return value;
    }
}
