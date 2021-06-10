import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodecentricService } from './codecentric/codecentric.service';
import { AppConfigService } from './config/config.service';
import { MarkdownParserService } from './utils/markdown-parser/markdown-parser.service';
import { YovistoService } from './yovisto/yovisto.service';

@Module({
    imports: [
        HttpModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                timeout: configService.get('TIMEOUT'),
            }),
            inject: [ConfigService],
        }),
        ConfigModule.forRoot(),
    ],
    controllers: [AppController],
    providers: [
        YovistoService,
        AppService,
        CodecentricService,
        MarkdownParserService,
        AppConfigService,
    ],
})
export class AppModule {}
