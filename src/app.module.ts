import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { YovistoService } from './yovisto/yovisto.service';
import { AppService } from './app.service';
import { CodecentricService } from './codecentric/codecentric.service';

@Module({
    imports: [HttpModule],
    controllers: [AppController],
    providers: [YovistoService, AppService, CodecentricService],
})
export class AppModule {}
