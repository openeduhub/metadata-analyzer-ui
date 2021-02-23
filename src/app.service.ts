import { Injectable } from '@nestjs/common';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TwingEnvironment, TwingLoaderFilesystem } from 'twing';
import { EduSharingNode } from './types/edu-sharing-node';
import { YovistoService } from './yovisto/yovisto.service';

@Injectable()
export class AppService {
    private readonly loader = new TwingLoaderFilesystem(__dirname + '/assets/templates');
    private readonly twing = new TwingEnvironment(this.loader);

    constructor(private readonly yovistoService: YovistoService) {}

    getRoot(node: EduSharingNode) {
        return forkJoin({
            analyze: this.yovistoService.analyze(node),
            predictDisciplines: this.yovistoService.predictDisciplines(node),
            recommend: this.yovistoService.recommend(node),
        }).pipe(
            map((yovistoResults) => ({
                title: node.properties['cclom:title']?.[0] ?? node.properties['cm:name']?.[0],
                language: yovistoResults.analyze.data.language,
                disciplinesAnalyze: yovistoResults.analyze.disciplines,
                disciplinesPredict: yovistoResults.predictDisciplines,
                recommend: yovistoResults.recommend,
                categories: yovistoResults.analyze.data.essentialCategories,
            })),
            switchMap((templateData) => this.twing.render('template.twig', templateData)),
        );
    }
}
