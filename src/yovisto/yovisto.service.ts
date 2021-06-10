import { HttpService, Injectable } from '@nestjs/common';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, defaultIfEmpty, map, switchMap } from 'rxjs/operators';
import { EduSharingNode } from '../types/edu-sharing-node';
import { SkosEntry } from '../types/skos-entry';
import {
    AnalyzeData,
    DisciplinePrediction,
    PredictionResult,
    RecommendResult,
} from '../types/yovisto';
import { AppConfigService } from '../config/config.service';

@Injectable()
export class YovistoService {
    private readonly EDU_SHARING_URL = this.configService.get<string>('EDU_SHARING_URL');

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: AppConfigService,
    ) {}

    analyze(node: EduSharingNode): Observable<{ data: AnalyzeData; disciplines: string[] }> {
        return this.fetchAnalyze(node).pipe(
            switchMap((data) =>
                forkJoin(
                    data.disciplines.map((disciplineUrl) =>
                        this.fetchDisciplineLabel(disciplineUrl),
                    ),
                ).pipe(
                    defaultIfEmpty<string[]>([]),
                    map((disciplines) => ({
                        data,
                        disciplines,
                    })),
                ),
            ),
        );
    }

    predictDisciplines(node: EduSharingNode): Observable<DisciplinePrediction[]> {
        return this.fetchPredictSubjects(node).pipe(
            switchMap((data) =>
                forkJoin(
                    data.map((subjectPrediction) =>
                        this.fetchDisciplineLabel(
                            'https://vocabs.openeduhub.de/w3id.org/openeduhub/vocabs/discipline/' +
                                subjectPrediction[0],
                        ).pipe(
                            map((label) => ({
                                label,
                                precision: subjectPrediction[1],
                            })),
                        ),
                    ),
                ).pipe(defaultIfEmpty<{ label: string; precision: number }[]>([])),
            ),
        );
    }

    recommend(node: EduSharingNode): Observable<RecommendResult[]> {
        return this.fetchRecommend(node).pipe(
            switchMap((results) =>
                forkJoin(
                    results.map((result) =>
                        this.fetchEduSharingNodeMetadata(result[0]).pipe(
                            map((node) => ({
                                label: node.title,
                                url: this.EDU_SHARING_URL + '/components/render/' + result[0],
                                similarity: result[1],
                            })),
                            catchError(() => of(null)),
                        ),
                    ),
                ).pipe(
                    defaultIfEmpty<({ label: string; url: string; similarity: number } | null)[]>(
                        [],
                    ),
                    map((results) =>
                        results.filter((result): result is RecommendResult => result !== null),
                    ),
                ),
            ),
        );
    }

    private fetchAnalyze(node: EduSharingNode): Observable<AnalyzeData> {
        const data = {
            _source: {
                properties: node.properties,
            },
        };
        return this.httpService
            .post<AnalyzeData>(this.configService.get<string>('YOVISTO_ANALYZE_URL'), data)
            .pipe(map((response) => response.data));
    }

    private fetchPredictSubjects(node: EduSharingNode): Observable<PredictionResult[]> {
        const text = [
            ...(node.properties['cclom:title'] ?? []),
            ...(node.properties['cclom:general_description'] ?? []),
        ].join(' ');
        const data = { text };
        return this.httpService
            .post(this.configService.get<string>('YOVISTO_PREDICT_SUBJECTS_URL'), data)
            .pipe(map((response) => JSON.parse(response.data)));
    }

    private fetchRecommend(node: EduSharingNode): Observable<PredictionResult[]> {
        const data = { doc: node.ref.id };
        return this.httpService
            .post(this.configService.get<string>('YOVISTO_RECOMMEND_URL'), data)
            .pipe(map((response) => JSON.parse(response.data)));
    }

    private fetchDisciplineLabel(disciplineUrl: string): Observable<string> {
        return this.httpService
            .get<SkosEntry>(`${disciplineUrl}.json`)
            .pipe(map((result) => result.data.prefLabel.de));
    }

    private fetchEduSharingNodeMetadata(nodeId: string): Observable<EduSharingNode> {
        const metadataUrl =
            this.EDU_SHARING_URL + '/rest/node/v1/nodes/-home-/' + nodeId + '/metadata';
        return this.httpService
            .get<{ node: EduSharingNode }>(metadataUrl)
            .pipe(map((result) => result.data.node));
    }
}
