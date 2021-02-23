import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExtractorTags, MetadataTags, OpenAPI } from 'src/generated';
import { Output as CodecentricExtractMetaOutput } from 'src/generated/models/Output';
import { EduSharingNode } from 'src/types/edu-sharing-node';
import * as codecentricApiSpec from '../assets/api/codecentric.openapi.json';

export type AnnotatedExtractorTags = {
    [key in keyof ExtractorTags]: AnnotatedMetadataTags;
};

export interface AnnotatedMetadataTags extends MetadataTags {
    title: string;
    description: string;
}

@Injectable()
export class CodecentricService {
    private readonly url = 'http://141.5.100.13:5057';

    constructor(private readonly httpService: HttpService) {
        OpenAPI.BASE = this.url;
    }

    extractMeta(node: EduSharingNode): Observable<AnnotatedExtractorTags | null> {
        return this.fetchExtractMeta(node.content.url).pipe(
            map((output) => this.annotateExtractorTags(output.meta)),
        );
    }

    private fetchExtractMeta(url: string): Observable<CodecentricExtractMetaOutput> {
        return this.httpService
            .post<CodecentricExtractMetaOutput>(this.url + '/extract_meta', { url })
            .pipe(map((response) => response.data));
    }

    private annotateExtractorTags(extractorTags?: ExtractorTags): AnnotatedExtractorTags | null {
        if (!extractorTags) {
            return null;
        }
        return Object.entries(extractorTags).reduce((acc, [key, value]) => {
            const property =
                codecentricApiSpec.components.schemas.ExtractorTags.properties[
                    key as keyof ExtractorTags
                ];
            acc[key as keyof ExtractorTags] = {
                ...value,
                title: property.title,
                description: property.description,
            };
            return acc;
        }, {} as AnnotatedExtractorTags);
    }
}
