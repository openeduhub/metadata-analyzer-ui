import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        try {
            return JSON.parse(value);
        } catch (error) {
            throw new BadRequestException(`Invalid JSON for parameter ${metadata.data}`);
        }
    }
}
