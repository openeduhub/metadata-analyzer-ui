import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { YovistoService } from './yovisto/yovisto.service';
import { AppService } from './app.service';

@Module({
    imports: [HttpModule],
    controllers: [AppController],
    providers: [YovistoService, AppService],
})
export class AppModule {}
