import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { MarkdownParserService } from './markdown-parser.service';
import { promisify } from 'util';
const readFile = promisify(fs.readFile);

describe('MarkdownParserService', () => {
    let service: MarkdownParserService;
    let markdown: string;

    beforeAll(async () => {
        markdown = await readFile(
            __dirname + '/../../assets/docs/codecentric/acceptance.md',
            'utf-8',
        );
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [MarkdownParserService],
        }).compile();

        service = module.get<MarkdownParserService>(MarkdownParserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should map headings', () => {
        const headingsMap = service.mapMarkdownHeadings(markdown, 3);
        expect(headingsMap.subHeadings).toBeDefined();
        expect(headingsMap.subHeadings?.length).toBe(1);
        expect(headingsMap.subHeadings?.[0].heading).toBe('Akzeptanzkriterien');
        expect(headingsMap.subHeadings?.[0].subHeadings).toBeDefined();
        expect(headingsMap.subHeadings?.[0].subHeadings?.length).toBe(2);
        expect(headingsMap.subHeadings?.[0].subHeadings?.[0].heading).toBe('Merkmale');
        expect(headingsMap.subHeadings?.[0].subHeadings?.[1].heading).toBe('Allgemeine TODOs');
        expect(headingsMap.subHeadings?.[0].subHeadings?.[0].subHeadings).toBeDefined();
        const featureHeadings = headingsMap.subHeadings?.[0].subHeadings?.[0].subHeadings?.map(
            (entry) => entry.heading,
        );
        expect(featureHeadings).toEqual([
            'Barrierefreiheit alias Accessibility',
            'Cookies',
            'Dateiextrahierbarkeit alias ExtractFromFiles',
            'DSGVO alias GDPR',
            'Javascript',
            'Gefährliche Dateierweiterungen alias MaliciousExtensions',
            'Metabeschreibungsentdecker alias MetatagExplorer',
            'Sicherheit alias Security',
            'Werbung alias Advertisement',
            'Privatsphäre alias EasyPrivacy',
            'Cookies in Html alias CookiesInHtml',
            'FanboyAnnoyance',
            'Benachrichtigungen alias FanboyNotification',
            'Soziale Netzwerke alias FanboySocialMedia',
            'Anti-Werbeblocker alias AntiAdBlock',
            'spezifisch deutsche Merkmale alias EasylistGermany',
            'FSK18 alias EasylistAdult',
            'Bezahlbarrieren alias Paywalls',
            'Webseite einbettbar alias IFrameEmbeddable',
            'PopUp',
            'Registrierbarriere alias RegWall',
            'LogInOut',
            'Weitere Merkmale',
        ]);
        expect(
            headingsMap.subHeadings?.[0].subHeadings?.[0].subHeadings?.[0].subHeadings,
        ).toBeUndefined();
    });

    it('should deal with umlauts', () => {
        expect(service.getHeadingRegex(3).test('### Privatsphäre alias EasyPrivacy')).toBe(true);
    });

    it('should deal with dashes', () => {
        expect(service.getHeadingRegex(3).test('### Anti-Werbeblocker alias AntiAdBlock')).toBe(
            true,
        );
    });
});
