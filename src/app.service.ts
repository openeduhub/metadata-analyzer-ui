import { HttpService, Injectable } from '@nestjs/common';
import { renderToString } from '@vue/server-renderer';
import { readFileSync } from 'fs';
import { forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { createSSRApp } from 'vue';
import { CodecentricService } from './codecentric/codecentric.service';
import { EduSharingNode } from './types/edu-sharing-node';
import { YovistoService } from './yovisto/yovisto.service';

const pageTemplate = readFileSync(__dirname + '/assets/templates/index.template.html', 'utf-8');
const bodyTemplate = readFileSync(__dirname + '/assets/templates/body.template.html', 'utf-8');

@Injectable()
export class AppService {
    constructor(
        private readonly yovistoService: YovistoService,
        private readonly codecentricService: CodecentricService,
        httpService: HttpService,
    ) {
        httpService.axiosRef.interceptors.response.use(undefined, (error) => {
            console.log(error.toString(), '\nconfig:', error.config);
            return Promise.reject(error);
        });
    }

    async getRoot(node: EduSharingNode) {
        return forkJoin({
            analyze: this.yovistoService.analyze(node),
            predictDisciplines: this.yovistoService.predictDisciplines(node),
            recommend: this.yovistoService.recommend(node),
            extractMeta: this.codecentricService.extractMeta(node),
        }).pipe(
            map((results) => ({
                title: node.properties['cclom:title']?.[0] ?? node.properties['cm:name']?.[0],
                language: results.analyze.map((analyze) => analyze.data.language),
                disciplinesAnalyze: results.analyze.map((analyze) => analyze.disciplines),
                disciplinesPredict: results.predictDisciplines,
                recommend: results.recommend,
                categories: results.analyze.map((analyze) => analyze.data.essentialCategories),
                meta: results.extractMeta,
            })),
            switchMap((data) => {
                const app = createSSRApp({
                    data: () => data,
                    template: bodyTemplate,
                });
                app.component('result', {
                    props: ['result'],
                    template: `
                        <slot v-if="result.isOk()">result works</slot>
                        <p v-else class="error">
                            Ein Fehler ist aufgetreten: {{ result.err().message }}
                        </p>
                    `,
                });
                return renderToString(app);
            }),
            // FIXME: Let the renderer populate the template.
            map((html) => pageTemplate.replace('<!--vue-ssr-outlet-->', html)),
        );
    }
}
