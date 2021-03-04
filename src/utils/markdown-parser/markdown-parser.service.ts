import { Injectable } from '@nestjs/common';

export interface MarkdownHeadingsMap {
    heading?: string;
    content: string;
    subHeadings?: MarkdownHeadingsMap[];
}

@Injectable()
export class MarkdownParserService {
    /**
     * Parse a Markdown-formatted string to a headings map.
     *
     * Requirements:
     *  - All headings are '#'-style.
     *  - Heading levels are not be increased by more than one at a time.
     *
     * @param maxLevel Maximum heading level to parse. Headings beyond the given level are added to
     * `content`.
     */
    mapMarkdownHeadings(markdown: string, maxLevel: number): MarkdownHeadingsMap {
        return this._mapMarkdownHeadings(markdown, maxLevel, 1);
    }

    private _mapMarkdownHeadings(
        markdown: string,
        maxLevel: number,
        level: number,
    ): MarkdownHeadingsMap {
        const { rootContent, headings } = this.separateSections(markdown, level);
        if (level < maxLevel) {
            return {
                content: rootContent,
                subHeadings: headings.map(({ heading, content }) => ({
                    heading,
                    ...this._mapMarkdownHeadings(content, maxLevel, level + 1),
                })),
            };
        } else {
            return {
                content: rootContent,
                subHeadings: headings,
            };
        }
    }

    /**
     * Split the given input at headings of the given level.
     *
     * Headings of other levels are ignored. For meaningful output, make sure the input text does
     * not contain headings of higher level.
     *
     * @param markdown Markdown-formatted input text
     * @param level subheading level to examine
     */
    private separateSections(markdown: string, level: number) {
        const headings: {
            heading: string;
            contentStartIndex: number;
            contentEndIndex?: number;
        }[] = [];
        const matches = markdown.matchAll(this.getHeadingRegex(level));
        let firstIndex: number | undefined = undefined;
        for (const match of matches) {
            if (typeof match.index !== 'number') {
                continue;
            }
            if (firstIndex === undefined) {
                firstIndex = match.index;
            }
            if (headings.length > 0) {
                headings[headings.length - 1].contentEndIndex = match.index;
            }
            headings.push({
                heading: match[1].trim(),
                contentStartIndex: match.index + match[0].length,
            });
        }

        return {
            rootContent: markdown.substring(0, firstIndex).trim(),
            headings: headings.map(({ heading, contentStartIndex, contentEndIndex }) => ({
                heading,
                content: markdown.substring(contentStartIndex, contentEndIndex).trim(),
            })),
        };
    }

    /** @internal */
    getHeadingRegex(level: number): RegExp {
        return new RegExp('^' + '#'.repeat(level) + '\\s+(.+)$', 'gm');
    }
}
