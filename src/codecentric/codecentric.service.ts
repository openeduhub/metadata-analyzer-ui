import { HttpService, Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { promisify } from 'util';
import * as codecentricApiSpec from '../assets/api/codecentric.openapi.json';
import { ExtractorTags, MetadataTags, OpenAPI } from '../generated';
import { Output as CodecentricExtractMetaOutput } from '../generated/models/Output';
import { EduSharingNode } from '../types/edu-sharing-node';
import { Marked } from '@ts-stack/markdown';

import {
    MarkdownHeadingsMap,
    MarkdownParserService,
} from '../utils/markdown-parser/markdown-parser.service';

const readFile = promisify(fs.readFile);

export type AnnotatedExtractorTags = {
    [key in keyof ExtractorTags]: AnnotatedMetadataTags;
};

export interface AnnotatedMetadataTags extends MetadataTags {
    title: string;
    description: string;
}

@Injectable()
export class CodecentricService implements OnModuleInit {
    private readonly url = 'http://141.5.100.13:5057';
    private markdownDocs!: MarkdownHeadingsMap;

    constructor(
        private readonly httpService: HttpService,
        private readonly markdownParserService: MarkdownParserService,
    ) {
        OpenAPI.BASE = this.url;
    }

    async onModuleInit(): Promise<void> {
        const markdownDocs = await this.readMarkdownDocs();
        // The output printed by this line is copy-pasted into the body template as info tooltips.
        //
        // console.log(Marked.parse(markdownDocs!.content));
        if (markdownDocs) {
            this.markdownDocs = markdownDocs;
        } else {
            throw new Error('Failed to read or parse Codecentric Markdown Docs');
        }
    }

    extractMeta(node: EduSharingNode): Observable<AnnotatedExtractorTags | null> {
        const contentUrl = node.properties['ccm:wwwurl']?.[0];
        if (contentUrl) {
            return this.fetchExtractMeta(contentUrl).pipe(
                map((output) => this.annotateExtractorTags(output.meta)),
            );
        } else {
            return of(null);
        }
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
            acc[key as keyof ExtractorTags] = this.annotateMetadataTags(
                key as keyof ExtractorTags,
                value,
            );
            return acc;
        }, {} as AnnotatedExtractorTags);
    }

    private annotateMetadataTags(
        key: keyof ExtractorTags,
        metadataTags?: MetadataTags,
    ): AnnotatedMetadataTags {
        const property =
            codecentricApiSpec.components.schemas.ExtractorTags.properties[
                key as keyof ExtractorTags
            ];
        const markdownDoc = this.findMarkdownDoc(property.title);
        if (markdownDoc?.heading) {
            return {
                ...metadataTags,
                title: markdownDoc.heading,
                description: Marked.parse(markdownDoc.content),
            };
        } else {
            return {
                ...metadataTags,
                title: property.title,
                description: property.description,
            };
        }
    }

    private async readMarkdownDocs() {
        // From https://github.com/codecentric/metadata_picker/blob/main/docs/acceptance.md
        const markdown = await readFile(
            __dirname + '/../assets/docs/codecentric/acceptance.md',
            'utf-8',
        );
        const headingsMap = this.markdownParserService.mapMarkdownHeadings(markdown, 3);
        return headingsMap.subHeadings
            ?.find(({ heading }) => heading === 'Akzeptanzkriterien')
            ?.subHeadings?.find(({ heading }) => heading === 'Merkmale');
    }

    private findMarkdownDoc(title: string): MarkdownHeadingsMap | undefined {
        title = title.toLowerCase().replaceAll(' ', '');
        return this.markdownDocs.subHeadings?.find(({ heading }) =>
            heading?.toLowerCase().endsWith(title),
        );
    }
}
