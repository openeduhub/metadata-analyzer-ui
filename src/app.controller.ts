import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ParseJsonPipe } from './parse-json.pipe';
import { EduSharingNode } from './types/edu-sharing-node';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    async getRoot(@Query('node', new ParseJsonPipe()) node: EduSharingNode) {
        return this.appService.getRoot(node);
    }
}
